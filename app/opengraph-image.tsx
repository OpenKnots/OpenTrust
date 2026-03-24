import { ImageResponse } from "next/og";

export const alt = "OpenTrust — Memory, made operational.";
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
          background: "#050505",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Layered ambient glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(ellipse 80% 60% at 25% 50%, rgba(229,57,53,0.13), transparent 70%), radial-gradient(ellipse 50% 80% at 75% 30%, rgba(168,85,247,0.06), transparent 60%), radial-gradient(ellipse 70% 50% at 60% 85%, rgba(229,57,53,0.05), transparent 50%)",
          }}
        />

        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Right-side visual: layered memory cards */}
        <div
          style={{
            position: "absolute",
            right: 64,
            top: 0,
            bottom: 0,
            width: 400,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {/* Top decorative line */}
          <div
            style={{
              position: "absolute",
              top: 80,
              right: 60,
              width: 1,
              height: 100,
              display: "flex",
              background:
                "linear-gradient(180deg, transparent, rgba(229,57,53,0.3), transparent)",
            }}
          />

          {/* Memory card 1 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "18px 22px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: "#22c55e",
                    display: "flex",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  Approved
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                MEMORY.md
              </span>
            </div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", fontWeight: 500 }}>
              Deployment timing shifted to Q2 window
            </div>
          </div>

          {/* Memory card 2 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "18px 22px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: "#f59e0b",
                    display: "flex",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  Pending review
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                2026-03-24.md
              </span>
            </div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", fontWeight: 500 }}>
              Architecture decision: local-first plugin model
            </div>
          </div>

          {/* Memory card 3 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "18px 22px",
              borderRadius: 16,
              border: "1px solid rgba(229,57,53,0.12)",
              background:
                "linear-gradient(135deg, rgba(229,57,53,0.06), rgba(229,57,53,0.02))",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: "#E53935",
                    display: "flex",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                  }}
                >
                  Meaningful moment
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                auto-detected
              </span>
            </div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", fontWeight: 500 }}>
              First open-source contributor joined the project
            </div>
          </div>

          {/* Pill row */}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            {["traceable", "reviewable", "durable"].map((pill) => (
              <div
                key={pill}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                }}
              >
                {pill}
              </div>
            ))}
          </div>

          {/* Bottom decorative line */}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 30,
              width: 1,
              height: 80,
              display: "flex",
              background:
                "linear-gradient(180deg, transparent, rgba(168,85,247,0.2), transparent)",
            }}
          />
        </div>

        {/* Left content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
            maxWidth: 700,
            height: "100%",
            gap: 0,
          }}
        >
          {/* Logo badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, rgba(229,57,53,0.2), rgba(229,57,53,0.08))",
                border: "1px solid rgba(229,57,53,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(229,57,53,0.9)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: 0.4,
              }}
            >
              OpenTrust
            </span>
            <div
              style={{
                width: 1,
                height: 16,
                background: "rgba(255,255,255,0.12)",
                display: "flex",
                marginLeft: 2,
                marginRight: 2,
              }}
            />
            <span
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: 0.3,
              }}
            >
              by OpenKnots
            </span>
          </div>

          {/* Main headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 72,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              Memory,
            </div>
            <div
              style={{
                fontSize: 72,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                fontWeight: 800,
                background:
                  "linear-gradient(90deg, #E53935 0%, #ef5350 40%, #a855f7 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              made visible.
            </div>
          </div>

          {/* Subline */}
          <div
            style={{
              marginTop: 28,
              fontSize: 22,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.45)",
              maxWidth: 480,
              fontWeight: 400,
            }}
          >
            Review, trace, and trust every piece of agent memory. Local-first. Open source.
          </div>

          {/* Bottom accent bar */}
          <div
            style={{
              position: "absolute",
              left: 72,
              bottom: 52,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 32,
                height: 3,
                borderRadius: 2,
                background:
                  "linear-gradient(90deg, #E53935, rgba(229,57,53,0.3))",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.25)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              opentrust.studio
            </span>
          </div>
        </div>

        {/* Top-right subtle corner accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            display: "flex",
            background:
              "radial-gradient(circle at 100% 0%, rgba(229,57,53,0.08), transparent 70%)",
          }}
        />

        {/* Bottom edge line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            display: "flex",
            background:
              "linear-gradient(90deg, transparent, rgba(229,57,53,0.3) 30%, rgba(168,85,247,0.2) 70%, transparent)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
