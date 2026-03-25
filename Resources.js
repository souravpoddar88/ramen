import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter {
    constructor(sources) {
        super()

        this.sources = sources
        this.items   = {}
        this.toLoad  = this.sources.length
        this.loaded  = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {}

        // DRACO
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('draco/')

        // GLTF
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.gltfLoader.setDRACOLoader(dracoLoader)

        // Texture
        this.loaders.textureLoader = new THREE.TextureLoader()

        // Cube texture
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()

        // KTX2 (for custom screen textures if added)
        this.loaders.ktx2Loader = new KTX2Loader()
        this.loaders.ktx2Loader.setTranscoderPath('basis/')
    }

    startLoading() {
        // Update loading bar in DOM
        const fill    = document.getElementById('loader-fill')
        const percent = document.getElementById('loader-percent')

        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(source.path, (file) => {
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'texture') {
                this.loaders.textureLoader.load(source.path, (file) => {
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(source.path, (file) => {
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'ktx2Texture') {
                this.loaders.ktx2Loader.load(source.path, (file) => {
                    this.sourceLoaded(source, file)
                })
            }

            // Progress tracking via THREE.DefaultLoadingManager
            THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
                const pct = Math.floor((itemsLoaded / itemsTotal) * 100)
                if (fill)    fill.style.width = pct + '%'
                if (percent) percent.textContent = pct + '%'
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file
        this.loaded++

        if (this.loaded === this.toLoad) {
            // Small delay so loader bar reaches 100% visually
            setTimeout(() => { this.trigger('ready') }, 400)
        }
    }
}
