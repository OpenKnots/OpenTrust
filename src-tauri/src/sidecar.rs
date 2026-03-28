use std::path::Path;
use std::process::{Child, Command, Stdio};
use std::time::{Duration, Instant};
use tauri::{AppHandle, Manager};

/// Start the Next.js sidecar server.
///
/// In dev mode, this expects `next dev` to already be running externally
/// (Tauri's devUrl handles it). In production builds, we start `node`
/// against the built Next.js standalone server.
pub fn start_server(app: &AppHandle, port: u16, db_path: &Path) -> Result<Child, String> {
    let resource_dir = app
        .path()
        .resource_dir()
        .map_err(|e| format!("Failed to resolve resource dir: {e}"))?;

    // The standalone Next.js server is bundled at this path
    let server_js = resource_dir.join("server.js");

    // Resolve the node binary — prefer bundled, fall back to system
    let node_bin = which_node();

    let child = Command::new(&node_bin)
        .arg(server_js.to_string_lossy().to_string())
        .env("PORT", port.to_string())
        .env("HOSTNAME", "127.0.0.1")
        .env("OPENTRUST_DB_PATH", db_path.to_string_lossy().to_string())
        .env("OPENTRUST_DESKTOP", "1")
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to spawn sidecar: {e}"))?;

    Ok(child)
}

/// Wait until the sidecar HTTP server responds to requests.
pub fn wait_for_ready(port: u16, timeout: Duration) {
    let start = Instant::now();
    let url = format!("http://127.0.0.1:{port}");

    loop {
        if start.elapsed() > timeout {
            eprintln!("Sidecar did not become ready within {timeout:?}");
            return;
        }

        match reqwest::blocking::get(&url) {
            Ok(resp) if resp.status().is_success() || resp.status().is_redirection() => {
                return;
            }
            _ => {
                std::thread::sleep(Duration::from_millis(200));
            }
        }
    }
}

/// Find a usable `node` binary on the system.
fn which_node() -> String {
    // Try common locations
    for candidate in &[
        "/usr/local/bin/node",
        "/opt/homebrew/bin/node",
        "/usr/bin/node",
    ] {
        if Path::new(candidate).exists() {
            return candidate.to_string();
        }
    }

    // Fall back to PATH resolution
    "node".to_string()
}
