import * as three from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// fox
const loader = new GLTFLoader();
let fox;
loader.load('Fox.glb', (gltf) => {
	gltf.scene.scale.set(0.05, 0.05, 0.05);
	scene.add(gltf.scene);
  fox = gltf.scene;
}, undefined, (error) => {
	console.error('Error loading fox', error);
});
const position = new three.Vector3(0, 0, 0);
const moveDirection = new three.Vector3(0, 0, 0);
const keysPressed = new Set([]);
let moveSpeed = 0.1;

function updateMoveDirection() {
	moveDirection.set(0, 0, 0);

  if (keysPressed.has(87)) {
    moveDirection.add(new three.Vector3(moveSpeed, 0, 0));
	}
	if (keysPressed.has(65)) {
		moveDirection.add(new three.Vector3(0, 0, -moveSpeed));
	}
	if (keysPressed.has(83)) {
		moveDirection.add(new three.Vector3(-moveSpeed, 0, 0));
	}
	if (keysPressed.has(68)) {
		moveDirection.add(new three.Vector3(0, 0, moveSpeed));
	}
	//console.log(moveDirection);
}

// scene & camera
const scene = new three.Scene();
const camera = new three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(5, 10, 0);
const renderer = new three.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//canvas
const canvas = renderer.domElement;
canvas.style.width = '100%';
canvas.style.height = '100vh';
canvas.tabIndex = 0;
canvas.outline = 'none';
canvas.addEventListener('keydown', (e) => {
  keysPressed.add(e.keyCode);
	updateMoveDirection();
	//console.log(e.keyCode);
});
canvas.addEventListener('keyup', (e) => {
	keysPressed.delete(e.keyCode);
	updateMoveDirection();
});

// cube
const geometry = new three.BoxGeometry( 1, 1, 1 );
const material = new three.MeshLambertMaterial( { color: 0x00ff00 } );
const cube = new three.Mesh( geometry, material );
cube.position.setY(0.5);
scene.add( cube );

// light
const sunColor = 0xffffff;
const sunIntensity = 3;
const sun = new three.DirectionalLight(sunColor, sunIntensity);
sun.position.set(0, 10, 0);
sun.target.position.set(-5, 0, 0);
scene.add(sun);
scene.add(sun.target);
const skyColor = 0xb1ee1ff;
const groundColor = 0xb97a20;
const ambientIntensity = 1;
const ambientLight = new three.HemisphereLight(skyColor, groundColor, ambientIntensity);
scene.add(ambientLight);



function resizeRenderer(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) renderer.setSize(width, height, false);
  return needResize;
}

function animate() {
  position.add(moveDirection);
  camera.position.add(moveDirection);
  if (fox) fox.position.add(moveDirection);
  controls.target.set(position.x, position.y, position.z);
  controls.update();
  if (resizeRenderer(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix(renderer);
  }
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

const controls = new OrbitControls( camera, renderer.domElement );
