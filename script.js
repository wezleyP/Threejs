import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { PointsMaterial, RGB_ETC1_Format } from 'three'

// Loading
const loader = new THREE.TextureLoader()

const cross = loader.load('/textures/cross.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereGeometry( .4, 20, 20 );
const moonGeometry = new THREE.RingGeometry( 1.8, 10, 30 );

const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 4200;

const posArray = new Float32Array(particlesCnt * 3)

for(let i = 0; i < particlesCnt * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * (Math.random()* 25)
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Materials

const material = new THREE.PointsMaterial({
    size: .005,
    color: "blue"
})
const moonMaterial = new THREE.PointsMaterial({
    size: .005,
    
})

const particlesMaterial = new THREE.PointsMaterial({
    size: .008,
    map: cross,
    transparent: true
    
})


// Mesh
const sphere = new THREE.Points(geometry,material)
const moon = new THREE.Points(moonGeometry,moonMaterial)

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(sphere, particlesMesh, moon)

// Lights
//1
const pointLight1 = new THREE.PointLight(0xfffff, 0.1)
pointLight1.position.x = 2
pointLight1.position.y = 3
pointLight1.position.z = 4
pointLight1.intensity = 20

scene.add(pointLight1)
const light1 = gui.addFolder('light1')

light1.add(pointLight1.position, 'x').min(-5).max(5).step(.2)
light1.add(pointLight1.position, 'y').min(-5).max(5).step(.2)
light1.add(pointLight1.position, 'z').min(-5).max(5).step(.2)
light1.add(pointLight1, 'intensity').min(-5).max(5).step(.2)

// const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 1)
// scene.add(pointLightHelper1)


/* Sizes */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#000000'), 1)

/**
 * Animate
 */

//Auto Rotate
document.addEventListener('mousemove', animateParticles)

let mouseX = 0 
let mouseY = 0 


function animateParticles (event) {
    mouseX = event.clientX
    mouseY = event.clientX
}


const clock = new THREE.Clock()

const tick = () =>
{
    //Auto Rotate
    // targetX = mouseX * .001
    // targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .3 * elapsedTime
    moon.rotation.z = mouseX * (elapsedTime * 0.00009)
    particlesMesh.rotation.y = -.1 * elapsedTime

    if (mouseX > 0 ) {
        particlesMesh.rotation.y = mouseY * (elapsedTime * 0.00009)
        particlesMesh.rotation.x = mouseX * (elapsedTime * 0.00009)
    }

    
    
    //Auto Rotation
    // sphere.rotation.y += .5 * (targetX - sphere.rotation.y)
    // sphere.rotation.x += .05 * (targetY - sphere.rotation.x)
    // sphere.rotation.z += .05 * (targetY - sphere.rotation.x)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()