# 🍜 Sourav Kumar — 3D Portfolio
### Ramen Shop style • Three.js • GSAP • Vercel

---

## 🎯 What This Is

An exact clone of Jesse Zhou's viral 3D Ramen Shop portfolio  
(github.com/enderh3art/Ramen-Shop) — customised with **your** data  
from your CV. The 3D shop, neon lights, camera transitions and  
cyberpunk aesthetic are identical. Your name, projects, skills and  
contact details replace Jesse's.

---

## 📁 Project Structure

```
sourav-portfolio/
├── bundler/
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── src/
│   ├── index.html          ← All HTML panels (About / Projects / Skills / Contact)
│   ├── index.js            ← Entry point
│   ├── style.css           ← Cyberpunk neon styles
│   └── Experience/
│       ├── Experience.js   ← Singleton orchestrator
│       ├── sources.js      ← Asset list
│       ├── Camera/
│       │   └── Camera.js   ← GSAP camera transitions
│       ├── Controller/
│       │   ├── Controller.js   ← State machine (loading→start→explore→section)
│       │   └── RayCaster.js    ← Click detection on 3D objects
│       ├── Renderer/
│       │   └── Renderer.js ← WebGL + Bloom post-processing
│       ├── Utils/
│       │   ├── EventEmitter.js
│       │   ├── Sizes.js
│       │   ├── Time.js
│       │   └── Resources.js    ← Asset loader (GLTF, KTX2, textures)
│       └── World/
│           └── World.js    ← Scene, model, lights, particles
├── static/                 ← PUT 3D ASSETS HERE (see Step 2)
│   ├── models/
│   │   └── ramenShop.glb   ← Download from Jesse's repo
│   ├── textures/
│   │   └── environmentMap/ ← Download from Jesse's repo
│   └── draco/              ← Download from Jesse's repo
├── vercel.json
├── package.json
└── .gitignore
```

---

## 🚀 SETUP IN 5 STEPS

---

### STEP 1 — Install Node.js & clone this repo

```bash
# Make sure Node.js 18+ is installed
node --version

# Install dependencies
npm install
```

---

### STEP 2 — Download the 3D Assets (CRITICAL)

The 3D Ramen Shop model and textures are from Jesse's open-source repo.  
You **must** download them and place them in the `static/` folder.

#### Option A — Download via Git (recommended)

```bash
# Clone Jesse's repo separately
git clone https://github.com/enderh3art/Ramen-Shop.git jesse-original

# Copy the static assets into YOUR project
cp -r jesse-original/static/models     ./static/
cp -r jesse-original/static/textures   ./static/
cp -r jesse-original/static/draco      ./static/
cp -r jesse-original/static/basis      ./static/

# (Optional) copy sounds too
cp -r jesse-original/static/sounds     ./static/
```

#### Option B — Download manually from GitHub

