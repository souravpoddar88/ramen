import * as THREE from 'three'
import Experience from '../Experience.js'

export default class RayCaster {
    constructor() {
        this.experience = new Experience()
        this.camera     = this.experience.camera
        this.scene      = this.experience.scene
        this.sizes      = this.experience.sizes
        this.controller = this.experience.controller

        this.raycaster   = new THREE.Raycaster()
        this.mouse       = new THREE.Vector2()
        this.hovered     = null

        // Collect all interactive meshes from the scene
        this.interactives = []
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.userData.interactive) {
                this.interactives.push(child)
            }
        })

        this.setEvents()
    }

    setEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x =  (e.clientX / this.sizes.width)  * 2 - 1
            this.mouse.y = -(e.clientY / this.sizes.height) * 2 + 1
        })

        window.addEventListener('click', () => {
            if (this.hovered) {
                const section = this.hovered.userData.section
                if (section && this.controller) {
                    this.controller.openSection(section)
                }
            }
        })

        // Touch support
        window.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0]
            this.mouse.x =  (touch.clientX / this.sizes.width)  * 2 - 1
            this.mouse.y = -(touch.clientY / this.sizes.height) * 2 + 1
            this.checkIntersect()
            if (this.hovered) {
                const section = this.hovered.userData.section
                if (section && this.controller) {
                    this.controller.openSection(section)
                }
            }
        })
    }

    checkIntersect() {
        this.raycaster.setFromCamera(this.mouse, this.camera.instance)
        const intersects = this.raycaster.intersectObjects(this.interactives)

        if (intersects.length > 0) {
            const first = intersects[0].object
            if (this.hovered !== first) {
                this.hovered = first
                document.body.style.cursor = 'pointer'
            }
        } else {
            if (this.hovered) {
                this.hovered = null
                document.body.style.cursor = 'default'
            }
        }
    }

    update() {
        this.checkIntersect()
    }
}
