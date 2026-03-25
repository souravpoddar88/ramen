import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import Experience from '../Experience.js'

export default class Renderer {
    constructor() {
        this.experience = new Experience()
        this.canvas     = this.experience.canvas
        this.sizes      = this.experience.sizes
        this.scene      = this.experience.scene
        this.camera     = this.experience.camera

        this.setInstance()
        this.setPostProcessing()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas:     this.canvas,
            antialias:  true,
            powerPreference: 'high-performance'
        })
        this.instance.physicallyCorrectLights = true
        this.instance.outputEncoding          = THREE.sRGBEncoding
        this.instance.toneMapping             = THREE.ACESFilmicToneMapping
        this.instance.toneMappingExposure     = 1.0
        this.instance.shadowMap.enabled       = true
        this.instance.shadowMap.type          = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#0a0a0f')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    setPostProcessing() {
        this.composer = new EffectComposer(this.instance)

        // Render pass
        const renderPass = new RenderPass(this.scene, this.camera.instance)
        this.composer.addPass(renderPass)

        // Bloom for neon glow effect
        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.sizes.width, this.sizes.height),
            0.6,   // strength
            0.4,   // radius
            0.85   // threshold
        )
        this.composer.addPass(this.bloomPass)
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        this.composer.setSize(this.sizes.width, this.sizes.height)
    }

    update() {
        this.composer.render()
    }
}
