import { ImageResponse } from "next/og";

export const alt = "OpenTrust.studio — Sharp Claws. Clear Recall.";
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
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #050506 0%, #120406 28%, #0b0b14 68%, #14070a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 18%, rgba(229,57,53,0.22), transparent 28%), radial-gradient(circle at 78% 24%, rgba(168,85,247,0.14), transparent 24%), radial-gradient(circle at 50% 78%, rgba(229,57,53,0.12), transparent 30%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: -40,
            top: 90,
            width: 520,
            height: 520,
            borderRadius: 48,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
            boxShadow: "0 30px 100px rgba(0,0,0,0.28)",
            transform: "rotate(-8deg)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 28,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 2 }}>
                OpenTrust.studio
              </div>
              <div style={{ fontSize: 26, color: "#fff", fontWeight: 700 }}>Memory, made visible</div>
            </div>
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(229,57,53,0.14)",
                border: "1px solid rgba(229,57,53,0.22)",
                color: "#fff",
                fontSize: 14,
              }}
            >
              plugin layer
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              marginTop: 18,
            }}
          >
            {[
              ["Current source", "MEMORY.md + daily notes"],
              ["Review", "provenance, retention, approval"],
              ["Recall", "timeline, search, backups"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  padding: "14px 16px",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1.4 }}>
                  {label}
                </div>
                <div style={{ fontSize: 20, color: "#fff", fontWeight: 600 }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {['reviewable', 'traceable', 'durable'].map((pill) => (
              <div
                key={pill}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.84)",
                  fontSize: 13,
                }}
              >
                {pill}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 64px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.7)",
              fontSize: 16,
            }}
          >
            OpenTrust.studio
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 690,
              gap: 18,
            }}
          >
            <div
              style={{
                fontSize: 76,
                lineHeight: 0.96,
                letterSpacing: "-0.06em",
                color: "#fff",
                fontWeight: 800,
              }}
            >
              Sharp Claws.
              <br />
              Clear Recall.
            </div>

            <div
              style={{
                fontSize: 28,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.72)",
                maxWidth: 660,
              }}
            >
              OpenClaw already stores memory. OpenTrust makes it easier to review, trace, and trust.
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 64,
              bottom: 58,
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "rgba(255,255,255,0.38)",
              fontSize: 18,
            }}
          >
            by OpenKnots
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
