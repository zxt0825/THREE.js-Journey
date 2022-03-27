import * as THREE from 'three'
import dat from 'dat'
import { gsap } from 'gsap'
import { OrbitControls } from 'controls'
console.log(1111, THREE, dat, window.devicePixelRatio)

/**
 * Debug
 */
const gui = new dat.GUI({ closed: false })

/**
 * Scene Camera Mesh
 */
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(0,0,5)
camera.lookAt(cube.position)

const scene = new THREE.Scene()

scene.add(cube)
scene.add(camera)


/**
 * GUI
 */
const material = {
    color: 0x00ff00
}
material.spin = () => {
    gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + 10 })
}
console.log(cube);
{
    const f = gui.addFolder('cube')
    f.add(cube.position, 'x').min(-3).max(3).step(0.01)
    f.add(cube.position, 'y').min(-3).max(3).step(0.01)
    f.add(cube.position, 'z').min(-3).max(3).step(0.01)
    f.add(cube, 'visible')
    f.add(cube.material, 'wireframe')
    f.addColor(material, 'color').onChange(() => {
        cube.material.color.set(material.color)
        // or cube.material.color = new THREE.Color(material.color)
    })
    f.add(material, 'spin')
}


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


/**
 * Controls
 */
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true


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