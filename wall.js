import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
import { vec3, mat4 } from 'https://cdn.skypack.dev/gl-matrix';

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});

class carClass
{
constructor(x,y,z)
  {
  
  }
}

var collidableMeshList = [];
var camera_mode=0; 
const scene = new THREE.Scene();

const fov = 50;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 10000;
//Drone Camera
const cameraDrone = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraDrone.position.set(0, -400, 600);
cameraDrone.up.set(0, 0, 1);
cameraDrone.lookAt(0, 0, 0);
const controls = new OrbitControls(cameraDrone, canvas);
//Fixed Camera
const cameraFixed = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraFixed.position.set(100, 400, 600);
cameraFixed.up.set(0, 0, 1);
cameraFixed.lookAt(0, 0, 0);
//Avatar Camera
const cameraAvatar = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraAvatar.position.set(100, 400, 600 );
cameraAvatar.up.set(0, 0, 1);
cameraAvatar.lookAt(100, 0, 0);

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

    // Avatar 
    let avatar = 0;
    const gltfLoader = new GLTFLoader();
    const url = 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf';
    gltfLoader.load(url, (gltf) => {
      const root = gltf.scene;
      console.log("root", root);
      root.scale.x =15;
      root.scale.y =15;
      root.scale.z =15;
      root.translateX(100);
      root.rotation.x = 5*3.14159 / 2;
      avatar = root;
      scene.add(root);
      objects.push(avatar);
    // const cameraAvatar = new THREE.PerspectiveCamera(fov, aspect, near, far);
    cameraAvatar.position.set(avatar.getWorldPosition );
    cameraAvatar.up.set(0, 0, 1);
    cameraAvatar.lookAt(100, 0, 0);
    //   const box = new THREE.Box3().setFromObject(root);

    //   const boxSize = box.getSize(new THREE.Vector3()).length();
    //   const boxCenter = box.getCenter(new THREE.Vector3());


    //   // update the Trackball controls to handle the new size
    //   controls.maxDistance = boxSize * 10;
    //   controls.target.copy(boxCenter);
    //   controls.update();
    });
    
    addLight(-100,-100,100);
    const cars = [];
    const url1 = 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf';
    gltfLoader.load(url1, (gltf1) => {
      const root = gltf1.scene;
      console.log("root", root);
      // root.scale.x =15;
      // root.scale.y =15;
      // root.scale.z =15;
      root.rotation.x = 5*3.14159 / 2;
      // avatar = root;
      // scene.add(root);
      const loadedCars = root.getObjectByName('Cars');
      const fixes = [
        { prefix: 'Car_08', x:-100, y: -100,  rot: [0, 0, 0 ], },
        { prefix: 'CAR_03', x:-200,y: 100, z:-200, rot: [0, 0, 0], },
        { prefix: 'Car_04', x:100,y: 40, rot: [0, 0, 0], },
      ];
      
    var carX=[10,10,10];
    var carY=[100,0,0];
    var carZ=[0,100,0];
    var index=0;
      root.updateMatrixWorld();
      for (const car of loadedCars.children.slice()) {
        const fix = fixes.find(fix => car.name.startsWith(fix.prefix));
        const obj = new THREE.Object3D();
        car.position.set(carX[index], carY[index], carZ[index]);
        index=index+1;
        car.rotation.set(...fix.rot);
        car.rotateX(Math.PI/2)
        obj.add(car);
        // car.rotation.x = 5*3.14159 / 2;
        scene.add(obj);
        cars.push(obj);
      }
    });

    const lights = [];
    const url2 = 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf';
    gltfLoader.load(url2, (gltf2) => {
      const root = gltf2.scene;
      console.log("root", root);
      // root.scale.x =15;
      // root.scale.y =15;
      // root.scale.z =15;
      root.rotation.x = 5*3.14159 / 2;
      // avatar = root;
      // scene.add(root);
      const loadedLights = root.getObjectByName('Lights');
      const fixes1 = [
        { prefix: 'traffic_light', x:-100, y: -100,  rot: [Math.PI/2, 3*Math.PI/2, Math.PI/2 ], },
        { prefix: 'Light_3', x:-200,y: 100, z:-200, rot: [0, Math.PI, 0], },
        { prefix: 'Light_2', x:100,y: 40, rot: [0, Math.PI, 0], },
      ];
      

      root.updateMatrixWorld();
      for (const light of loadedLights.children.slice()) {
        // console.log("lightt", light);
        const fix = fixes1.find(fix => light.name.startsWith(fix.prefix));
        // console.log("fixxx", fix);
        const obj = new THREE.Object3D();
        // light.position.set(0, fix.y, 0);
        // light.rotation.set(...fix.rot);
        light.position.x = 200;
        // light.position.y = 00;
        light.rotation.x = Math.PI;
        obj.add(light);
        // car.rotation.x = 5*3.14159 / 2;
        scene.add(obj);
        lights.push(obj);
      }
    });

    const roads = [];
    const url3 = 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf';
    gltfLoader.load(url3, (gltf3) => {
      const root = gltf3.scene;
      console.log("root", root);
      // root.scale.x =15;
      // root.scale.y =15;
      // root.scale.z =15;
      root.rotation.x = 5*3.14159 / 2;
      // avatar = root;
      // scene.add(root);
      const loadedRoad = root.getObjectByName('ROAD');
      const fixes1 = [
        { prefix: 'ROAD_Lines_12', x:-100, y: -100,  rot: [Math.PI/2, 3*Math.PI/2, Math.PI/2 ], },
        // { prefix: 'Light_3', x:-200,y: 100, z:-200, rot: [0, Math.PI, 0], },
        // { prefix: 'Light_2', x:100,y: 40, rot: [0, Math.PI, 0], },
      ];
      

      root.updateMatrixWorld();
      for (const road of loadedRoad.children.slice()) {
        // console.log("roaddd", road);
        const fix = fixes1.find(fix => road.name.startsWith(fix.prefix));
        // console.log("fixxx", fix);
        const obj = new THREE.Object3D();
        // road.position.set(0, fix.y, 0);
        // road.rotation.set(...fix.rot);

        road.position.x = 200;
        road.position.y = 0;
        road.scale.x = 1/10;
        road.scale.y =1/10;
        road.scale.z =1/10;
        road.rotation.x = Math.PI;
        
        obj.add(road);
        // car.rotation.x = 5*3.14159 / 2;
        scene.add(obj);
        roads.push(obj);
      }
    });
      // objects.push(avatar);});
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

