import * as THREE from 'three'
import { OrbitControls } from 'orbitControl'
import dat from 'dat'

import { GLTFLoader } from 'GLTFLoader'
import { DRACOLoader } from 'DRACOLoader'



/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 300 })


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Model loaded
let content


/**
 * Animation
 */


/**
 * Models
 */

// Instantiate model loader
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('./static/draco/') // faster version with webassembly

const gltfLoader = new GLTFLoader()

// glTF loader is setup with the draco loader which means
// if you load a draco file the draco loader will kick off, if it's a standard
// glTF file the glTF loader is smart enough to not load draco in that case when not needed
// gltfLoader.setDRACOLoader(dracoLoader)


// Fox - many types!
const foxModelglTF = './static/222.gltf'

const loadModel = () => {
  gltfLoader.load(
    foxModelglTF,
    (gltf) => {
      content = gltf

      console.log('content', content)

      const gltfF = gui.addFolder('gltfContrl')

      let dff
      content.scene.traverse(node => {
        if (node.type === 'Bone') {
          // const v = new THREE.Vector3()
          // node.getWorldPosition(v)
          // console.log(';/...', node, node.position, v)

          if (node.name === 'Bone001') dff = node

          const func = () => {
            let childPs = []
            node.children.forEach(child => {
              let childP = new THREE.Vector3()
              child.getWorldPosition(childP)
              childPs.push(childP)
            })
            const x = vv.x
            const y = vv.y
            const z = vv.z
            const vvv = new THREE.Vector3(x, y, z)
            node.parent.worldToLocal(vvv)
            node.position.set(cache.x + vvv.x, cache.y + vvv.y, cache.z + vvv.z)
            // console.log('x', vv.x, cache.x, node.position.x)

            node.children.forEach(child => {
              const childP = childPs.shift()
              console.log('111, ', childP)
              child.parent.worldToLocal(childP)
              console.log('222, ', childP)
              child.position.set(childP.x, childP.y, childP.z)
            })
          }
          
          const cache = node.position.clone()
          const vv = { x: 0, y: 0, z: 0 }
          gltfF.add(vv, 'x').min(-2).max(2).step(0.001).name(node.name+'x').onChange(func)
          gltfF.add(vv, 'y').min(-2).max(2).step(0.001).name(node.name+'y').onChange(func)
          gltfF.add(vv, 'z').min(-2).max(2).step(0.001).name(node.name+'z').onChange(func)
        }
      })

      /**
       * ::: Load model - Solution 1 :::
       */

      // To avoid to remove children (meshes) when moving them from
      // the model scene to our Three.js scene we have to duplicate the array
      // const children = [...gltf.scene.children]
      // for (const child of children) {
      //   scene.add(child)
      // }

      /**
       * ::: Load model - Solution 2 :::
       */

      // when needed set the scale before adding the model scene to our scene
      // here our fox would be too big without setting the scale
      // content.scene.scale.set(0.025, 0.025, 0.025)

      scene.add(content.scene)
    },
    (xhr) => {
      console.log('progress...', { xhr })
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
      console.log('error!', { error })

      // alert(error.message)
    }
  )
}

loadModel()

/**
 * Floor
 */
let floor = null
let floorGeometry = null
let floorMaterial = null

const removeFloor = () => {
  if (floor !== null) {
    floorGeometry.dispose()
    floorMaterial.dispose()

    scene.remove(floor)
  }
}

const addFloor = () => {
  // Remove floor if it does already exist before adding it to the scene
  removeFloor()

  floorGeometry = new THREE.PlaneGeometry(10, 10)

  floorMaterial = new THREE.MeshStandardMaterial({
    color: '#444444',
    metalness: 0,
    roughness: 0.5,
    transparent: true,
  })

  floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.receiveShadow = true
  floor.rotation.x = -Math.PI * 0.5

  scene.add(floor)
}

addFloor()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)

scene.add(ambientLight, directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(6,6,6)
scene.add(camera)

// Controls
let controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)

/**
 * GUI
 */

const parameters = {
  floor: true
}

const displayFolder = gui.addFolder('Display')
const lightningFolder = gui.addFolder('Lightning')
const animationFolder = gui.addFolder('Animation')
displayFolder.add(controls, 'autoRotateSpeed').min(1).max(20).step(1)
displayFolder.add(parameters, 'floor').onChange((value) => {
  if (value) {
    addFloor()
  } else {
    removeFloor()
  }
})

lightningFolder
  .add(ambientLight, 'intensity')
  .min(0)
  .max(6)
  .step(0.1)
  .name('ambientIntensity')
lightningFolder
  .add(directionalLight, 'intensity')
  .min(0)
  .max(6)
  .step(0.1)
  .name('directIntensity')

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  // clock.getDeltaTime()

  // How much seconds were spent since the last tick!
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime


  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
