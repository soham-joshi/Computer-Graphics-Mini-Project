import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
import {SkeletonUtils} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/utils/SkeletonUtils.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';

function main()
{

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
	const controls = new OrbitControls(camera, canvas);
	controls.enableKeys = false;
	controls.target.set(0, 0, 0);
	controls.update();

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
	const boxWidth = 20;
  	const boxHeight = 20;
  	const boxDepth = 0.1;
  	const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth); 
	const cube = new THREE.Mesh(geometry, ground_material1);
	// scene.add(cube);
	  
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

mtlLoader.load('/blender_models/cube_cylinder_cy.mtl', function (materials) {
    materials.preload();
	objLoader.setMaterials(materials);
    objLoader.load('/blender_models/cube_cylinder_cy.obj', function (object) {
            // object.position.y = - 95;
            // var texture = new THREE.TextureLoader().load('./blender_models/lion_king.jpg');
			// object.translateX(-10);
            // object.traverse(function (child) {   // aka setTexture
            //     if (child instanceof THREE.Mesh) {
            //         child.material.map = texture;
            //     }
			scene.add(object);
            }
			);
           
        // });
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
		  const canvas = renderer.domElement;
		  camera.aspect = canvas.clientWidth / canvas.clientHeight;
		  camera.updateProjectionMatrix();
		  controls.update();
		}
	
		renderer.render(scene, camera);
	
		requestAnimationFrame(render);
	  }
	
	  requestAnimationFrame(render);
}

main();