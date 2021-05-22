import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});
var CameraAngle=0,cameraDroneAngle=0;
var CameraDroneLookAtPosition=new THREE.Vector3()

var AvatarQuaternion = new THREE.Quaternion();
var collidableMeshList = [];
var camera_mode=0; 
const scene = new THREE.Scene();

const fov = 50;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 10000;
//Drone Camera
const cameraDrone = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraDrone.position.set(0, 0, 200);
cameraDrone.up.set(0, 0, 1);
cameraDrone.lookAt(300, 0, 0);
// const controls = new OrbitControls(cameraDrone, canvas);
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
const objects = [];

// Ground
var plane_geometry = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );
var ground_material = new THREE.MeshBasicMaterial( { color: 0x402A2A } );
var ground_mesh = new THREE.Mesh( plane_geometry, ground_material );
ground_mesh.material.side = THREE.DoubleSide;
// ground_mesh.rotation.z = 3.14/2;
scene.add( ground_mesh ); 
objects.push(ground_mesh);


// Cube
var cubeGeometry1 = new THREE.BoxGeometry(50,50,50, 1, 1, 1);
var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:false } );
let MovingCube = new THREE.Mesh( cubeGeometry1, wireMaterial );
MovingCube.position.set(20, -400, 26);
MovingCube.geometry.computeBoundingBox();
var cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

    // console.log("cube bbox", cubeBBox);
scene.add( MovingCube );
objects.push(MovingCube);

//cube 2
var cubeGeometry2 = new THREE.BoxGeometry(50,50,50, 1, 1, 1);
var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:false } );
let MovingCube1 = new THREE.Mesh( cubeGeometry2, wireMaterial );
MovingCube1.position.set(-60, -15, 26);
MovingCube1.geometry.computeBoundingBox();
var cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
MovingCube.add(MovingCube1);
objects.push(MovingCube1);

//cube 3
var cubeGeometry3 = new THREE.BoxGeometry(50,50,50, 1, 1, 1);
var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:false } );
let MovingCube2 = new THREE.Mesh( cubeGeometry3, wireMaterial );
MovingCube2.position.set(-120, -15, 26);
MovingCube2.geometry.computeBoundingBox();
var cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
MovingCube.add(MovingCube2);
objects.push(MovingCube2);

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
      root.rotation.x = 5*3.14159 / 2;
      avatar = root;
      scene.add(root);
      objects.push(avatar);

      AvatarEuler.copy(avatar.rotation);
      console.log(AvatarEuler);
      AvatarQuaternion.set(avatar.quaternion._x,avatar.quaternion.y,avatar.quaternion.z,avatar.quaternion.w);
      console.log(avatar.quaternion);
      console.log(AvatarQuaternion)


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
    const headlights = [];
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
        { prefix: 'Car_08', y: 0,  rot: [Math.PI * .5, 0, Math.PI * .5], },
        { prefix: 'CAR_03', y: 33, rot: [0, -2*Math.PI, 0], },
        { prefix: 'Car_04', y: 40, rot: [0, -2*Math.PI, 0], },
      ];
      
      
      var carX=[-400,150,600];
      var carY=[0,0,0];
      var carZ=[50,50,50];
      var index=0;
        root.updateMatrixWorld();
        for (const car of loadedCars.children.slice()) {
          const fix = fixes.find(fix => car.name.startsWith(fix.prefix));
          const obj = new THREE.Object3D();
          car.position.set(carX[index], carY[index], carZ[index]);
          
          car.rotation.set(...fix.rot);
          car.rotateX(Math.PI/2)
          obj.add(car);
          scene.add(obj);
         
          const spotLight3 = new THREE.SpotLight( 0xFFFFFF);
            spotLight3.position.set(carX[index], carY[index], carZ[index]);

            spotLight3.castShadow = true;
            const targetObject3 = new THREE.Object3D();
            scene.add(targetObject3);
            targetObject3.translateX(carX[index]);
            if(carY[index]=500)
            {
                
                targetObject3.translateY(carY[index]+20);
            }
            else
            {
                carY[index] *= -1;
                targetObject3.translateY(carY[index]+20);
            }
            targetObject3.translateZ(carZ[index]);
            spotLight3.target = targetObject3;
            
            spotLight3.shadow.mapSize.width = 1024;
            spotLight3.shadow.mapSize.height = 1024;

            spotLight3.shadow.camera.near = 500;
            spotLight3.shadow.camera.far = 4000;
            spotLight3.shadow.camera.fov = 30;
            index=index+1;
            scene.add(spotLight3);
            headlights.push(spotLight3);
            cars.push(obj, spotLight3);
        }
        });
          // car.rotation.x = 5*3.14

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
        { prefix: 'Light_3', x:-200,y: 100, z:-200, rot: [Math.PI/2, -Math.PI, Math.PI/2], },
        { prefix: 'Light_2', x:100,y: 40, rot: [0, -3*Math.PI/2, Math.PI/2], },
      ];
      
      var lightX=[0, -100, 0];
      var lightY=[350,200,-200];
      var lightZ=[100,50,50];
      var rlightX=[0, 0, 0];
      var rlightY=[Math.PI/2, -3*Math.PI/2, Math.PI/2];
      var rlightZ=[Math.PI/2, -3*Math.PI/2, Math.PI/2];
      let index1 = 0;
      root.updateMatrixWorld();
      for (const light of loadedLights.children.slice()) {
        console.log("lightt", light);
        const fix1 = fixes1.find(fix1 => light.name.startsWith(fix1.prefix));
        console.log("fixxx", fix1);
        const obj = new THREE.Object3D();
        light.position.set(lightX[index1], lightY[index1], lightZ[index1]);
        light.rotation.set(rlightX[index1], rlightY[index1], rlightZ[index1]);
        index1=index1+1;
      
     
        obj.add(light);
        // car.rotation.x = 5*3.14159 / 2;
        scene.add(obj);
        lights.push(obj);
      }
    });
    const spotLight = new THREE.SpotLight( 0xFFFFFF);
    spotLight.position.set( -100, 200,100 );

    spotLight.castShadow = true;
    const targetObject = new THREE.Object3D();
    scene.add(targetObject);
    targetObject.translateX(-100);
    targetObject.translateY(200);
    targetObject.translateZ(0)
    spotLight.target = targetObject;
    
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

