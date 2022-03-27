import * as THREE from 'three'
import { OrbitControls } from 'orbitControl'
import { FontLoader } from 'FontLoader'
import { TextGeometry } from 'TextGeometry'

console.log('THREE', THREE)


const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0x00ffff})
)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000)
// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
camera.position.set(0,0,5)
camera.lookAt(cube.position)

const scene = new THREE.Scene()

// scene.add(cube)
scene.add(camera)



new FontLoader().load(
    '/lib/examples/fonts/helvetiker_regular.typeface.json',
    (font) => {
        console.log(111, font)
        const texture = new THREE.TextureLoader().load('ddd.png')
        
        const textGeometry = new TextGeometry(
            'Hello Three.js',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 3
            }
        )
        textGeometry.center()
        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: texture })
        const textMesh = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(textMesh)

        console.time('donuts')


        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        for(let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, textMaterial)

            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)
            
            scene.add(donut)
        }

        console.timeEnd('donuts')

    }
)

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

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}