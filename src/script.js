import * as THREE from 'three'

/**
 * Canvas
 */

const canvas = document.querySelector('.webgl')
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Scene
 */

const scene = new THREE.Scene()

/**
 * Objects
 */

const planet = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 'red' })
)
scene.add(planet)

/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 1000)
camera.position.z = 3
scene.add(camera)

/**
 * Renderer 
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
