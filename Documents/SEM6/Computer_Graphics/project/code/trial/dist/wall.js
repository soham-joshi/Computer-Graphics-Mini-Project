import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});



var collidableMeshList = [];

const scene = new THREE.Scene();

const fov = 50;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, -400, 600);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, canvas);
controls.enableKeys = false;
controls.target.set(0, 5, 0);
controls.update();

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
MovingCube.position.set(20, 50, 26);
MovingCube.geometry.computeBoundingBox();
var cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

    // console.log("cube bbox", cubeBBox);
scene.add( MovingCube );
objects.push(MovingCube);

// Walls
var wallGeometry = new THREE.BoxGeometry( 100, 100, 20, 1, 1, 1 );
var wallMaterial = new THREE.MeshBasicMaterial( {color: 0x8888ff} );
var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe:true } );

var wall_mesh1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall_mesh1.position.set(0, 150, 20);
wall_mesh1.rotation.x = 3.14159 / 2;
wall_mesh1.geometry.computeBoundingBox();
var wall1BBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

    // console.log("wall bbox", wall1BBox);
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
const manager = new THREE.LoadingManager();

// const models = {
//     knight: { url: 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf' },
//   };
function addLight(...pos) {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...pos);
    scene.add(light);
    scene.add(light.target);
  }
    const gltfLoader = new GLTFLoader();
    const url = 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf';
    gltfLoader.load(url, (gltf) => {
      const root = gltf.scene;
      console.log("root", root);
      root.scale.x =15;
      root.scale.y =15;
      root.scale.z =15;
      root.rotation.x = 5*3.14159 / 2;
      scene.add(root);
    //   const box = new THREE.Box3().setFromObject(root);

    //   const boxSize = box.getSize(new THREE.Vector3()).length();
    //   const boxCenter = box.getCenter(new THREE.Vector3());


    //   // update the Trackball controls to handle the new size
    //   controls.maxDistance = boxSize * 10;
    //   controls.target.copy(boxCenter);
    //   controls.update();
    });
    
    addLight(-100,-100,100);

//   console.log("knight", knight.gltf);

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
cubeBBox.setFromObject(MovingCube);
        wall1BBox.setFromObject(wall_mesh1);
        console.log("janvi", wall1BBox.intersectsBox(cubeBBox));
window.addEventListener("keydown", function(eee){
    console.log("la");
    if(eee.keyCode==39)
		{
            MovingCube.translateX(5);
			console.log("pos", MovingCube.position);
        }
    if(eee.keyCode==37)
		{
			MovingCube.translateX(-5);
			console.log("pos", MovingCube.position);
        }
    if(eee.keyCode==38)
		{
			MovingCube.translateY(5);
			console.log("pos", MovingCube.position);
        }
    if(eee.keyCode==40)
		{
			MovingCube.translateY(-5);
			console.log("pos", MovingCube.position);
        }
        cubeBBox.setFromObject(MovingCube);
        wall1BBox.setFromObject(wall_mesh1);
        console.log("janvi", wall1BBox.intersectsBox(cubeBBox));
});
        

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