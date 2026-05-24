import { useRef, useMemo, useEffect, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  mousePosition: React.MutableRefObject<number[]>;
}

const ParticleSystem = memo(({ count = 100, mousePosition }: ParticleSystemProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Stable random positions and phases to avoid hydration mismatch
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, [count]);

  const phases = useMemo(() => {
    const p = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i] = Math.random() * Math.PI * 2;
    }
    return p;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Subtle float motion using stable phase
      pointsRef.current.geometry.attributes.position.array[i3 + 1] += Math.sin(time + phases[i]) * 0.002;
      
      // Mouse interaction
      const dx = pointsRef.current.geometry.attributes.position.array[i3] - mousePosition.current[0] * 5;
      const dy = pointsRef.current.geometry.attributes.position.array[i3 + 1] - mousePosition.current[1] * 5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 2) {
        pointsRef.current.geometry.attributes.position.array[i3] += dx * 0.01;
        pointsRef.current.geometry.attributes.position.array[i3 + 1] += dy * 0.01;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8B5CF6"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

ParticleSystem.displayName = 'ParticleSystem';

function NeuralBackground() {
  const mousePosition = useRef([0, 0]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = [
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      ];
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        frameloop="always"
      >
        <ParticleSystem count={100} mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}

export default NeuralBackground;
