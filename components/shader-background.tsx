"use client"

import { MeshGradient, NeuroNoise } from "@paper-design/shaders-react"

export function MeshGradientBg({
  colors = ["#0a0a0a", "#1a0808", "#0a0a1a", "#121212"],
  speed = 0.4,
  className,
  style,
}: {
  colors?: string[]
  speed?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <MeshGradient
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...style }}
      colors={colors}
      speed={speed}
      distortion={0.3}
      swirl={0.2}
    />
  )
}

export function NeuroNoiseBg({
  colorBack = "#0a0a0a",
  colorMid = "#1a0808",
  colorFront = "#2a1515",
  speed = 0.3,
  className,
  style,
}: {
  colorBack?: string
  colorMid?: string
  colorFront?: string
  speed?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <NeuroNoise
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...style }}
      colorBack={colorBack}
      colorMid={colorMid}
      colorFront={colorFront}
      brightness={0.05}
      contrast={0.25}
      speed={speed}
      scale={1.2}
    />
  )
}
