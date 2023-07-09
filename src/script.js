import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as LIL from 'lil-gui'

/**
 * Base
 */

// GUI 
const gui = new LIL.GUI 

// Textures 
const textureLoader = new THREE.TextureLoader()
const earthTexture = textureLoader.load('/static/textures/earthmap.jpg')
const cloudAlphaTexture = textureLoader.load('/static/textures/cloudalpha.jpg')
const earthHeightTexture = textureLoader.load('/static/textures/earthbump.jpg')


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene
const scene = new THREE.Scene()

// Object
const cloud = new THREE.Mesh(
    new THREE.SphereGeometry(1.002, 64, 64),
    new THREE.MeshBasicMaterial({
        transparent: true,
        alphaMap: cloudAlphaTexture
    })
)

const planet = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({ 
        map: earthTexture,
        bumpMap: earthHeightTexture, 
        bumpScale: 0.005
     })
)
planet.rotation.y = -1.5
planet.rotation.x = 0.2
scene.add(planet, cloud)

// Lights 
const ambientLight = new THREE.PointLight('#fff', 0.1, 100)
ambientLight.position.z = 0
ambientLight.position.y = -7
ambientLight.position.x = -35

const sunLight = new THREE.DirectionalLight('#fff', 0.8)
sunLight.position.x = 3
sunLight.position.y = 1
sunLight.position.z = 2
scene.add(sunLight, ambientLight)

// Helpers 
const ambientLightHelper = new THREE.PointLightHelper(ambientLight, 1)
scene.add(ambientLightHelper)

// Controlers 
gui.add(ambientLight.position, 'x').min(-25).max(10).step(0.5)
gui.add(ambientLight.position, 'y').min(-15).max(10).step(0.5)
gui.add(ambientLight.position, 'z').min(-15).max(10).step(0.5)
gui.add(planet.rotation, 'z').min(-15).max(10).step(0.1)
gui.add(planet.rotation, 'x').min(-15).max(10).step(0.1)
gui.add(planet.rotation, 'y').min(-15).max(10).step(0.1)

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 100)
camera.position.z = 3
camera.lookAt(planet.position)
scene.add(camera)

// Controls 
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Resize Handler 
window.addEventListener('resize', () => {
    // Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update Camera 
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update Renderer 
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate Earth Rotation 
    planet.rotation.y = - elapsedTime * 0.005

    // Animate Cloud Rotation 
    cloud.rotation.x = - Math.sin(elapsedTime * 0.003) 
    cloud.rotation.y = - Math.cos(elapsedTime * 0.003) 

    // Update Controls 
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()