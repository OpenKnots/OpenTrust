use std::process::Child;
use std::sync::Mutex;
use tauri::{
    AppHandle, Manager, RunEvent,
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    menu::{MenuBuilder, MenuItemBuilder},
};

mod sidecar;

/// Shared state: the child process handle for the Next.js sidecar server.
pub struct SidecarState {
    pub child: Mutex<Option<Child>>,
    pub port: u16,
}

/// IPC command: return the port the sidecar server is running on.
#[tauri::command]
fn sidecar_port(state: tauri::State<SidecarState>) -> u16 {
    state.port
}

/// IPC command: check if the sidecar is alive.
#[tauri::command]
fn sidecar_health(state: tauri::State<SidecarState>) -> bool {
    let guard = state.child.lock().unwrap();
    guard.is_some()
}

/// IPC command: return the platform-appropriate database path.
#[tauri::command]
fn database_path(app: AppHandle) -> Result<String, String> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to resolve app data dir: {e}"))?;
    std::fs::create_dir_all(&data_dir).map_err(|e| format!("Failed to create data dir: {e}"))?;
    let db_path = data_dir.join("opentrust.sqlite");
    Ok(db_path.to_string_lossy().to_string())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            // Pick a free port for the sidecar server
            let port = portpicker::pick_unused_port().unwrap_or(3210);

            // Resolve desktop-appropriate database path
            let data_dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&data_dir)?;
            let db_path = data_dir.join("opentrust.sqlite");

            // Start the sidecar Next.js server
            let child =
                sidecar::start_server(app.handle(), port, &db_path).expect("Failed to start sidecar server");

            app.manage(SidecarState {
                child: Mutex::new(Some(child)),
                port,
            });

            // Wait for the server to be ready, then navigate the webview
            let handle = app.handle().clone();
            std::thread::spawn(move || {
                sidecar::wait_for_ready(port, std::time::Duration::from_secs(30));
                if let Some(window) = handle.get_webview_window("main") {
                    let url = format!("http://localhost:{port}");
                    let _ = window.navigate(url.parse().unwrap());
                }
            });

            // Build system tray menu
            let open_item = MenuItemBuilder::with_id("open", "Open OpenTrust").build(app)?;
            let health_item = MenuItemBuilder::with_id("health", "Memory Health").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "Quit").build(app)?;
            let menu = MenuBuilder::new(app)
                .item(&open_item)
                .separator()
                .item(&health_item)
                .separator()
                .item(&quit_item)
                .build()?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("OpenTrust")
                .menu(&menu)
                .on_menu_event(move |app, event| match event.id().as_ref() {
                    "open" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "health" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let state = app.state::<SidecarState>();
                            let url = format!("http://localhost:{}/memory/health", state.port);
                            let _ = window.navigate(url.parse().unwrap());
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            sidecar_port,
            sidecar_health,
            database_path,
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app, event| {
            if let RunEvent::ExitRequested { .. } = event {
                // Kill the sidecar when the app exits
                let state = app.state::<SidecarState>();
                let mut guard = state.child.lock().unwrap();
                if let Some(ref mut child) = *guard {
                    let _ = child.kill();
                }
                drop(guard);
            }
        });
}
