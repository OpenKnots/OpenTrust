"use client"

import React, { Component, lazy, Suspense, useEffect, useState } from "react"
import type { ReactNode } from "react"

const LazyMeshGradient = lazy(() =>
  import("@paper-design/shaders-react").then((m) => ({ default: m.MeshGradient }))
)
const LazyNeuroNoise = lazy(() =>
  import("@paper-design/shaders-react").then((m) => ({ default: m.NeuroNoise }))
)

function isMobileDevice() {
  if (typeof window === "undefined") return false
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || (navigator.maxTouchPoints > 0 && window.innerWidth < 1024)
}

function hasWebGL() {
  if (typeof document === "undefined") return false
  try {
    const canvas = document.createElement("canvas")
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}

class ShaderErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

function CSSFallback({
  colors,
  className,
  style,
}: {
  colors: string[]
  className?: string
  style?: React.CSSProperties
}) {
  const bg = `radial-gradient(ellipse at 30% 20%, ${colors[1] ?? colors[0]}cc, transparent 60%), radial-gradient(ellipse at 70% 80%, ${colors[2] ?? colors[0]}cc, transparent 60%), ${colors[0]}`
  return (
    <div
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: bg, ...style }}
    />
  )
}

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
  const [useShader, setUseShader] = useState(false)

  useEffect(() => {
    setUseShader(!isMobileDevice() && hasWebGL())
  }, [])

  const fallback = <CSSFallback colors={colors} className={className} style={style} />

  if (!useShader) return fallback

  return (
    <ShaderErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <LazyMeshGradient
          className={className}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...style }}
          colors={colors}
          speed={speed}
          distortion={0.3}
          swirl={0.2}
        />
      </Suspense>
    </ShaderErrorBoundary>
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
  const [useShader, setUseShader] = useState(false)

  useEffect(() => {
    setUseShader(!isMobileDevice() && hasWebGL())
  }, [])

  const fallback = (
    <CSSFallback
      colors={[colorBack, colorMid, colorFront]}
      className={className}
      style={style}
    />
  )

  if (!useShader) return fallback

  return (
    <ShaderErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <LazyNeuroNoise
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
      </Suspense>
    </ShaderErrorBoundary>
  )
}
