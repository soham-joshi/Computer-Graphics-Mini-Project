import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
// import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});



var collidableMeshList = [];

const scene = new THREE.Scene();

const fov = 50;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 1000;
const cameraDrone = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraDrone.position.set(0, -400, 600);
cameraDrone.up.set(0, 0, 1);
cameraDrone.lookAt(0, 0, 0);

const cameraFixed = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraFixed.position.set(0, -400, 600);
cameraFixed.up.set(0, 0, 1);
cameraFixed.lookAt(0, 0, 0);

const objects = [];

// Ground
var plane_geometry = new THREE.PlaneGeometry( 800, 400, 1, 1 );
var ground_material = new THREE.MeshBasicMaterial( { color: 0x00f2ff } );
var ground_mesh = new THREE.Mesh( plane_geometry, ground_material );
ground_mesh.material.side = THREE.DoubleSide;
// ground_mesh.rotation.z = 3.14/2;
scene.add( ground_mesh ); 
objects.push(ground_mesh);


// Cube
var cubeGeometry = new THREE.BoxGeometry(50,50,50, 1, 1, 1);
var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true } );
let MovingCube = new THREE.Mesh( cubeGeometry, wireMaterial );
MovingCube.position.set(10, 50, 26);
scene.add( MovingCube );
objects.push(MovingCube);

// Walls
var wallGeometry = new THREE.BoxGeometry( 100, 100, 20, 1, 1, 1 );
var wallMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );

var wall_mesh1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall_mesh1.position.set(0, 150, 20);
wall_mesh1.rotation.x = 3.14159 / 2;
scene.add(wall_mesh1);
collidableMeshList.push(wall_mesh1);
var wall_wire1 = new THREE.Mesh(wallGeometry, wireMaterial);
wall_wire1.position.set(0, 150, 20);
wall_wire1.rotation.x = 3.14159 / 2;
scene.add(wall_wire1);


var wall_mesh2 = new THREE.Mesh(wallGeometry, wallMaterial);
wall_mesh2.position.set(-150, 50, 20);
wall_mesh2.rotation.y = 3.14159 / 2;
scene.add(wall_mesh2);
collidableMeshList.push(wall_mesh2);
var wall_wire2 = new THREE.Mesh(wallGeometry, wireMaterial);
wall_wire2.position.set(-150, 50, 20);
wall_wire2.rotation.y = 3.14159 / 2;
scene.add(wall_wire2);

// CONTROLS
// var controls = new OrbitControls( camera, renderer.domElement );

// // keyboard
// var keyboard = new THREEx.KeyboardState();

console.log(MovingCube.geometry.attributes.position.count);

function resizeRendererToDisplaySize(renderer) 
{
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);
	}
	return needResize;
}


function animate()
{
	requestAnimationFrame( animate );
	render();		
	update();
}

function render()
{
	if (resizeRendererToDisplaySize(renderer)) 
	{
		  const canvas = renderer.domElement;
		  cameraDrone.aspect = canvas.clientWidth / canvas.clientHeight;
		  cameraDrone.updateProjectionMatrix();
	}
	
		renderer.render(scene, cameraDrone);
	
}

function update()
{
	

	controls.update();
}

animate();