import * as THREE from 'three'
import Experience from '../Experience.js'
import RayCaster from '../Controller/RayCaster.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene      = this.experience.scene
        this.resources  = this.experience.resources

        // Wait for assets
        this.resources.on('ready', () => {
            this.setEnvironment()
            this.setModel()
            this.setLights()
            this.setNeonExtras()
            this.rayCaster = new RayCaster()
            this.experience.trigger('worldReady')
        })
    }

    setEnvironment() {
        // Fog for depth / atmosphere
        this.scene.fog = new THREE.FogExp2('#0a0a0f', 0.08)

        // Environment map (reflections on metallic objects)
        if (this.resources.items.environmentMapTexture) {
            const envMap = this.resources.items.environmentMapTexture
            envMap.encoding = THREE.sRGBEncoding
            this.scene.environment = envMap
        }
    }

    setModel() {
        const gltf = this.resources.items.ramenShopModel
        if (!gltf) return

        this.model = gltf.scene

        // Traverse and tag clickable meshes for raycasting
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow    = true
                child.receiveShadow = true

                // Tag interactive objects by name — Jesse's model uses these names.
                // Adjust these names to match what you see when you inspect the model.
                const interactiveNames = [
                    'about',   'About',   'about_screen',
                    'project', 'Project', 'projects_screen',
                    'skill',   'Skill',   'skills_screen',
                    'contact', 'Contact', 'contact_screen',
                    'computer','monitor', 'tv', 'screen',
                    'phone',   'notebook','book'
                ]

                const matchesInteractive = interactiveNames.some(n =>
                    child.name.toLowerCase().includes(n.toLowerCase())
                )
                if (matchesInteractive) {
                    child.userData.interactive = true
                    child.userData.section = this.inferSection(child.name)
                }
            }
        })

        this.scene.add(this.model)
    }

    inferSection(name) {
        const n = name.toLowerCase()
        if (n.includes('about'))   return 'about'
        if (n.includes('project')) return 'projects'
        if (n.includes('skill'))   return 'skills'
        if (n.includes('contact')) return 'contact'
        // fallback: cycle through sections for untagged interactive objects
        return 'about'
    }

    setLights() {
        // Ambient — very dark to keep cyberpunk feel
        const ambient = new THREE.AmbientLight('#ffffff', 0.15)
        this.scene.add(ambient)

        // Main directional light (soft moonlight from above)
        const dirLight = new THREE.DirectionalLight('#b0c4de', 0.8)
        dirLight.position.set(5, 10, 5)
        dirLight.castShadow = true
        dirLight.shadow.mapSize.width  = 2048
        dirLight.shadow.mapSize.height = 2048
        dirLight.shadow.camera.near    = 0.1
        dirLight.shadow.camera.far     = 30
        dirLight.shadow.camera.left    = -8
        dirLight.shadow.camera.right   = 8
        dirLight.shadow.camera.top     = 8
        dirLight.shadow.camera.bottom  = -8
        this.scene.add(dirLight)

        // ── Neon accent lights ────────────────────────────────────────────

        // Cyan neon strip (left side)
        const cyanLight = new THREE.PointLight('#00f5ff', 3.0, 6, 2)
        cyanLight.position.set(-3, 2.5, 1)
        this.scene.add(cyanLight)

        // Pink neon strip (right side)
        const pinkLight = new THREE.PointLight('#ff006e', 2.5, 6, 2)
        pinkLight.position.set(3, 2.5, 1)
        this.scene.add(pinkLight)

        // Yellow warm glow (center top — lantern-like)
        const yellowLight = new THREE.PointLight('#ffd60a', 1.5, 5, 2)
        yellowLight.position.set(0, 3.5, 0)
        this.scene.add(yellowLight)

        // Floor bounce (subtle green)
        const floorLight = new THREE.PointLight('#39ff14', 0.5, 4, 2)
        floorLight.position.set(0, 0.2, 2)
        this.scene.add(floorLight)

        // Store lights for animation
        this.neonLights = { cyanLight, pinkLight, yellowLight, floorLight }
    }

    setNeonExtras() {
        // Neon glowing floor plane
        const floorGeo = new THREE.PlaneGeometry(20, 20)
        const floorMat = new THREE.MeshStandardMaterial({
            color: '#050508',
            roughness: 0.1,
            metalness: 0.8,
        })
        const floor = new THREE.Mesh(floorGeo, floorMat)
        floor.rotation.x = -Math.PI * 0.5
        floor.position.y = -0.01
        floor.receiveShadow = true
        this.scene.add(floor)

        // Floating particles (neon dust)
        const particleCount = 200
        const positions = new Float32Array(particleCount * 3)
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3]     = (Math.random() - 0.5) * 12
            positions[i * 3 + 1] = Math.random() * 4
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8
        }
        const particleGeo = new THREE.BufferGeometry()
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const particleMat = new THREE.PointsMaterial({
            size: 0.03,
            color: '#00f5ff',
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        })
        this.particles = new THREE.Points(particleGeo, particleMat)
        this.scene.add(this.particles)
    }

    update() {
        if (!this.neonLights) return

        const t = this.experience.time.elapsed * 0.001

        // Subtle neon pulse
        this.neonLights.cyanLight.intensity  = 3.0 + Math.sin(t * 1.2) * 0.4
        this.neonLights.pinkLight.intensity  = 2.5 + Math.sin(t * 0.9 + 1) * 0.3
        this.neonLights.yellowLight.intensity= 1.5 + Math.sin(t * 0.6 + 2) * 0.2

        // Slowly drift particles
        if (this.particles) {
            this.particles.rotation.y = t * 0.02
        }
    }
}
