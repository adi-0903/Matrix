import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    
    // Setup dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 30;

    // Particle Group
    const group = new THREE.Group();
    scene.add(group);

    // Create particles (Nodes)
    const particleCount = 140;
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const colors = new Float32Array(particleCount * 3);

    // Color definitions corresponding to theme (Amber, Aqua, Lavender)
    const themeColors = [
      new THREE.Color(0xffb347), // Amber
      new THREE.Color(0x6ae9c1), // Aqua
      new THREE.Color(0xc8b5ff), // Lavender
    ];

    for (let i = 0; i < particleCount; i++) {
      // Position in a sphere/box
      const x = (Math.random() - 0.5) * 45;
      const y = (Math.random() - 0.5) * 45;
      const z = (Math.random() - 0.5) * 45;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Small velocities for subtle breathing/drifting motion
      velocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.015
      });

      // Assign theme colors
      const color = themeColors[Math.floor(Math.random() * themeColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create a circular particle texture programmatically to avoid external asset dependency
    const createCircleTexture = () => {
      const size = 16;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    };

    // Point Material
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      map: createCircleTexture(),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, pointsMaterial);
    group.add(points);

    // Lines Connecting Nodes (Constellation grid network)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x9fa1b5,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const lineGeometry = new THREE.BufferGeometry();
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lineMesh);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      // Calculate normalized mouse coords from center
      mouseX = (e.clientX - window.innerWidth / 2) * 0.03;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.03;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse follow interpolation (inertia)
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Slow ambient automatic rotation
      group.rotation.y += 0.0006;
      group.rotation.x += 0.0003;

      // Apply mouse parallax shift
      group.rotation.y += (targetX * 0.008 - group.rotation.y) * 0.08;
      group.rotation.x += (targetY * 0.008 - group.rotation.x) * 0.08;

      // Animate individual node positions (gentle drift / breathing)
      const positionsArray = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positionsArray[i * 3] += velocities[i].x;
        positionsArray[i * 3 + 1] += velocities[i].y;
        positionsArray[i * 3 + 2] += velocities[i].z;

        // Bouncing logic on sphere boundaries (keep nodes contained in a neat 3D space)
        if (Math.abs(positionsArray[i * 3]) > 22) velocities[i].x *= -1;
        if (Math.abs(positionsArray[i * 3 + 1]) > 22) velocities[i].y *= -1;
        if (Math.abs(positionsArray[i * 3 + 2]) > 22) velocities[i].z *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      // Generate connection lines between nearby nodes dynamically
      const linePositions = [];
      const maxDistance = 8.5;

      for (let i = 0; i < particleCount; i++) {
        const x1 = positionsArray[i * 3];
        const y1 = positionsArray[i * 3 + 1];
        const z1 = positionsArray[i * 3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
          const x2 = positionsArray[j * 3];
          const y2 = positionsArray[j * 3 + 1];
          const z2 = positionsArray[j * 3 + 2];

          const dist = Math.sqrt(
            (x1 - x2) ** 2 +
            (y1 - y2) ** 2 +
            (z1 - z2) ** 2
          );

          if (dist < maxDistance) {
            linePositions.push(x1, y1, z1);
            linePositions.push(x2, y2, z2);
          }
        }
      }

      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      pointsMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block'
      }}
    />
  );
};

export default ThreeBackground;
