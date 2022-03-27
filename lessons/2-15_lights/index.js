import * as THREE from 'three'
import { OrbitControls } from 'orbitControl'
import dat from 'dat'
import { RectAreaLightHelper } from 'RectAreaLightHelper'

console.log('THREE', THREE)

const gui = new dat.GUI({ name: 'total' })


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000)
// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
camera.position.set(0,4,5)
// camera.lookAt(cube.position)
scene.add(camera)


/**
 * geometry
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.8, 0.8),
    material
)
scene.add(cube)

const donut = new THREE.Mesh(
    new THREE.TorusGeometry( 0.3, 0.2, 32, 64 ),
    material
)
donut.position.set(2,0,0)
scene.add(donut)

const ball = new THREE.Mesh(
    new THREE.SphereGeometry( 0.5, 32, 32 ),
    material
)
ball.position.set(-2,0,0)
scene.add(ball)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 5),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65
scene.add(plane)

/**
 * lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(0x4c00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0,2,3)
scene.add(spotLight)

console.log(spotLight)
spotLight.target.position.x = -1.75
scene.add(spotLight.target)


/**
 * Helpers
 */
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
requestAnimationFrame(() => {
    spotLightHelper.update()
})

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)


/**
 * render
 */
const canvas = document.querySelector('#webgl')
const renderer = new THREE.WebGLRenderer({
    canvas,
    // antialias: true // 抗锯齿
})

renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

render()
function render() {
    controls.update()
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    donut.rotation.x += 0.01
    donut.rotation.y += 0.01
    ball.rotation.x += 0.01
    ball.rotation.y += 0.01

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}