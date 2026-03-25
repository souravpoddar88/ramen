import gsap from 'gsap'
import Experience from '../Experience.js'

/**
 * Controller manages the entire UI state machine:
 *
 * STATES:
 *   loading  → assets downloading (loader bar visible)
 *   start    → START screen visible, 3D idle
 *   explore  → user is in the 3D scene, can click objects
 *   section  → a panel (about/projects/skills/contact) is open
 */
export default class Controller {
    constructor() {
        this.experience = new Experience()
        this.camera     = this.experience.camera
        this.state      = 'loading'

        // DOM refs
        this.loadingScreen = document.getElementById('loading-screen')
        this.startScreen   = document.getElementById('start-screen')
        this.uiOverlay     = document.getElementById('ui-overlay')
        this.backBtn       = document.getElementById('back-btn')
        this.hintText      = document.getElementById('hint-text')

        this.panels = {
            about:    document.getElementById('panel-about'),
            projects: document.getElementById('panel-projects'),
            skills:   document.getElementById('panel-skills'),
            contact:  document.getElementById('panel-contact')
        }

        this.bindEvents()
        this.listenForReady()
    }

    listenForReady() {
        // Resources ready → show START screen
        this.experience.resources.on('ready', () => {
            setTimeout(() => {
                this.transitionTo('start')
            }, 600)
        })

        // If no sources defined, skip straight to start after 1.5s fake load
        if (this.experience.resources.toLoad === 0) {
            this.fakeLoad()
        }
    }

    fakeLoad() {
        const fill    = document.getElementById('loader-fill')
        const percent = document.getElementById('loader-percent')
        let pct = 0
        const iv = setInterval(() => {
            pct += Math.random() * 18
            if (pct >= 100) {
                pct = 100
                clearInterval(iv)
                setTimeout(() => this.transitionTo('start'), 500)
            }
            if (fill)    fill.style.width    = pct + '%'
            if (percent) percent.textContent = Math.floor(pct) + '%'
        }, 120)
    }

    bindEvents() {
        // START button
        const startBtn = document.getElementById('start-btn')
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.transitionTo('explore')
            })
        }

        // BACK button
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => {
                this.closeSection()
            })
        }

        // Close panel buttons
        document.querySelectorAll('.close-panel').forEach(btn => {
            btn.addEventListener('click', () => this.closeSection())
        })

        // Close panel on backdrop click
        Object.values(this.panels).forEach(panel => {
            if (panel) {
                panel.addEventListener('click', (e) => {
                    if (e.target === panel) this.closeSection()
                })
            }
        })

        // Keyboard ESC
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state === 'section') {
                this.closeSection()
            }
        })
    }

    transitionTo(newState) {
        const prev = this.state
        this.state = newState

        if (newState === 'start') {
            // Fade out loading screen, show start
            gsap.to(this.loadingScreen, {
                opacity: 0, duration: 0.6, ease: 'power2.inOut',
                onComplete: () => {
                    this.loadingScreen.classList.add('hidden')
                    this.startScreen.classList.remove('hidden')
                    gsap.fromTo(this.startScreen,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.8, ease: 'power2.out' }
                    )
                }
            })
        }

        if (newState === 'explore') {
            // Fade out start screen, reveal 3D scene
            gsap.to(this.startScreen, {
                opacity: 0, duration: 0.6, ease: 'power2.inOut',
                onComplete: () => {
                    this.startScreen.classList.add('hidden')
                    this.uiOverlay.classList.remove('hidden')
                    gsap.fromTo(this.uiOverlay,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.5 }
                    )
                }
            })

            // Animate camera to default position
            if (prev === 'section') {
                this.camera.moveTo('default', 1.2)
            }
        }

        if (newState === 'loading') {
            this.loadingScreen.classList.remove('hidden')
        }
    }

    openSection(section) {
        if (this.state === 'section') return // already open

        this.state = 'section'

        // Show back button
        this.backBtn.classList.remove('hidden')
        gsap.fromTo(this.backBtn, { opacity: 0 }, { opacity: 1, duration: 0.3 })

        // Hint text out
        gsap.to(this.hintText, { opacity: 0, duration: 0.2 })

        // Move camera close to that section
        this.camera.moveTo(section)

        // Show panel after camera moves
        setTimeout(() => {
            const panel = this.panels[section]
            if (panel) {
                panel.classList.remove('hidden')
                gsap.fromTo(panel,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.3, ease: 'power2.out' }
                )
            }
        }, 900)
    }

    closeSection() {
        // Hide all panels
        Object.values(this.panels).forEach(panel => {
            if (panel && !panel.classList.contains('hidden')) {
                gsap.to(panel, {
                    opacity: 0, duration: 0.25,
                    onComplete: () => panel.classList.add('hidden')
                })
            }
        })

        // Hide back button
        gsap.to(this.backBtn, {
            opacity: 0, duration: 0.2,
            onComplete: () => this.backBtn.classList.add('hidden')
        })

        // Hint text back
        gsap.to(this.hintText, { opacity: 1, duration: 0.4, delay: 0.5 })

        this.transitionTo('explore')
    }
}
