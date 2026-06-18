import { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 1800;

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const sz = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      // random sphere shell distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.pow(Math.random(), 0.5) * 5.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.008 + Math.random() * 0.022;
    }
    return { positions: pos, sizes: sz };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const lf = 1 - Math.pow(0.04, delta);
    smooth.current.x += (mouse.current.x - smooth.current.x) * lf;
    smooth.current.y += (mouse.current.y - smooth.current.y) * lf;

    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += (smooth.current.y * 0.18 - ref.current.rotation.x) * 0.05;
    ref.current.rotation.z += (smooth.current.x * 0.06 - ref.current.rotation.z) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e4b363"
        size={0.016}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
        fog={false}
      />
    </points>
  );
}

export function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 70 }}
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Particles />
      </Suspense>
    </Canvas>
  );
}