1. Go to: https://github.com/enderh3art/Ramen-Shop/tree/main/static
2. Download the entire `static/` folder (use a tool like DownGit:  
   https://download-directory.github.io/?url=https://github.com/enderh3art/Ramen-Shop/tree/main/static)
3. Paste the contents into your `static/` folder

**Your static folder should look like:**
```
static/
├── models/
│   └── ramenShop.glb          ← The 3D shop model
├── textures/
│   ├── environmentMap/        ← px.jpg, nx.jpg, py.jpg, ny.jpg, pz.jpg, nz.jpg
│   └── ktx2/                  ← Custom screen textures (see Step 4)
├── draco/                     ← DRACO decoder files
├── basis/                     ← KTX2 transcoder files
└── sounds/                    ← (optional) ambient audio
```

---

### STEP 3 — Run locally

```bash
npm run dev
# Opens at http://localhost:8080
```

You should see:
- ✅ "Sourav's Lab" loading screen with progress bar
- ✅ Ramen Shop 3D scene loads  
- ✅ "ENTER" button transitions you into the 3D world  
- ✅ Clicking objects opens your info panels  
- ✅ Neon cyan/pink lights pulse  
- ✅ Camera animates on section open

---

### STEP 4 — Customise the 3D Screen Textures (OPTIONAL but impressive)

Jesse's model has several "screens" (TV, monitors, boards) in the 3D scene.  
By default, clicking them opens the HTML panels (which already have your data).

If you want your NAME and content to appear ON the 3D screens themselves,  
you need to create .ktx2 texture images. Here's how:

#### 4a. Create your screen images (PNG, 1024×512px each)

Design 4 images in Figma / Canva / Photoshop:
- `about-screen.png`    — Name, role, education, achievements
- `projects-screen.png` — Croxora + Event Manager summaries  
- `skills-screen.png`   — Languages, frameworks, certifications
- `contact-screen.png`  — Email, GitHub, LinkedIn

**Design tip:** Dark background (#0a0a0f), cyan (#00f5ff) headings,  
white body text, Orbitron font for headings.

#### 4b. Convert PNG → KTX2

Install KTX-Software: https://github.com/KhronosGroup/KTX-Software/releases

```bash
# Convert each PNG to KTX2
toktx --t2 --bcmp static/textures/ktx2/about-screen.ktx2   about-screen.png
toktx --t2 --bcmp static/textures/ktx2/projects-screen.ktx2 projects-screen.png
toktx --t2 --bcmp static/textures/ktx2/skills-screen.ktx2  skills-screen.png
toktx --t2 --bcmp static/textures/ktx2/contact-screen.ktx2 contact-screen.png
```

#### 4c. Add them to sources.js

Open `src/Experience/sources.js` and uncomment the KTX2 entries:

```js
{ name: 'aboutScreen',    type: 'ktx2Texture', path: 'textures/ktx2/about-screen.ktx2' },
{ name: 'projectsScreen', type: 'ktx2Texture', path: 'textures/ktx2/projects-screen.ktx2' },
{ name: 'skillsScreen',   type: 'ktx2Texture', path: 'textures/ktx2/skills-screen.ktx2' },
{ name: 'contactScreen',  type: 'ktx2Texture', path: 'textures/ktx2/contact-screen.ktx2' },
```

#### 4d. Apply textures to the 3D model screens in World.js

In `src/Experience/World/World.js` inside `setModel()`, after the traverse loop, add:

```js
this.model.traverse((child) => {
    if (child.name.toLowerCase().includes('about_screen')) {
        child.material.map = this.resources.items.aboutScreen
        child.material.emissiveMap = this.resources.items.aboutScreen
        child.material.emissive = new THREE.Color('#00f5ff')
        child.material.emissiveIntensity = 0.3
        child.material.needsUpdate = true
    }
    // Repeat for projects, skills, contact...
})
```

---

### STEP 5 — Deploy to Vercel

#### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Done! You'll get a URL like `https://sourav-portfolio.vercel.app`

#### Option B — GitHub + Vercel Dashboard

1. Push this project to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Sourav Kumar 3D Portfolio"
   git remote add origin https://github.com/YOUR_USERNAME/sourav-portfolio.git
   git push -u origin main
   ```

2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Vercel auto-detects the settings from `vercel.json`
5. Click **Deploy** — done in ~2 minutes! 🚀

---

## 🎨 Customisation Reference

### Your Data (already filled in)

| Section   | Content |
|-----------|---------|
| **Name**  | Sourav Kumar |
| **Role**  | Full Stack Developer |
| **Uni**   | Lovely Professional University, Punjab • B.Tech CSE • CGPA 7.40 |
| **Email** | souravkumarkumar23@gmail.com |
| **GitHub**| github.com/Souravkumar |
| **LinkedIn** | linkedin.com/in/souravpoddar |
| **Phone** | +91 8168806196 |

### Projects (already filled in)

- **Croxora** — Full-Stack E-Commerce Platform (React, Node, MongoDB, Stripe, JWT)
- **Event Manager App** — DSA-Powered (C++, STL, OOP, Stacks, Queues)

### Achievements (already filled in)

- 🏆 Top 3 in DSA Summer Training Programme
- ⭐ 250+ problems solved across coding platforms
- ⚡ HackerRank 5★ in C++

---

## 🔧 Changing Camera Positions

If the 3D model layout differs from Jesse's, adjust the camera positions  
in `src/Experience/Camera/Camera.js`:

```js
this.positions = {
    default:  { position: new THREE.Vector3(0, 2.5, 6),    target: new THREE.Vector3(0, 0.5, 0) },
    about:    { position: new THREE.Vector3(-3.5, 1.8, 2.5), target: new THREE.Vector3(-3.5, 1.2, 0) },
    projects: { position: new THREE.Vector3(3.5, 1.8, 2.5),  target: new THREE.Vector3(3.5, 1.2, 0) },
    skills:   { position: new THREE.Vector3(0, 3.2, 1.5),    target: new THREE.Vector3(0, 2.5, 0) },
    contact:  { position: new THREE.Vector3(0, 1.0, 3.5),    target: new THREE.Vector3(0, 0.8, 0) }
}
```

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank screen / WebGL error | Make sure GPU acceleration is on in your browser |
| Model not loading | Check `static/models/ramenShop.glb` exists |
| 404 on draco/ | Copy `jesse-original/static/draco/` into your `static/` |
| Panels don't open | Open DevTools → Console and check for JS errors |
| Deploy fails on Vercel | Make sure `vercel.json` is in root, `outputDirectory` is `dist` |
| Huge bundle warning | Normal — Three.js + GLTF are large. Add `--max-old-space-size=4096` |

---

## 📜 Credits

- Original 3D Ramen Shop concept & Blender model: **Jesse Zhou** (enderh3art)
  - https://github.com/enderh3art/Ramen-Shop  
  - https://www.jesse-zhou.com
- Three.js: https://threejs.org
- GSAP: https://greensock.com/gsap
- Portfolio content: **Sourav Kumar**

---

## 📞 Contact Sourav

- ✉ souravkumarkumar23@gmail.com  
- 💼 linkedin.com/in/souravpoddar  
- ⌨ github.com/Souravkumar  
- 📞 +91 8168806196
