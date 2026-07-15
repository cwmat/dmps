import { useEffect, useMemo, useRef, type ComponentRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  Icosahedron,
  Lightformer,
  MeshDistortMaterial,
  PointMaterial,
  Points,
} from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

interface SceneProps {
  /** When true, the brain revs into a fast, bright "computing" state. */
  thinking: boolean
  /** When true, freeze all motion and render a single static frame. */
  reducedMotion: boolean
}

/** Idle vs thinking targets the material/motion eases toward every frame. */
const IDLE = {
  distort: 0.34,
  speed: 1.1,
  emissiveIntensity: 0.9,
  spin: 0.14,
  color: new THREE.Color('#7b2ff7'),
}
const THINKING = {
  distort: 0.72,
  speed: 4.6,
  emissiveIntensity: 2.6,
  spin: 0.95,
  color: new THREE.Color('#00e5ff'),
}

type DistortMaterial = ComponentRef<typeof MeshDistortMaterial>

function Brain({ thinking, reducedMotion }: SceneProps) {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<DistortMaterial>(null)
  const emissive = useRef(new THREE.Color(IDLE.color))

  useFrame((state, delta) => {
    const g = group.current
    const m = mat.current
    if (!g || !m) return

    // Gentle mouse parallax regardless of thinking state.
    const px = state.pointer.x * 0.25
    const py = state.pointer.y * 0.25
    g.rotation.x += (py - g.rotation.x) * Math.min(1, delta * 2)

    if (reducedMotion) return // static frame: leave material at idle defaults

    const t = thinking ? THINKING : IDLE
    // Frame-rate independent smoothing factor.
    const k = 1 - Math.pow(0.0015, delta)

    // MeshDistortMaterial exposes `distort` and `speed` as live uniforms.
    const dm = m as unknown as { distort: number; speed: number }
    dm.distort = THREE.MathUtils.lerp(dm.distort, t.distort, k)
    dm.speed = THREE.MathUtils.lerp(dm.speed, t.speed, k)
    m.emissiveIntensity = THREE.MathUtils.lerp(m.emissiveIntensity, t.emissiveIntensity, k)
    emissive.current.lerp(t.color, k)
    m.emissive.copy(emissive.current)

    g.rotation.y += t.spin * delta
    g.rotation.z += (px - g.rotation.z) * Math.min(1, delta * 2)
  })

  return (
    <group ref={group}>
      <Icosahedron args={[1, 24]}>
        {/* Emissive-forward so the "brain" glows even without an HDR env map;
            moderate metalness picks up the procedural Environment reflections. */}
        <MeshDistortMaterial
          ref={mat}
          color="#2a1a5e"
          emissive={IDLE.color}
          emissiveIntensity={IDLE.emissiveIntensity}
          metalness={0.55}
          roughness={0.28}
          distort={IDLE.distort}
          speed={IDLE.speed}
        />
      </Icosahedron>
    </group>
  )
}

function Synapses({ thinking, reducedMotion, count = 1600 }: SceneProps & { count?: number }) {
  const points = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 1.45 + Math.random() * 0.9
      const theta = Math.acos(2 * Math.random() - 1)
      const phi = Math.random() * Math.PI * 2
      p[i * 3] = r * Math.sin(theta) * Math.cos(phi)
      p[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi)
      p[i * 3 + 2] = r * Math.cos(theta)
    }
    return p
  }, [count])

  useFrame((_, delta) => {
    if (reducedMotion || !points.current) return
    const spin = thinking ? 0.6 : 0.08
    points.current.rotation.y -= spin * delta
    points.current.rotation.x += spin * 0.35 * delta
  })

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={thinking ? '#7bf0ff' : '#a78bfa'}
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </Points>
  )
}

/**
 * Layer 2 — the "thinking brain" 3D background.
 * A fixed, click-through canvas rendered behind the DOM UI.
 */
export default function BrainScene({ thinking, reducedMotion }: SceneProps) {
  // react-use-measure (R3F's sizing observer) sometimes misses its very first
  // observation on mount, leaving the canvas at its default 300x150. Nudge a few
  // resize events after mount — whichever lands once R3F has attached its resize
  // listener forces it to measure the (already-sized) container and call setSize.
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'))
    const raf = requestAnimationFrame(fire)
    const timers = [60, 200, 500].map((ms) => setTimeout(fire, ms))
    return () => {
      cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
    }
  }, [])

  // Wrap in our own fixed, click-through layer. R3F stamps its own inline
  // styles on the <Canvas> container (position: relative; pointer-events: auto),
  // which would beat Tailwind classes — so we position the wrapper instead and
  // let the Canvas fill it, guaranteeing a viewport-sized drawing buffer.
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[2]">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 3, 5]} intensity={40} color="#a78bfa" />
        <pointLight position={[-5, -2, 2]} intensity={25} color="#00e5ff" />

        {/* Procedural reflections — no HDR download, works offline / on Pages. */}
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 2, 4]} scale={[7, 7, 1]} color="#a78bfa" />
          <Lightformer intensity={1.6} position={[-4, -1, 3]} scale={[5, 5, 1]} color="#00e5ff" />
          <Lightformer intensity={1.2} position={[4, 1, -3]} scale={[5, 5, 1]} color="#7b2ff7" />
        </Environment>

        <Brain thinking={thinking} reducedMotion={reducedMotion} />
        <Synapses thinking={thinking} reducedMotion={reducedMotion} />

        {!reducedMotion && (
          <EffectComposer>
            <Bloom
              intensity={thinking ? 1.5 : 0.7}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
