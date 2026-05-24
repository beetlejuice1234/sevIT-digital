import { useRef, useMemo, useEffect, memo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  mousePosition: React.MutableRefObject<number[]>;
}

/**
 * GPU-Optimized Floating Orb Background
 * 
 * Uses InstancedMesh for high-performance rendering of spheres.
 * Features smooth floating motion and subtle connection lines.
 */
const ParticleSystem = memo(({ count = 120, mousePosition }: ParticleSystemProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { viewport } = useThree();

  // Stable random data generated once to prevent hydration mismatch
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
      
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, velocities, phases };
  }, [count]);

  // Ref-based state to allow mutations in useFrame
  const particlePositions = useRef(new Float32Array(data.positions));
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mouse3D = useMemo(() => new THREE.Vector3(), []);
  const particlePos = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);

  // Line geometry for connections
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 6 * 3); // Max connections
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geometry;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current || !linesRef.current) return;

    const positions = particlePositions.current;
    const velocities = data.velocities;
    const phases = data.phases;
    const time = state.clock.getElapsedTime();

    // Sync mouse position
    mouse3D.set(
      mousePosition.current[0] * viewport.width * 0.5,
      mousePosition.current[1] * viewport.height * 0.5,
      0
    );

    let lineIndex = 0;
    const linePositions = linesRef.current.geometry.attributes.position.array as Float32Array;
    const maxConnections = 2;
    const connectionDistance = 3;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      // Apply movement
      positions[idx] += velocities[idx] + Math.sin(time * 0.5 + phases[i]) * 0.002;
      positions[idx + 1] += velocities[idx + 1] + Math.cos(time * 0.3 + phases[i]) * 0.002;
      positions[idx + 2] += velocities[idx + 2];

      // Mouse repulsion
      particlePos.set(positions[idx], positions[idx + 1], positions[idx + 2]);
      const distToMouse = particlePos.distanceTo(mouse3D);
      if (distToMouse < 3) {
        const force = (3 - distToMouse) / 3 * 0.02;
        direction.copy(particlePos).sub(mouse3D).normalize();
        positions[idx] += direction.x * force;
        positions[idx + 1] += direction.y * force;
      }

      // Boundary wrapping
      if (positions[idx] > 12) positions[idx] = -12;
      if (positions[idx] < -12) positions[idx] = 12;
      if (positions[idx + 1] > 12) positions[idx + 1] = -12;
      if (positions[idx + 1] < -12) positions[idx + 1] = 12;
      if (positions[idx + 2] > 6) positions[idx + 2] = -6;
      if (positions[idx + 2] < -6) positions[idx + 2] = 6;

      // Update Instance
      dummy.position.set(positions[idx], positions[idx + 1], positions[idx + 2]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Handle lines (optimized check)
      if (i % 2 === 0) { // Sparse connections for performance
        let connections = 0;
        for (let j = i + 1; j < count && connections < maxConnections; j++) {
          const jdx = j * 3;
          const distSq = 
            Math.pow(positions[idx] - positions[jdx], 2) + 
            Math.pow(positions[idx + 1] - positions[jdx + 1], 2);
          
          if (distSq < connectionDistance * connectionDistance) {
            linePositions[lineIndex++] = positions[idx];
            linePositions[lineIndex++] = positions[idx + 1];
            linePositions[lineIndex++] = positions[idx + 2];
            linePositions[lineIndex++] = positions[jdx];
            linePositions[lineIndex++] = positions[jdx + 1];
            linePositions[lineIndex++] = positions[jdx + 2];
            connections++;
          }
        }
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Reset unused line segments
    for (let i = lineIndex; i < linePositions.length; i++) {
      linePositions[i] = 0;
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.5} 
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.1} 
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <ParticleSystem count={120} mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}

export default NeuralBackground;
