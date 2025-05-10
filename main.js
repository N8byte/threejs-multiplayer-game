import * as three from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Sky } from 'three/addons/objects/Sky.js';


// scene & camera
const scene = new three.Scene();
const camera = new three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(5, 10, 0);
const renderer = new three.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.enablePan = false;
controls.maxDistance = 20;
controls.minDistance = 5;
controls.maxPolarAngle = Math.PI / 2;
//controls.minAzimuthAngle = Math.PI / 4;

// sky
const sky = new Sky();
sky.scale.setScalar( 450000 );
const phi = three.MathUtils.degToRad( 90 );
const theta = three.MathUtils.degToRad( 180 );
const sunPosition = new three.Vector3().setFromSphericalCoords( 1, phi, theta );
sky.material.uniforms.sunPosition.value = sunPosition;
scene.add( sky );

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
const rotation = new three.Quaternion();
const ROTATION_SPEED = 10.0;
const moveDirection = new three.Vector3(0, 0, 0);
const keysPressed = new Set([]);
let moveSpeed = 10;

// input
function updateMoveDirection() {
	moveDirection.set(0, 0, 0);

  if (keysPressed.has(87)) { // w
    moveDirection.add(new three.Vector3(1, 0, 0));
	}
	if (keysPressed.has(65)) { // a
		moveDirection.add(new three.Vector3(0, 0, -1));
	}
	if (keysPressed.has(83)) { // s
		moveDirection.add(new three.Vector3(-1, 0, 0));
	}
	if (keysPressed.has(68)) { // d
		moveDirection.add(new three.Vector3(0, 0, 1));
	}
//	console.log(moveDirection);
}

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

// cube and floor
const geometry = new three.BoxGeometry( 1, 1, 1 );
const material = new three.MeshLambertMaterial( { color: 0x44dd22} );
const cube = new three.Mesh( geometry, material );
cube.position.setY(0.5);
scene.add( cube );
const floorGeometry = new three.BoxGeometry(100, 1, 100);
const floor = new three.Mesh(floorGeometry, material);
floor.position.setY(-0.5);
scene.add(floor);

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


// timer
const clock = new three.Clock();

// rendering
function resizeRenderer(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) renderer.setSize(width, height, false);
  return needResize;
}

function animate() {
  const delta = clock.getDelta();
  let lookDirection = new three.Vector3();
  camera.getWorldDirection(lookDirection);
  let lookAngle = Math.atan2(lookDirection.x, lookDirection.z);
  lookAngle -= Math.PI / 2;
  const rotatedMoveDirection = moveDirection.clone();
  rotatedMoveDirection.applyAxisAngle(new three.Vector3(0, 1, 0), lookAngle);
  rotatedMoveDirection.setY(0);
  rotatedMoveDirection.normalize();
  const velocity = rotatedMoveDirection.multiplyScalar(moveSpeed * delta);
  camera.position.add(velocity);
  position.add(velocity);
  if (fox) {
    fox.position.add(velocity);
    const moveAngle = Math.atan2(rotatedMoveDirection.x, rotatedMoveDirection.z);
    if (moveAngle) {
      rotation.setFromAxisAngle(new three.Vector3(0, 1, 0), moveAngle);
      fox.quaternion.rotateTowards(rotation, delta * ROTATION_SPEED);
    }
  }
  controls.target.set(position.x, position.y + 2, position.z);
  controls.update();
  if (resizeRenderer(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix(renderer);
  }
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

