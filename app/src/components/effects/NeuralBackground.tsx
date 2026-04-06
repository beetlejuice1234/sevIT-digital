import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

function ParticleSystem({ count = 150, mousePosition }: ParticleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { viewport } = useThree();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    
    return { positions, velocities };
  }, [count]);
  
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * count * 6);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [count]);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particlePositions = useRef(new Float32Array(particles.positions));
  const particleVelocities = useRef(new Float32Array(particles.velocities));
  
  useFrame((state) => {
    if (!meshRef.current || !linesRef.current) return;
    
    const positions = particlePositions.current;
    const velocities = particleVelocities.current;
    const time = state.clock.elapsedTime;
    
    // Mouse interaction in 3D space
    const mouseX = (mousePosition.current.x / window.innerWidth) * 2 - 1;
    const mouseY = -(mousePosition.current.y / window.innerHeight) * 2 + 1;
    const mouse3D = new THREE.Vector3(
      mouseX * viewport.width * 0.5,
      mouseY * viewport.height * 0.5,
      0
    );
    
    // Update particle positions
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      
      // Apply velocity
      positions[idx] += velocities[idx];
      positions[idx + 1] += velocities[idx + 1];
      positions[idx + 2] += velocities[idx + 2];
      
      // Add subtle floating motion
      positions[idx] += Math.sin(time * 0.5 + i * 0.1) * 0.002;
      positions[idx + 1] += Math.cos(time * 0.3 + i * 0.1) * 0.002;
      
      // Mouse repulsion
      const particlePos = new THREE.Vector3(
        positions[idx],
        positions[idx + 1],
        positions[idx + 2]
      );
      const distToMouse = particlePos.distanceTo(mouse3D);
      if (distToMouse < 3) {
        const force = (3 - distToMouse) / 3 * 0.02;
        const dir = particlePos.clone().sub(mouse3D).normalize();
        positions[idx] += dir.x * force;
        positions[idx + 1] += dir.y * force;
      }
      
      // Boundary wrapping
      if (positions[idx] > 10) positions[idx] = -10;
      if (positions[idx] < -10) positions[idx] = 10;
      if (positions[idx + 1] > 10) positions[idx + 1] = -10;
      if (positions[idx + 1] < -10) positions[idx + 1] = 10;
      if (positions[idx + 2] > 5) positions[idx + 2] = -5;
      if (positions[idx + 2] < -5) positions[idx + 2] = 5;
      
      // Update instance
      dummy.position.set(positions[idx], positions[idx + 1], positions[idx + 2]);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Update connection lines
    const linePositions = linesRef.current.geometry.attributes.position.array as Float32Array;
    let lineIndex = 0;
    const maxConnections = 3;
    const connectionDistance = 2.5;
    
    for (let i = 0; i < count; i++) {
      let connections = 0;
      for (let j = i + 1; j < count && connections < maxConnections; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < connectionDistance && lineIndex < count * maxConnections * 6) {
          linePositions[lineIndex++] = positions[i * 3];
          linePositions[lineIndex++] = positions[i * 3 + 1];
          linePositions[lineIndex++] = positions[i * 3 + 2];
          linePositions[lineIndex++] = positions[j * 3];
          linePositions[lineIndex++] = positions[j * 3 + 1];
          linePositions[lineIndex++] = positions[j * 3 + 2];
          connections++;
        }
      }
    }
    
    // Clear remaining line positions
    for (let i = lineIndex; i < count * maxConnections * 6; i++) {
      linePositions[i] = 0;
    }
    
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </instancedMesh>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </lineSegments>
    </>
  );
}

function NeuralBackground() {
  const mousePosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="neural-canvas">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <ParticleSystem count={120} mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}

export default NeuralBackground;
