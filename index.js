import './style.css'
import Experience from './Experience/Experience.js'

// Boot the 3D experience
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas.webgl')
    new Experience(canvas)
})
