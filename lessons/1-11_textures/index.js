import * as THREE from 'three'
import dat from 'dat'
import { gsap } from 'gsap'
import { OrbitControls } from 'controls'
console.log(1111, THREE)
window.THREE = THREE

/**
 * Texture 写法1，
 */
// const image = new Image()
// const texture = new THREE.Texture(image)
// image.onload = () => {
//     console.log('image loaded', image);
//     texture.needsUpdate = true
// }
// image.src = './brick_diffuse.jpg'

/**
 * Texture 正规写法
 */
// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load('./brick_diffuse.jpg')


/**
 * LoadingManager
 */
const loadingManager = new THREE.LoadingManager()
// loadingManager.onStart = () => { console.log('onStart'); }
// loadingManager.onLoaded = () => { console.log('onLoaded'); }
// loadingManager.onProgress = () => { console.log('onProgress'); }
// loadingManager.onError = () => { console.log('onError'); }

const textureLoader = new THREE.TextureLoader(loadingManager)
const texture = textureLoader.load('./brick_diffuse.jpg')
// const texture1 = textureLoader.load('./brick_diffuse.jpg')
// const texture2 = textureLoader.load('./brick_diffuse.jpg')
// texture.repeat.x = 2
// texture.repeat.y = 3
// texture.wrapS = THREE.RepeatWrapping
// texture.wrapT = THREE.RepeatWrapping
// texture.rotation = Math.PI * 1 / 4
// texture.center = new THREE.Vector2(0.5,0.5)
// texture.minFilter = THREE.NearestFilter
texture.magFilter = THREE.NearestFilter

/**
 * Debug
 */
const gui = new dat.GUI({ closed: false })

/**
 * Scene Camera Mesh
 */
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1,1,1),
    new THREE.MeshBasicMaterial({
        map: texture
        // color: 0x00ff00
    })
)
console.log(111, new THREE.BoxBufferGeometry(1,1,1).attributes);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
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
    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}