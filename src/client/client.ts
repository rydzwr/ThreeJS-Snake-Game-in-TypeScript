import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MyScene } from './Scene'
import { Clock } from 'three'
import { InputManager } from './Input'

const renderer = new THREE.WebGLRenderer()
const clock = new Clock()
const stats = Stats()

function initialize(): boolean {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    document.body.appendChild(renderer.domElement)
    document.body.appendChild(stats.dom)

    // Input manager constructor is called here
    InputManager.getInstance()

    // Scene constructor is called here
    MyScene.getInstance()

    if (!MyScene.getInstance().ActiveCamera)
        return false

    const controls = new OrbitControls(MyScene.getInstance().ActiveCamera, renderer.domElement)
    controls.addEventListener('change', render)
    window.addEventListener('resize', onWindowResize, false)
    return true
}

function onWindowResize() {
    const camera = MyScene.getInstance().ActiveCamera
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    const delta = clock.getDelta()
    MyScene.getInstance().update(delta)

    render()
    stats.update()
}

function render() {
    renderer.render(MyScene.getInstance().Scene, MyScene.getInstance().ActiveCamera)
}

if (initialize()) {
    MyScene.getInstance().postInit()
    animate()
}