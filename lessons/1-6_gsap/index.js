import * as THREE from 'three'
import { gsap } from 'gsap'
console.log(1111, THREE, gsap)

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0x00ff00})
)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
camera.position.set(0,1,5)
camera.lookAt(cube.position)

const scene = new THREE.Scene()

scene.add(cube)
scene.add(camera)

const canvas = document.querySelector('#webgl')
const renderer = new THREE.WebGLRenderer({
    canvas,
    // antialias: true // 抗锯齿
})

renderer.setSize(window.innerWidth, window.innerHeight)

gsap.to(cube.position, { duration: 1, delay: 1, x: 2 })
gsap.to(cube.position, { duration: 1, delay: 2, x: 0 })

render()
function render() {
    cube.rotation.y += 0.01

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}