scene.add( spotLight );


const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light11 = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    // scene.add(light11);

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
        console.log("roaddd", road);
        const fix = fixes1.find(fix => road.name.startsWith(fix.prefix));
        console.log("fixxx", fix);
        const obj = new THREE.Object3D();
        // road.position.set(0, fix.y, 0);
        // road.rotation.set(...fix.rot);

        road.position.x = 200;
        road.position.y = 0;
        road.scale.x = 6/10;
        road.scale.y =5/10;
        road.scale.z =5/10;
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
      if (camera_mode==2)
      {
      CameraTranslate();
      avatar.translateX(5);
      console.log("pos", avatar.position);
      console.log("camera look at Pos", AvatarLookAt);
  
      // BB check
      if(check_collision())
          {
          avatar.translateX(-5);
          }
      }
        
      break;
      case 82:
            if (camera_mode==2)
                {
                avatar.rotateOnAxis(new THREE.Vector3( 0, 1, 0 ),0.05);
                CameraAngle+=0.05
                console.log( AvatarLookAt);
                }
            else if (camera_mode==1)
                {
                cameraDroneAngle+=0.05
                }
        break;
      case 84: //turn
            if (camera_mode==2)
            {
            avatar.rotateOnAxis(new THREE.Vector3( 0, 1, 0 ),-0.05);
            CameraAngle-=0.05
            console.log( AvatarLookAt);
            }
            else if(camera_mode==1)
            {
            cameraDroneAngle-=0.05
            }
      break;

      case 40:  // Near 
      if (camera_mode==2)
      {
      CameraTranslate();
      avatar.translateZ(5);
      console.log("pos", avatar.position);    
      if(check_collision())
          {
          avatar.translateZ(-5);
          }
      }
      else if (camera_mode==1)
          {
      if (cameraDrone.position.z>150)
        {
        cameraDrone.position.z-=8;
        }
      }
        break;
      // case 67:  // Near 

      //   {
      //   avatar.rotateOnAxis(new THREE.Vector3( 0, 1, 0 ),-0.05);
      //   CameraAngle-=0.05
      //   console.log( AvatarLookAt);
      //   }
      // if(camera_mode==1)
      //   {
      //   cameraDroneAngle-=0.05
      //   }
      //   break;
      case 67:  // camera mode change 
            camera_mode=camera_mode+1;
            camera_mode=camera_mode%3;
        break;
      case 37:  // Left
      if (camera_mode==2)
      {
      CameraTranslate();
      avatar.translateX(-5);
      console.log("pos", avatar.position);

      // BB check
      if(check_collision())
          {
          avatar.translateX(5);
          }
      }
        break;

      case 38:  // Far
      if (camera_mode==2)
      {
      CameraTranslate();
      avatar.translateZ(-5);
      console.log("pos", avatar.position);
      // BB check
      if(check_collision())
          {
          avatar.translateZ(5);
          }
      }
  else if (camera_mode==1)
      {
      cameraDrone.position.z+=8
      }
        break;
    }



});
   

