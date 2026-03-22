import { ImageResponse } from "next/og";

export const alt = "OpenTrust – The Memory Layer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0a0a0a 0%, #1a0808 40%, #0a0a1a 70%, #111111 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(220,60,60,0.08) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Logo */}
        <img
          src="https://openclaw.ai/favicon.svg"
          alt=""
          width={80}
          height={80}
          style={{ borderRadius: 16, marginBottom: 32 }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          OpenTrust
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.55)",
            marginTop: 16,
            letterSpacing: "-0.01em",
          }}
        >
          Evidence-backed retrieval &amp; operator-grade memory
        </div>

        {/* Attribution */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 16,
            color: "rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          by OpenKnots
        </div>
      </div>
    ),
    { ...size },
  );
}
