export default [
    // ─── Ramen Shop 3D Model ───────────────────────────────────────────────
    // Download from: https://github.com/enderh3art/Ramen-Shop/tree/main/static/models
    // Place the .glb file at: static/models/ramenShop.glb
    {
        name: 'ramenShopModel',
        type: 'gltfModel',
        path: 'models/ramenShop.glb'
    },
    // ─── Environment Map ──────────────────────────────────────────────────
    // Download from: https://github.com/enderh3art/Ramen-Shop/tree/main/static/textures
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path: [
            'textures/environmentMap/px.jpg',
            'textures/environmentMap/nx.jpg',
            'textures/environmentMap/py.jpg',
            'textures/environmentMap/ny.jpg',
            'textures/environmentMap/pz.jpg',
            'textures/environmentMap/nz.jpg'
        ]
    }
    // ─── Additional KTX2 Textures (optional) ──────────────────────────────
    // If you have custom .ktx2 screen textures (About, Projects, Skills screens
    // in the 3D scene), add them here. These are optional — the project works
    // without them; info panels pop up instead when clicking objects.
    //
    // Example:
    // { name: 'aboutScreen', type: 'ktx2Texture', path: 'textures/ktx2/about.ktx2' }
]