var postitionVector= new THREE.Vector3();
var AvatarZ= new THREE.Vector3();
var AvatarLookAt= new THREE.Vector3();


console.log(avatar.quaternion);
// AvatarQuaternion=avatar.quaternion.clone();
AvatarQuaternion.x =0;
AvatarQuaternion._y =0;
AvatarQuaternion._z =0;
AvatarQuaternion._w =0;


function animate()
{
    requestAnimationFrame( animate );
    render();		
    update();

}
let k=1;
function render(time)
{
	if (resizeRendererToDisplaySize(renderer)) 
	{
		  const canvas = renderer.domElement;
		  if (canvas_mode==1)
        {
        cameraDrone.reset();
        console.log("In the second camera condtion");
		cameraDrone.aspect = canvas.clientWidth / canvas.clientHeight;
		cameraDrone.updateProjectionMatrix();
        }
      else if (canvas_mode==2)
        {
        cameraDrone.saveState ();
        console.log("In the third camera condtion");
		    cameraAvatar.aspect = canvas.clientWidth / canvas.clientHeight;
        postitionVector= avatar.getWorldPositio(AvatarZ);
        // postitionVector[2]+=25;
        console.log(postitionVector[0],postitionVector[1],postitionVector[2]);
        console.log(cameraAvatar);

		    cameraAvatar.position.set(postitionVectors);
        }
     else if (canvas_mode==0)
        {
        cameraDrone.saveState ();   
        }
  }
  time = time*0.01;

  cars.forEach(car => {
    
    if(car.position.y >= 500)
    {
      k=-1;
    }

    else if(car.position.y <= -500)
    {
      k=1;
    }
    car.translateY(k*10);

    // headlight.position.set(car.position);
  });
  if (camera_mode==1)
      {
        CameraDroneLookAtPosition.x=cameraDrone.position.z;
        CameraDroneLookAtPosition.y=0;
        CameraDroneLookAtPosition.z=0;
        CameraDroneLookAtPosition.applyAxisAngle(new THREE.Vector3( 0, 0, 1 ),cameraDroneAngle);
        // console.log(CameraDroneLookAtPosition)
        cameraDrone.lookAt(CameraDroneLookAtPosition.x,CameraDroneLookAtPosition.y,CameraDroneLookAtPosition.z);
		renderer.render(scene, cameraDrone);
      }
    else if (camera_mode==0) 
      {

      renderer.render(scene, cameraFixed);
      }
    else
      {
        cameraAvatar.position.set(avatar.position.x,avatar.position.y,avatar.position.z+25);
        AvatarLookAt.x=0;
        AvatarLookAt.y=100;
        AvatarLookAt.z=25;
        
        cameraAvatar.up.set(0, 0, 1);
        
        AvatarLookAt=AvatarLookAt.applyAxisAngle( new THREE.Vector3( 0, 0, 1 ),CameraAngle);
        cameraAvatar.lookAt(avatar.position.x+AvatarLookAt.x,avatar.position.y+AvatarLookAt.y,avatar.position.z+AvatarLookAt.z);
        console.log(CameraAngle)
        console.log( AvatarLookAt);
        // console.log( [avatar.position.x+AvatarLookAt.x,avatar.position.y+AvatarLookAt.y,avatar.position.z+AvatarLookAt.z]);
        console.log("In the third camera condtion");
      renderer.render(scene, cameraAvatar);
      }
	
		// renderer.render(scene, camera);
	
}

function update()
{
   
}

animate();