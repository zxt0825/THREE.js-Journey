import * as THREE from 'three'
console.log(1111, THREE)

// **Scene
const scene = new THREE.Scene()


// **Red cube
// const geometry = new THREE.BoxGeometry(1,1,1)
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cubeGreen = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cubeGreen.name = 'CubeGreen'
cubeGreen.position.set(0,0,0)

const cubeRed = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
cubeRed.name = 'CubeRed'
cubeRed.position.set(-2,0,0)

const cubeBlue = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cubeBlue.name = 'CubeBlue'
cubeBlue.position.set(2,0,0)


// **Group
const group = new THREE.Group()

group.add(cubeGreen)
group.add(cubeRed)
group.add(cubeBlue)


scene.add(group)
console.log(222, group, group.getObjectByName("CubeBlue"));

// **Size
const size = {
    // width: 800,
    // height: 600
    width: window.innerWidth,
    height: window.innerHeight
}

// **Camera
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 1, 1000)
camera.position.set(0,1,5)
camera.lookAt(new THREE.Vector3(0,0,0))
scene.add(camera)

// **Renderer
const canvas = document.getElementById('webgl')
const renderer = new THREE.WebGLRenderer({
    canvas,
})

renderer.setSize(size.width, size.height)
// renderer.render(scene, camera)

// **Clock
const clock = new THREE.Clock()

// **Run Render
render()
function render() {
    const elapsedTime = clock.getElapsedTime()
    
    group.children.forEach((ch, i) => {
        ch.rotation.y = elapsedTime
        ch.position.y = i==0 ? Math.sin(elapsedTime) : -Math.sin(elapsedTime)
    })
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}