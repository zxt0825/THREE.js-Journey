import * as THREE from 'three'
import { OrbitControls } from 'orbitControl'
import dat from 'dat'
import { RectAreaLightHelper } from 'RectAreaLightHelper'

console.log('THREE', THREE)

const gui = new dat.GUI({ name: 'total' })


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000)
camera.position.set(0,4,5)
// camera.lookAt(cube.position)
scene.add(camera)


/**
 * geometry
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7

gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

const ball = new THREE.Mesh(
    new THREE.SphereGeometry( 0.5, 32, 32 ),
    material
)
ball.castShadow = true
scene.add(ball)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 5),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65
plane.receiveShadow = true
scene.add(plane)

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2,2,-1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(directionalLight)

directionalLight.castShadow = true

directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
gui.add(directionalLightCameraHelper, 'visible')
scene.add(directionalLightCameraHelper)


const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
spotLight.castShadow = true

spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target)

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6


const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
gui.add(spotLightCameraHelper, 'visible')
scene.add(spotLightCameraHelper)



const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.castShadow = true
pointLight.position.set(-1, 1, 0)
scene.add(pointLight)

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5


const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
gui.add(pointLightCameraHelper, 'visible')
scene.add(pointLightCameraHelper)




/**
 * render
 */
const canvas = document.querySelector('#webgl')
const renderer = new THREE.WebGLRenderer({
    canvas,
    // antialias: true // 抗锯齿
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

renderer.shadowMap.type = THREE.PCFShadowMap

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

render()
function render() {
    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}