console.log(MovingCube.geometry.type);


function check_collision()
{
    let num_collisions = 0;

    for(let i = 0; i < collidableMeshList.length; i++)
    {
          for(let j=0; j<objects.length;j++)
          {
            let temp_obj_1_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            temp_obj_1_bbox.setFromObject(collidableMeshList[i]);

            let temp_obj_2_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            temp_obj_2_bbox.setFromObject(objects[j]);
            
            let is_collision = temp_obj_1_bbox.intersectsBox(temp_obj_2_bbox)
            // console.log("Intersection:", is_collision);

            if(is_collision)
            {
              num_collisions ++ ;
            }
          }
    }


    for(let i = 0; i < objects.length ; i++)
    {
          for(let j=0; j<objects.length && i!=j;j++)
          {
            let temp_obj_1_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            temp_obj_1_bbox.setFromObject(objects[i]);

            let temp_obj_2_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            temp_obj_2_bbox.setFromObject(objects[j]);
            
            let is_collision = temp_obj_1_bbox.intersectsBox(temp_obj_2_bbox)
            // console.log("Intersection:", is_collision);

            if(is_collision)
            {
              num_collisions ++ ;
            }
          }
    }

    
    num_collisions -=2; // For walls with ground
    num_collisions -=1; // For avatar and ground
    console.log("Collisions: ", num_collisions);
    if(num_collisions >=1)
    {
      return true;
    }
    else
    {
      return false;
    }
}

window.addEventListener("keydown", function(eee){
    // console.log("la");

    switch(eee.keyCode)
    {
      case 39: // Right
        avatar.translateX(5);
        console.log("pos", avatar.position);
        
        // BB check
        if(check_collision())
        {
          avatar.translateX(-5);
        }
        
        break;
      
      case 67:  // Near 
          camera_mode=camera_mode+1;
          camera_mode=camera_mode%3;
      break;
      case 40:  // Near 
            avatar.translateZ(5);
            console.log("pos", avatar.position);

            // BB check
            if(check_collision())
            {
              avatar.translateZ(-5);
            }
        break;

      case 37:  // Left
            avatar.translateX(-5);
            console.log("pos", avatar.position);

            // BB check
            if(check_collision())
            {
              avatar.translateX(5);
            }
        break;

      case 38:  // Far
            avatar.translateZ(-5);
            console.log("pos", avatar.position);

            // BB check
            if(check_collision())
            {
              avatar.translateZ(5);
            }
        break;
    }



});

var postitionVector= new THREE.Vector3();
var AvatarZ= new THREE.Vector3();
var AvatarLookAt= new THREE.Vector3();
var AvatarQuaternion =avatar.quaternion;

function animate()
{
  // console.log(cameraAvatar);
    requestAnimationFrame( animate );
    render();		
    update();

}

function render()
{

	if (resizeRendererToDisplaySize(renderer)) 
	{
		  const canvas = renderer.domElement;
      if (canvas_mode==1)
        {
          console.log("In the second camera condtion");
		    cameraDrone.aspect = canvas.clientWidth / canvas.clientHeight;
		    cameraDrone.updateProjectionMatrix();
        }
      else if (canvas_mode==2)
        {
        console.log("In the third camera condtion");
		    cameraAvatar.aspect = canvas.clientWidth / canvas.clientHeight;
        postitionVector= avatar.getWorldPositio(AvatarZ);
        console.log(postitionVector[0],postitionVector[1],postitionVector[2]);
        console.log(cameraAvatar);

		    cameraAvatar.position.set(postitionVectors);
        }
  }
    if (camera_mode==1)
      {
		  renderer.render(scene, cameraDrone);
      }
    else if (camera_mode==0) 
      {
      renderer.render(scene, cameraFixed);
      }
    else
      {
        console.log("In the third camera condtion");
        avatar.getWorldPosition(postitionVector);
        console.log(postitionVector.x);
        AvatarLookAt.x=postitionVector.x;
        AvatarLookAt.y=postitionVector.y+100;
        AvatarLookAt.z=postitionVector.z+25;
        console.log()
        console.log(AvatarQuaternion);
        // AvatarLookAt.applyQuaternion(avatar.quaternion);
        console.log(postitionVector);
        console.log(AvatarLookAt);
		    cameraAvatar.position.set(postitionVector.x,postitionVector.y,postitionVector.z);
        cameraAvatar.up.set(0, 0, 1);
        cameraAvatar.lookAt(AvatarLookAt.x,AvatarLookAt.y, AvatarLookAt.z);
      renderer.render(scene, cameraAvatar);
      }
	
}

function update()
{
    controls.update();
}

animate();