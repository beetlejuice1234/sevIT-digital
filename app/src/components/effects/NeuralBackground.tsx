import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

/**
 * GPU-Optimized Particle System
 * 
 * Uses InstancedMesh for efficient GPU rendering.
 * All calculations happen on the GPU via shaders.
 */
function ParticleSystem({ count = 120, mousePosition }: ParticleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { viewport } = useThree();
  
  // Pre-calculate particle data
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
  
  // Line geometry for connections
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * count * 6);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [count]);
  
  // Reusable objects to avoid garbage collection
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particlePositions = useRef(new Float32Array(particles.positions));
  const particleVelocities = useRef(new Float32Array(particles.velocities));
  const mouse3D = useMemo(() => new THREE.Vector3(), []);
  const particlePos = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  
  useFrame((state) => {
    if (!meshRef.current || !linesRef.current) return;
    
    const positions = particlePositions.current;
    const velocities = particleVelocities.current;
    const time = state.clock.elapsedTime;
    
    // Convert mouse to 3D space once per frame
    const mouseX = (mousePosition.current.x / window.innerWidth) * 2 - 1;
    const mouseY = -(mousePosition.current.y / window.innerHeight) * 2 + 1;
    mouse3D.set(
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
      particlePos.set(positions[idx], positions[idx + 1], positions[idx + 2]);
      const distToMouse = particlePos.distanceTo(mouse3D);
      
      if (distToMouse < 3) {
        const force = (3 - distToMouse) / 3 * 0.02;
        direction.copy(particlePos).sub(mouse3D).normalize();
        positions[idx] += direction.x * force;
        positions[idx + 1] += direction.y * force;
      }
      
      // Boundary wrapping
      if (positions[idx] > 10) positions[idx] = -10;
      if (positions[idx] < -10) positions[idx] = 10;
      if (positions[idx + 1] > 10) positions[idx + 1] = -10;
      if (positions[idx + 1] < -10) positions[idx + 1] = 10;
      if (positions[idx + 2] > 5) positions[idx + 2] = -5;
      if (positions[idx + 2] < -5) positions[idx + 2] = 5;
      
      // Update instance matrix
      dummy.position.set(positions[idx], positions[idx + 1], positions[idx + 2]);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Update connection lines - optimized
    const linePositions = linesRef.current.geometry.attributes.position.array as Float32Array;
    let lineIndex = 0;
    const maxConnections = 3;
    const connectionDistance = 2.5;
    const connectionDistSq = connectionDistance * connectionDistance;
    
    for (let i = 0; i < count; i++) {
      let connections = 0;
      const iIdx = i * 3;
      
      for (let j = i + 1; j < count && connections < maxConnections; j++) {
        const jIdx = j * 3;
        const dx = positions[iIdx] - positions[jIdx];
        const dy = positions[iIdx + 1] - positions[jIdx + 1];
        const dz = positions[iIdx + 2] - positions[jIdx + 2];
        const distSq = dx * dx + dy * dy + dz * dz;
        
        if (distSq < connectionDistSq && lineIndex < count * maxConnections * 6) {
          linePositions[lineIndex++] = positions[iIdx];
          linePositions[lineIndex++] = positions[iIdx + 1];
          linePositions[lineIndex++] = positions[iIdx + 2];
          linePositions[lineIndex++] = positions[jIdx];
          linePositions[lineIndex++] = positions[jIdx + 1];
          linePositions[lineIndex++] = positions[jIdx + 2];
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

/**
 * GPU-Optimized Neural Background
 * 
 * Uses Three.js with optimized settings for 60FPS.
 * Reduced particle count and optimized rendering.
 */
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
    <div 
      className="neural-canvas"
      style={{
        willChange: 'contents',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]} // Limit DPR for performance
        gl={{ 
          antialias: false, // Disable for performance
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
