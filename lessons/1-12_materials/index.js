import * as THREE from 'three'
import dat from 'dat'
import { gsap } from 'gsap'
import { HDRCubeTextureLoader } from 'HDRCubeTextureLoader';
import { OrbitControls } from 'controls'
console.log('THREE: ', THREE)
window.THREE = THREE

/**
 * Objects
 */
// const textureLoader = new THREE.TextureLoader()
// const texture = textureLoader.load('./brick_diffuse.jpg')
// texture.magFilter = THREE.NearestFilter
// const material = new THREE.MeshBasicMaterial({
//     // color: 0x00ff00
//     map: texture
// })

/**
 * NormalMaterial
 */
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true
// const gui = new dat.GUI()
// gui.add(material, 'flatShading').onChange(() => {
//     material.needsUpdate = true
// })
// gui.add(material, 'wireframe')

/**
 * matcapMaterial
 */
// let material = new THREE.MeshMatcapMaterial()
// let picture = new THREE.TextureLoader().load('./testpicture.png')
// material.matcap = picture

/**
 * DepthMaterial
 */
// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 1000
// material.specular = new THREE.Color(0x1188ff)

// 卡通风格
// const material = new THREE.MeshToonMaterial()

// pbr专用，结合了lambert和phong
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
const gui = new dat.GUI()
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)



const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    material
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32),
    material
)
torus.position.x = 1.5


/**
 * Scene Camera Mesh
 */
console.log('Geometry 的3个重要属性: ', new THREE.BoxBufferGeometry(1,1,1).attributes);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0,0,5)
// camera.lookAt(cube.position)

const scene = new THREE.Scene()


new HDRCubeTextureLoader()
    .setPath( './pisaHDR/' )
    .load( [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ],
        (texture) => {
            scene.background = texture;
            scene.environment = texture;
            material.envMap = texture;
            // material.needsUpdate = true;
    })


// scene.add(cube)
scene.add(camera)
scene.add(sphere, plane, torus)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(2,3,4)
scene.add(pointLight)



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

const clock = new THREE.Clock()


/**
 * render
 */
render()
function render() {
    const elapsedTime = clock.getElapsedTime()
    
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime
    
    controls.update()

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}