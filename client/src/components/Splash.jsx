import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

// Custom circle texture creator for smooth particles
const createCircleTexture = () => {
    const size = 16
    const c = document.createElement('canvas')
    c.width = size
    c.height = size
    const ctx = c.getContext('2d')
    if (ctx) {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
        grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, size, size)
    }
    return new THREE.CanvasTexture(c)
}

const Splash = ({ onComplete }) => {
    const canvasRef = useRef(null)
    const [progress, setProgress] = useState(0)
    const progressRef = useRef(0)
    
    // Mouse tracking for parallax
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        let width = window.innerWidth
        let height = window.innerHeight

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Scene
        const scene = new THREE.Scene()

        // Camera
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
        camera.position.z = 35

        // Group wrapper
        const group = new THREE.Group()
        scene.add(group)

        // 1. Inner Holographic Core (Icosahedron Grid)
        const coreGeometry = new THREE.IcosahedronGeometry(4.5, 1)
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xc8b5ff, // Lavender
            wireframe: true,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
        const coreMesh = new THREE.Mesh(coreGeometry, wireframeMaterial)
        group.add(coreMesh)

        // Glowing Core Vertex Points
        const corePointsMaterial = new THREE.PointsMaterial({
            color: 0x6ae9c1, // Aqua
            size: 0.35,
            map: createCircleTexture(),
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
        const corePoints = new THREE.Points(coreGeometry, corePointsMaterial)
        group.add(corePoints)

        // 2. Outer Floating Node Particles
        const particleCount = 120
        const particleGeometry = new THREE.BufferGeometry()
        const positions = new Float32Array(particleCount * 3)
        const colors = new Float32Array(particleCount * 3)
        
        const themeColors = [
            new THREE.Color(0xffb347), // Amber
            new THREE.Color(0x6ae9c1), // Aqua
            new THREE.Color(0xc8b5ff), // Lavender
        ]

        const originalPositions = [] // For burst calculation

        for (let i = 0; i < particleCount; i++) {
            // Generate points inside a spherical shell
            const u = Math.random()
            const v = Math.random()
            const theta = u * 2.0 * Math.PI
            const phi = Math.acos(2.0 * v - 1.0)
            const r = 7 + Math.random() * 5 // Shell radius between 7 and 12

            const px = r * Math.sin(phi) * Math.cos(theta)
            const py = r * Math.sin(phi) * Math.sin(theta)
            const pz = r * Math.cos(phi)

            positions[i * 3] = px
            positions[i * 3 + 1] = py
            positions[i * 3 + 2] = pz

            originalPositions.push({ x: px, y: py, z: pz, r })

            // Assign random theme color
            const col = themeColors[Math.floor(Math.random() * themeColors.length)]
            colors[i * 3] = col.r
            colors[i * 3 + 1] = col.g
            colors[i * 3 + 2] = col.b
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        const outerPointsMaterial = new THREE.PointsMaterial({
            size: 0.45,
            vertexColors: true,
            map: createCircleTexture(),
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })

        const outerPoints = new THREE.Points(particleGeometry, outerPointsMaterial)
        group.add(outerPoints)

        // Constellation Lines connecting outer nodes
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xc8b5ff,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
        const lineGeometry = new THREE.BufferGeometry()
        const constellationLines = new THREE.LineSegments(lineGeometry, lineMaterial)
        group.add(constellationLines)

        // Event listeners
        const handleMouseMove = (e) => {
            mouseRef.current.x = (e.clientX - window.innerWidth / 2) * 0.02
            mouseRef.current.y = (e.clientY - window.innerHeight / 2) * 0.02
        }

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('resize', handleResize)

        // Animation Loop Variables
        let animationFrameId
        let isBursting = false
        let burstScale = 1.0
        let fadeOpacity = 1.0

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate)

            // Progress Increment (simulates system load)
            if (progressRef.current < 100) {
                progressRef.current += (100 - progressRef.current) * 0.025 + 0.3
                if (progressRef.current >= 100) {
                    progressRef.current = 100
                }
                setProgress(Math.floor(progressRef.current))
            } else if (!isBursting) {
                isBursting = true
            }

            // Core rotations
            coreMesh.rotation.y += 0.007
            coreMesh.rotation.x += 0.004
            corePoints.rotation.y += 0.007
            corePoints.rotation.x += 0.004

            // Outer cloud rotation
            outerPoints.rotation.y -= 0.0015
            outerPoints.rotation.z += 0.001

            // Mouse parallax with inertia
            mouseRef.current.targetX += (mouseRef.current.x - mouseRef.current.targetX) * 0.05
            mouseRef.current.targetY += (mouseRef.current.y - mouseRef.current.targetY) * 0.05
            group.rotation.y = mouseRef.current.targetX * 0.08
            group.rotation.x = mouseRef.current.targetY * 0.08

            // Camera Z zoom linked to progress (35 down to 18)
            if (!isBursting) {
                const targetZ = 35 - (progressRef.current / 100) * 16
                camera.position.z += (targetZ - camera.position.z) * 0.05
            } else {
                // Burst expansion animation
                burstScale += 0.06
                fadeOpacity -= 0.035

                // Zoom camera forward rapidly
                camera.position.z -= 0.9

                // Expand positions
                const posArr = particleGeometry.attributes.position.array
                for (let i = 0; i < particleCount; i++) {
                    posArr[i * 3] = originalPositions[i].x * burstScale
                    posArr[i * 3 + 1] = originalPositions[i].y * burstScale
                    posArr[i * 3 + 2] = originalPositions[i].z * burstScale
                }
                particleGeometry.attributes.position.needsUpdate = true

                // Scale inner meshes
                coreMesh.scale.setScalar(burstScale * 0.8)
                corePoints.scale.setScalar(burstScale * 0.8)

                // Apply opacity fades
                wireframeMaterial.opacity = 0.2 * fadeOpacity
                corePointsMaterial.opacity = 0.9 * fadeOpacity
                outerPointsMaterial.opacity = 0.8 * fadeOpacity
                lineMaterial.opacity = 0.08 * fadeOpacity

                // Trigger completion when opacity fades to 0
                if (fadeOpacity <= 0) {
                    cancelAnimationFrame(animationFrameId)
                    onComplete()
                    return
                }
            }

            // Dynamically generate constellation lines
            if (!isBursting) {
                const posArr = particleGeometry.attributes.position.array
                const linePositions = []
                const maxDistance = 5.5

                for (let i = 0; i < particleCount; i++) {
                    const x1 = posArr[i * 3]
                    const y1 = posArr[i * 3 + 1]
                    const z1 = posArr[i * 3 + 2]

                    for (let j = i + 1; j < particleCount; j++) {
                        const x2 = posArr[j * 3]
                        const y2 = posArr[j * 3 + 1]
                        const z2 = posArr[j * 3 + 2]

                        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2)

                        if (dist < maxDistance) {
                            linePositions.push(x1, y1, z1)
                            linePositions.push(x2, y2, z2)
                        }
                    }
                }
                lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
            }

            renderer.render(scene, camera)
        }

        animate()

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', handleResize)

            coreGeometry.dispose()
            wireframeMaterial.dispose()
            corePointsMaterial.dispose()
            particleGeometry.dispose()
            outerPointsMaterial.dispose()
            lineGeometry.dispose()
            lineMaterial.dispose()
            renderer.dispose()
        }
    }, [onComplete])

    return (
        <div className="splash-3d-wrapper" role="dialog" aria-modal="true" aria-label="System Loading">
            <canvas ref={canvasRef} className="splash-3d-canvas" />
            
            {/* Glossy Overlay Glass Card */}
            <div className="splash-overlay-card">
                <div className="splash-logo-container">
                    <img src="/Logo.png" alt="Mind Matrix logo" className="splash-logo-img" />
                </div>
                <h1 className="splash-logo">Mind Matrix</h1>
                <p className="splash-tagline">UPGRADE YOUR MENTAL OPERATING SYSTEM</p>
                
                {/* Progress bar container */}
                <div className="splash-progress">
                    <div 
                        className="splash-bar" 
                        style={{ width: `${progress}%` }} 
                        role="progressbar" 
                        aria-valuenow={progress} 
                        aria-valuemin="0" 
                        aria-valuemax="100" 
                    />
                </div>
                
                <div className="splash-status-text">
                    SYS LOAD: <span className="status-percent">{progress}%</span>
                </div>

                <div className="splash-sparkles" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </div>
            </div>
        </div>
    )
}

export default Splash
