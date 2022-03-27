console.log(1111, THREE)

// Scene
const scene = new THREE.Scene()

// Red cube
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Size
const size = {
    // width: 800,
    // height: 600
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 1, 1000)
camera.position.z = 5
camera.position.y = 5
camera.position.x = 5
camera.lookAt(new THREE.Vector3(0,0,0))
scene.add(camera)

// Renderer
const canvas = document.getElementById('webgl')
const renderer = new THREE.WebGLRenderer({
    canvas,
})

renderer.setSize(size.width, size.height)
renderer.render(scene, camera)