import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
<<<<<<< Updated upstream
// import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});



var collidableMeshList = [];
=======
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
import {SkeletonUtils} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/utils/SkeletonUtils.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
>>>>>>> Stashed changes

const scene = new THREE.Scene();

const fov = 50;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, -400, 600);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

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
<<<<<<< Updated upstream
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
=======

	const Texture_loader = new THREE.TextureLoader();
	const material = new THREE.MeshBasicMaterial({
		map: Texture_loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg'),
		  });
	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer({canvas});

	const fov = 50;
	const aspect = 2;  // the canvas default
	const near = 0.1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(10,0, -10);
	camera.up.set(0, 0, 1);
	camera.lookAt(0, 0, 0);

	const models = {
		// pig:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Pig.gltf' },
		// cow:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Cow.gltf' },
		// llama:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Llama.gltf' },
		// pug:    { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Pug.gltf' },
		// sheep:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Sheep.gltf' },
		// zebra:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Zebra.gltf' },
		// horse:  { url: 'https://threejsfundamentals.org/threejs/resources/models/animals/Horse.gltf' },
		knight: { url: 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf' },
	  };
	  
	// const manager = new THREE.LoadingManager();
	// manager.onLoad = init;
	
	// const gltfLoader = new GLTFLoader(manager);
	// for (const model of Object.values(models)) {
	// 	gltfLoader.load(model.url, (gltf) => {
	// 	  model.gltf = gltf;
	// 	});
	//   }
	  
	function addLight(...pos) {
		const color = 0xFFFFFF;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(...pos);
		scene.add(light);
		scene.add(light.target);
	  }

	
	const scene = new THREE.Scene();
	const objects = [];
	scene.background = new THREE.Color('white');
	addLight(5, 5, 2);
	addLight(-10, 10, 10);
	// Ground
	var plane_geometry = new THREE.PlaneGeometry( 400, 800, 1, 1 );
	var ground_material = new THREE.MeshBasicMaterial( { color: 0x00f3ff } );
	var ground_mesh = new THREE.Mesh( plane_geometry, ground_material );
	ground_mesh.material.side = THREE.DoubleSide;
	// ground_mesh.rotation.x = 90;
	
	// scene.add( ground_mesh ); 
	// objects.push(ground_mesh);
	const ground_material1 = new THREE.MeshBasicMaterial({
		color: 0xFF8844,
		map: Texture_loader.load('./blender_models/grass1.jpeg'),
	  });
	const boxWidth = 10;
  	const boxHeight = 10;
  	const boxDepth = 0.1;
  	const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth); 
	const cube = new THREE.Mesh(geometry, ground_material1);
	scene.add(cube);
	  
	// var temp=new Mesh(ground_mesh, texture_lion_king);
	// scene.add(temp);


   const objLoader = new OBJLoader();
   const mtlLoader = new MTLLoader();
//   mtlLoader.load('/blender_models/tank.mtl', (mtl) => {
//     mtl.preload();
//     objLoader.setMaterials(mtl);
//    objLoader.load('./blender_models/tank.obj', (root) => {
//     //  scene.add(root);
// 	// const tank = new THREE.Mesh(root, material);
// 	// scene.add(tank);
//    });
// });

mtlLoader.load('/blender_models/Monkey_head_smooth.mtl', function (materials) {
    materials.preload();
    objLoader.setMaterials(materials).load('./blender_models/Monkey_head_smooth.obj', function (object) {
            // object.position.y = - 95;
            var texture = new THREE.TextureLoader().load('./blender_models/lion_king.jpg');

            object.traverse(function (child) {   // aka setTexture
                if (child instanceof THREE.Mesh) {
                    child.material.map = texture;
                }
            }
			);
            scene.add(object);
        });
});


 
  	// cubes.push(cube);
	// const clonedScene = SkeletonUtils.clone(model.gltf.scene);
    // const root_knight = new THREE.Object3D();
    // root_knight.add(clonedScene);
    // scene.add(root);



	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
		  renderer.setSize(width, height, false);
		}
		return needResize;
	  }


	function render(time) {
	
		if (resizeRendererToDisplaySize(renderer)) {
>>>>>>> Stashed changes
		  const canvas = renderer.domElement;
		  camera.aspect = canvas.clientWidth / canvas.clientHeight;
		  camera.updateProjectionMatrix();
	}
	
		renderer.render(scene, camera);
	
}

function update()
{
	

	controls.update();
}

animate();