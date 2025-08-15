import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ParticleGrid = ({ count = 50, spacing = 0.8 }) => {
  const meshRef = useRef()

  const { positions, colors } = useMemo(() => {
    const pos = []
    const col = []
    const offset = (count - 1) * spacing * 0.5
    
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const x = i * spacing - offset
        const z = j * spacing - offset
        const y = 0
        pos.push(x, y, z)

        // Soft light gray-blue particles matching hero bg
        const intensity = 0.35 + Math.random() * 0.25
        col.push(intensity * 0.65, intensity * 0.7, intensity * 0.8) // subtle bluish-gray
      }
    }
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col)
    }
  }, [count, spacing])

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const time = clock.getElapsedTime()
    const positions = meshRef.current.geometry.attributes.position.array
    const colors = meshRef.current.geometry.attributes.color.array

    let idx = 0
    let colorIdx = 0
    const offset = (count - 1) * spacing * 0.5

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const baseX = i * spacing - offset
        const baseZ = j * spacing - offset

        const wave1 = Math.sin(time * 0.7 + baseX * 0.4 + baseZ * 0.3) * 0.5
        const wave2 = Math.sin(time * 0.5 + baseZ * 0.45 + baseX * 0.4) * 0.3
        const wave3 = Math.sin(time * 0.9 + (baseX + baseZ) * 0.15) * 0.25

        const distanceFromCenter = Math.sqrt(baseX * baseX + baseZ * baseZ)
        const ripple = Math.sin(time * 1.1 - distanceFromCenter * 0.21) * 0.4

        const offsetX = Math.sin(time * 0.4 + baseZ * 0.35) * 0.18
        const offsetY = wave1 + wave2 + wave3 + ripple
        const offsetZ = Math.sin(time * 0.6 + baseX * 0.25) * 0.18

        positions[idx++] = baseX + offsetX
        positions[idx++] = offsetY
        positions[idx++] = baseZ + offsetZ

        const heightFactor = (offsetY + 1.5) * 0.15
        colors[colorIdx++] = 0.45 + heightFactor * 0.15 // R lighter blue-gray
        colors[colorIdx++] = 0.5 + heightFactor * 0.15  // G
        colors[colorIdx++] = 0.55 + heightFactor * 0.1  // B
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
    meshRef.current.geometry.attributes.color.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.55}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

const SecondaryParticles = ({ count = 150 }) => {
  const meshRef = useRef()

  const positions = useMemo(() => {
    const pos = []
    for (let i = 0; i < count; i++) {
      pos.push(
        (Math.random() - 0.5) * 48, // x
        (Math.random() - 0.5) * 25, // y
        (Math.random() - 0.5) * 48  // z
      )
    }
    return new Float32Array(pos)
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const time = clock.getElapsedTime()
    const positions = meshRef.current.geometry.attributes.position.array

    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(time * 0.3 + positions[i] * 0.07) * 0.0018
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
    meshRef.current.rotation.y = time * 0.025
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#a0aec0"
        transparent={true}
        opacity={0.3}
      />
    </points>
  )
}

const MorphingParticleBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{zIndex: 0}}>
      <Canvas
        camera={{ 
          position: [0, 9, 20], 
          fov: 75,
          near: 0.1, 
          far: 1000 
        }}
        style={{ 
          width: '100%',
          height: '100%',
          background: 'transparent'
        }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[7, 12, 8]} intensity={0.2} />
        <directionalLight position={[-5, 10, -5]} intensity={0.1} />
        <ParticleGrid count={50} spacing={0.85} />
        <SecondaryParticles count={160} />
        <CameraController />
      </Canvas>
    </div>
  )
}

const CameraController = () => {
  useFrame(({ camera, clock }) => {
    const time = clock.getElapsedTime()
    camera.position.x = Math.sin(time * 0.03) * 1
    camera.position.y = 9 + Math.sin(time * 0.04) * 0.4
    camera.position.z = 20 + Math.cos(time * 0.05) * 1.5
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default MorphingParticleBackground
