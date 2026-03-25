import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import Experience from '../Experience.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes      = this.experience.sizes
        this.scene      = this.experience.scene
        this.canvas     = this.experience.canvas

        // Camera positions for each "room" / section
        this.positions = {
            default: {
                position: new THREE.Vector3(0, 2.5, 6),
                target:   new THREE.Vector3(0, 0.5, 0)
            },
            about: {
                position: new THREE.Vector3(-3.5, 1.8, 2.5),
                target:   new THREE.Vector3(-3.5, 1.2, 0)
            },
            projects: {
                position: new THREE.Vector3(3.5, 1.8, 2.5),
                target:   new THREE.Vector3(3.5, 1.2, 0)
            },
            skills: {
                position: new THREE.Vector3(0, 3.2, 1.5),
                target:   new THREE.Vector3(0, 2.5, 0)
            },
            contact: {
                position: new THREE.Vector3(0, 1.0, 3.5),
                target:   new THREE.Vector3(0, 0.8, 0)
            }
        }

        this.setInstance()
        this.setOrbitControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        )
        this.instance.position.copy(this.positions.default.position)
        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping  = true
        this.controls.dampingFactor  = 0.05
        this.controls.enablePan      = false
        this.controls.minDistance    = 2
        this.controls.maxDistance    = 10
        this.controls.minPolarAngle  = Math.PI * 0.2
        this.controls.maxPolarAngle  = Math.PI * 0.65
        this.controls.target.copy(this.positions.default.target)
        this.controls.update()
    }

    /**
     * Animate camera to a named position
     * @param {string} posName  - key from this.positions
     * @param {number} duration - seconds
     */
    moveTo(posName, duration = 1.4) {
        const pos = this.positions[posName]
        if (!pos) return

        // Disable user controls during transition
        this.controls.enabled = false

        gsap.to(this.instance.position, {
            x: pos.position.x,
            y: pos.position.y,
            z: pos.position.z,
            duration,
            ease: 'power3.inOut'
        })

        gsap.to(this.controls.target, {
            x: pos.target.x,
            y: pos.target.y,
            z: pos.target.z,
            duration,
            ease: 'power3.inOut',
            onComplete: () => {
                if (posName === 'default') {
                    this.controls.enabled = true
                }
            }
        })
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}
