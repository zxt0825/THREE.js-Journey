import * as THREE from 'three'
import { gsap } from 'gsap'
import { OrbitControls } from 'controls'
console.log(1111, THREE, gsap, window.devicePixelRatio)

/**
 * Array
 */
const count = 500
const positionArray = new Float32Array(count * 3 * 3)

for (let i = 0; i < count * 3 * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 5
}
const positionAttribute = new THREE.BufferAttribute(positionArray, 3)

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', positionAttribute)

/**
 * Scene Camera Mesh
 */
const cube = new THREE.Mesh(
    // new THREE.BoxBufferGeometry(1,1,1,4,4,4),
    geometry,
    new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
    })
)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
camera.position.set(0,0,5)
camera.lookAt(cube.position)

const scene = new THREE.Scene()

scene.add(cube)
scene.add(camera)


/**
 * listenResize
 */
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

/**
 * Render
 */
const canvas = document.querySelector('#webgl')
const renderer = new THREE.WebGLRenderer({
    canvas,
    // antialias: true // 抗锯齿
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// gsap.to(cube.position, { duration: 1, delay: 1, x: 2 })
// gsap.to(cube.position, { duration: 1, delay: 2, x: 0 })

/**
 * Controls
 */
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true
// controls.update()


/**
 * render
 */
render()
function render() {
    // cube.rotation.y += 0.01
    
    controls.update()


    renderer.render(scene, camera)
    requestAnimationFrame(render)
}