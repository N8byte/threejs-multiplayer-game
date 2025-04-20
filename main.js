import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// fox
const loader = new GLTFLoader();
loader.load('Fox.glb', (gltf) => {
	gltf.scene.scale.set(0.05, 0.05, 0.05);
	scene.add(gltf.scene);
}, undefined, (error) => {
	console.error('Error loading fox', error);
});

// scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// light
const sunColor = 0xffffff;
const sunIntensity = 3;
const sun = new THREE.DirectionalLight(sunColor, sunIntensity);
sun.position.set(0, 10, 0);
sun.target.position.set(-5, 0, 0);
scene.add(sun);
scene.add(sun.target);
const skyColor = 0xb1ee1ff;
const groundColor = 0xb97a20;
const ambientIntensity = 1;
const ambientLight = new THREE.HemisphereLight(skyColor, groundColor, ambientIntensity);
scene.add(ambientLight);

// grey arrow
const crosshair_grey = new THREE.LineBasicMaterial({color:0x0a0a0a});
const points = [
	new THREE.Vector3(-10, 0, 0),
	new THREE.Vector3(0, 10, 10),
	new THREE.Vector3(10, 0, 0)
];
const crosshairGeom = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(crosshairGeom, crosshair_grey);
scene.add(line);

// crosshair
const canvas = document.getElement



function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

const controls = new OrbitControls( camera, renderer.domElement );
