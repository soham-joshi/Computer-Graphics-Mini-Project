import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});
const scene = new THREE.Scene();
var CameraAngle=0,cameraDroneAngle=0;
var CameraDroneLookAtPosition=new THREE.Vector3();
var camera_mode=2;
var postitionVector= new THREE.Vector3();
var AvatarZ= new THREE.Vector3();
var AvatarLookAt= new THREE.Vector3();

const fov = 50;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 10000;
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
// cameraAvatar.position.set(100, 400, 600 );
// cameraAvatar.up.set(0, 0, 1);
// cameraAvatar.lookAt(-100, 0, 0);

// const CarsList=[];
function addLight(...pos) {
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...pos);
  scene.add(light);
  scene.add(light.target);
}

class WholeScene
{
constructor()
  {
  this.ObjectsList=[];  
  }

StartRender()
  {
  var i,count=0;
  for (i=0;i<this.ObjectsList.length;i++)
    {
    if (this.ObjectsList[i].flag==1)
      {
      count+=1;

      }
    }
    // console.log(count)
    if (count==this.ObjectsList.length)
      {
      return 1;
      }
    else
      {
      return 0;
      }
    
  }

UpdateScene()
  {
  var k=0,i,count=0; 
    // if(this.ObjectsList[i].object.z>0)
    //   {
    //   this.ObjectsList[i].object.position.z-=this.ObjectsList[i].object.velocity;
    //   this.ObjectsList[i].object.velocity+=0.02;
    //   }
    for (i=0;i<this.ObjectsList.length;i++)
      {
      console.log(this.ObjectsList[i].AvatarFlag)
      if (this.ObjectsList[i].AvatarFlag==0)
        {
        count=count+1
        
        if(this.ObjectsList[i].Object.getWorldPosition().y >= 500)
          {
          // this.ObjectsList[i].Rotate(0,Math.PI,0);
          console.log("asd")
          // this.ObjectsList[i].Rotate
          this.ObjectsList[i].k=-1;
          }
        else if(this.ObjectsList[i].Object.getWorldPosition().y <= -500)
          {
            console.log("sad")
          // this.ObjectsList[i].Rotate(0,Math.PI,0);
          this.ObjectsList[i].k=1;
          }
          console.log(this.ObjectsList[i].object)
          this.ObjectsList[i].Object.translateZ(this.ObjectsList[i].k);
    
        }

      }
  console.log(count);    
  CollisionDetector();
  }


AddObjects(object)
  {
  this.ObjectsList.push(object);
  }

CollisionDetector()
    {
    var i,j,temp;
    var temp_list=[];
    for (i=0;i<this.ObjectsList.length;i++)
      {
      var temp = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      temp.setFromObject(this.ObjectsList[i].Object);
      temp_list.push(temp)
      }
    for(i=0;i<this.ObjectsList.length;i++)
      {  
      for(j=0;j<this.ObjectsList.length;j++)
        {
        if(i!=j)
          {
          // let temp_obj_1_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
          // temp_obj_1_bbox.setFromObject(collidableMeshList[i]);
          // let temp_obj_2_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
          // temp_obj_2_bbox.setFromObject(objects[j]);

          // console.log("mmmm",temp_obj_1_bbox,i, temp_obj_2_bbox, j);
          var is_collision = temp_list[i].intersectsBox(temp_list[j]);
          // console.log("Intersection:", is_collision);
          if(is_collision)
            {
            console.log("januuuu", "cl",i, "obj", j);
            }
          
          }
        }
      }
    }
}

class SceneObjects 
{
constructor(url,position,glftLoader,Name,index,Loadarg,AvatarFlag,scale,Rotation)
  {
  this.AvatarFlag=AvatarFlag;
  this.hasLight=0;
  this.url=url;
  this.name=Name;
  this.position=position;
  this.k=1;
  this.index=index;
  this.Objects=[];
  this.Rotation=Rotation;
  // this.glftLoader=glftLoader;
  // console.log( this.glftLoader);
  this.CarsList=[];
  this.scale=scale;

  this.Load(Loadarg);
  }

AddLight(lightPosition,TargetPosition)
  {
  this.hasLight=1;
  this.lightPosition=lightPosition;
  this.spotLight3 = new THREE.SpotLight( 0xFFFFFF);
  this.spotLight3.position.set(this.lightPosition.x,this.lightPosition.y,this.lightPosition.z);
  this.spotLight3.castShadow = true;
  this.targetObject3 = new THREE.Object3D();
  this.TargetPosition=TargetPosition;
  this.targetObject3.position.set(this.TargetPosition.x,this.TargetPosition.y,this.TargetPosition.z);
  scene.add(this.targetObject3);
  this.spotLight3.target = this.targetObject3;        
  this.spotLight3.shadow.mapSize.width = 1024;
  this.spotLight3.shadow.mapSize.height = 1024;
  this.spotLight3.shadow.camera.near = 500;
  this.spotLight3.shadow.camera.far = 4000;
  this.spotLight3.shadow.camera.fov = 30;
  scene.add(this.spotLight3);
  console.log(this.targetObject3); 
  }

Load(flag)
  {
  this.flag=0;
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(this.url, (gltf2) => {
      this.root = gltf2.scene;
      // this.root.position=this.position;
      // scene.add(this.root)
      if(this.AvatarFlag==0)
        {
        this.loadedObject = this.root.getObjectByName(this.name);

        this.root.scale.x =this.scale.x;
        this.root.scale.y =this.scale.y;
        this.root.scale.z =this.scale.z;
        console.log(this.loadedObject);
        console.log(this.loadedObject.children.slice());
        var Object=this.loadedObject.children.slice()[this.index];
        this.Object= Object.clone();
        this.Object.rotateX(this.Rotation.x);
        this.Object.rotateY(this.Rotation.y);
        this.Object.rotateZ(this.Rotation.z);
        console.log(this.Object);
        this.Object.position.set(this.position.x,this.position.y,this.position.z);
        this.root.updateMatrixWorld();
        this.CarsList.push(this.Object);
        console.log(this.Objects);
        }
      else
        {
 
        this.root.scale.x =this.scale.x;
        this.root.scale.y =this.scale.y;
        this.root.scale.z =this.scale.z;
        this.root.rotateX(this.Rotation.x);
        this.root.rotateY(this.Rotation.y);
        this.root.rotateZ(this.Rotation.z);
        this.root.rotation.x = 5*3.14159 / 2;
        this.Object=this.root;

        this.Object.position.set(this.position.x,this.position.y,this.position.z);
        console.log(this.Object);
        scene.add(this.Object);
        }
      // this.obj = new THREE.Object3D();
      // this.obj.add(this.Object);
      // this.obj.position.set(this.position);
      if (flag==1 && this.AvatarFlag==0)
        {
        scene.add(this.Object);
        }
      console.log(this.CarsList); 
      this.flag=1;
      }); 
      
      
  // while(this.flag!=1){
  //     console.log("asdasdasd");
  //     }
      console.log(this.Object);
  }

// Render()
//   {
//   this.object.render();
//   }

Translate(x,y,z)
  {
  this.Object.translateX(x);
  this.Object.translateY(y);
  this.Object.translateZ(z);
  if (this.hasLight==1)
    {
    this.spotLight3.translateX(x);
    this.spotLight3.translateY(y);
    this.spotLight3.translateZ(z);  
    this.targetObject3.translateX(x);
    this.targetObject3.translateY(y);
    this.targetObject3.translateZ(z); 
    }
  }

Rotate(x,y,z)
  {
  this.Object.rotateX(x);
  this.Object.rotateY(y);
  this.Object.rotateZ(z);
    if (this.hasLight==1)
    {
    // this.spotLight3.rotateX(x);
    // this.spotLight3.rotateY(y);
    // this.spotLight3.rotateZ(z); 

    var tempVector=new THREE.Vector3(-1*this.spotLight3.position.x+this.targetObject3.position.x,-1*this.spotLight3.position.y+this.targetObject3.position.y,-1*this.spotLight3.position.z+this.targetObject3.position.z);
    tempVector.applyAxisAngle(new THREE.Vector3( 0,0,1),x);
    tempVector.applyAxisAngle(new THREE.Vector3( 1,0,0),x);
    tempVector.applyAxisAngle(new THREE.Vector3( 1,0,0),z);
    tempVector.x=this.spotLight3.position.x+tempVector.x;
    tempVector.y=this.spotLight3.position.y+tempVector.y;
    tempVector.z=this.spotLight3.position.z+tempVector.z;
    this.targetObject3.position.x=tempVector.x;
    this.targetObject3.position.y=tempVector.y;
    this.targetObject3.position.z=tempVector.z;
    // this.targetObject3.rotateY(y);
    // this.targetObject3.rotateZ(z); 
    }
  }

AddToScene()
    {
      scene.add(this.Object);
    }

getObjects()
      {
      return this.Objects;
      }

}

class Scenelights extends SceneObjects
{
constructor(url,Meshposition,glftLoader,Name,index,Loadarg,lightPosition,TargetPosition)
  {
  
  super(url,Meshposition,glftLoader,Name,index,Loadarg);
  this.lightPosition=lightPosition;
  this.spotLight3 = new THREE.SpotLight( 0xFFFFFF);
  this.spotLight3.position.set(this.lightPosition.x,this.lightPosition.y,this.lightPosition.z);

  this.spotLight3.castShadow = true;
  this.targetObject3 = new THREE.Object3D();
  this.TargetPosition=TargetPosition;
  this.targetObject3.position.set(this.TargetPosition.x,this.TargetPosition.y,this.TargetPosition.z);
  scene.add(this.targetObject3);
  this.spotLight3.target = this.targetObject3;        
  this.spotLight3.shadow.mapSize.width = 1024;
  this.spotLight3.shadow.mapSize.height = 1024;
  this.spotLight3.shadow.camera.near = 500;
  this.spotLight3.shadow.camera.far = 4000;
  this.spotLight3.shadow.camera.fov = 30;
  scene.add(this.spotLight3);
  console.log(this.targetObject3);
  }

}

class SceneDynamicObject
{

}

class SceneStationaryObject
{

}

// Jump()
//   {
  
//   }
var wholeScene=new WholeScene();


// var CarDummy2=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(500,0,100),new GLTFLoader(),'Cars',1,0,0 );
// CarDummy.Object.push(CarDummy2);
// CarDummy.AddLight(new THREE.Vector3(0,0,100),new THREE.Vector3(0,100,0))
// var DummyObject=new Obj

var SceneAvatar=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf',new THREE.Vector3(0,0,0),new GLTFLoader(),'Cars',1,1,1,new THREE.Vector3(15,15,15) ,new THREE.Vector3( 0,0, 0));
console.log(SceneAvatar)
wholeScene.AddObjects(SceneAvatar);
// Avatar.AddLight(new THREE.Vector3(0,0,100),new THREE.Vector3(0,100,0))
// CarDummy.Load(1);
// CarDummy.AddToScene();
// console.log(CarDummy.CarsList);
// console.log(CarDummy.Objects);
// console.log(CarsList[0]);
var Light1=new SceneObjects('https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(0,0,100),new GLTFLoader(),'Lights',1,1,0,new THREE.Vector3(1,1,1),new THREE.Vector3( 0,0, 0));
Light1.AddLight(new THREE.Vector3(0,0,100),new THREE.Vector3(100,0,0));
wholeScene.AddObjects(Light1);
wholeScene.AddObjects(Light1);
var collidableMeshList = [];
var CarDummy1=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(150,0,50),new GLTFLoader(),'Cars',2,1 ,0,new THREE.Vector3(1,1,1),new THREE.Vector3( Math.PI/2, - 2*Math.PI/2, -Math.PI/2));
CarDummy1.AddLight(new THREE.Vector3(150,0,50),new THREE.Vector3(150,10,50))
var CarDummy2=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(600,0,50), new GLTFLoader(),'Cars',1,1,0, new THREE.Vector3(1,1,1),new THREE.Vector3(Math.PI/2, -2* Math.PI/2, -Math.PI/2));
wholeScene.AddObjects(CarDummy1);
wholeScene.AddObjects(CarDummy2);


// const fov = 50;
// const aspect = 2;  // the canvas default
// const near = 0.1;
// const far = 10000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, -400, 600);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, canvas);
controls.enableKeys = false;
controls.target.set(0, 5, 0);
controls.update();
cameraAvatar.position.set(SceneAvatar.position );
cameraAvatar.up.set(0, 0, 1);
// cameraAvatar.lookAt(100, 0, 0);

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
// objects.push(MovingCube);

//cube 2
var cubeGeometry2 = new THREE.BoxGeometry(50,50,50, 1, 1, 1);
var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:false } );
let MovingCube1 = new THREE.Mesh( cubeGeometry2, wireMaterial );
MovingCube1.position.set(-60, -15, 26);
MovingCube1.geometry.computeBoundingBox();
var cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
MovingCube.add(MovingCube1);
// objects.push(MovingCube1);

//cube 3
var cubeGeometry3 = new THREE.BoxGeometry(50,50,50, 1, 1, 1);
var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:false } );
let MovingCube2 = new THREE.Mesh( cubeGeometry3, wireMaterial );
MovingCube2.position.set(-120, -15, 26);
MovingCube2.geometry.computeBoundingBox();
var cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
MovingCube.add(MovingCube2);
// objects.push(MovingCube2);

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

const gltfLoader = new GLTFLoader();
    // Avatar 
    // let avatar = 0;
    // const gltfLoader = new GLTFLoader();
    // const url = 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf';
    // gltfLoader.load(url, (gltf) => {
    //   const root = gltf.scene;
    //   console.log("root", root);
    //   root.scale.x =15;
    //   root.scale.y =15;
    //   root.scale.z =15;
    //   root.rotation.x = 5*3.14159 / 2;
    //   avatar = root;
    //   // scene.add(root);
    //   objects.push(avatar);
    // //   const box = new THREE.Box3().setFromObject(root);

    // //   const boxSize = box.getSize(new THREE.Vector3()).length();
    // //   const boxCenter = box.getCenter(new THREE.Vector3());


    // //   // update the Trackball controls to handle the new size
    // //   controls.maxDistance = boxSize * 10;
    // //   controls.target.copy(boxCenter);
    // //   controls.update();
    // });
    
    // addLight(-100,-100,100);
    // const cars = [];
    // const headlights = [];
    // const url1 = 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf';
    // gltfLoader.load(url1, (gltf1) => {
    //   const root = gltf1.scene;
    //   console.log("root", root);
    //   // root.scale.x =15;
    //   // root.scale.y =15;
    //   // root.scale.z =15;
    //   root.rotation.x = 5*3.14159 / 2;
    //   // avatar = root;
    //   // scene.add(root);
    //   const loadedCars = root.getObjectByName('Cars');
    //   const fixes = [
    //     { prefix: 'Car_08', y: 0,   rot: [Math.PI, 0, Math.PI * 1.5], },
    //     { prefix: 'CAR_03', y: 33, rot: [Math.PI * .5, -2*Math.PI, 0], },
    //     { prefix: 'Car_04', y: 40, rot: [Math.PI * .5, -2*Math.PI, 0], },
    //   ];
      
      
    //   var carX=[-400,150,600];
    //   var carY=[0,0,0];
    //   var child_carY = [-100,-100,-100];
    //   var carZ=[50,50,50];
    //   var index=0;
    //     root.updateMatrixWorld();
    //     console.log("tt", loadedCars.children.slice());
    //     let fcar = [loadedCars.children.slice()[1], loadedCars.children.slice()[2], loadedCars.children.slice()[16]]
    //     let child_car = [loadedCars.children.slice()[0], loadedCars.children.slice()[4], loadedCars.children.slice()[11]]
    //     while(index<3) {
    //       let car = fcar[index];
    //       let child_fcar = child_car[index];
    //       const fix = fixes.find(fix => car.name.startsWith(fix.prefix));
    //       console.log("carrh", car);
    //       const obj = new THREE.Object3D();
    //       car.position.set(carX[index], carY[index], carZ[index]);
    //       child_fcar.position.set(carX[index], child_carY[index], carZ[index]);
    //       car.rotation.set(...fix.rot);
    //       child_fcar.rotation.set(...fix.rot);
    //       // car.scale.set(0.8,0.8, 0.8);
    //       // child_fcar.scale.set(0.8,0.8, 0.8);
    //       // car.rotateZ(Math.PI/2);
    //       // car.rotateY(Math.PI/2);
    //       obj.add(car);
    //       scene.add(obj);
    //       // obj.add(child_fcar);
         
    //         const spotLight3 = new THREE.SpotLight( 0xFFFFFF);
    //         spotLight3.position.set(carX[index], carY[index], carZ[index]);

    //         spotLight3.castShadow = true;
    //         const targetObject3 = new THREE.Object3D();
    //         scene.add(targetObject3);
    //         targetObject3.translateX(carX[index]);
    //         if(carY[index]=500)
    //         {
                
    //             targetObject3.translateY(carY[index]+20);
    //         }
    //         else
    //         {
    //             carY[index] *= -1;
    //             targetObject3.translateY(carY[index]+20);
    //         }
    //         targetObject3.translateZ(carZ[index]);
    //         spotLight3.target = targetObject3;
            
    //         spotLight3.shadow.mapSize.width = 1024;
    //         spotLight3.shadow.mapSize.height = 1024;

    //         spotLight3.shadow.camera.near = 500;
    //         spotLight3.shadow.camera.far = 4000;
    //         spotLight3.shadow.camera.fov = 30;
    //         index=index+1;
    //         // scene.add(spotLight3);
    //         headlights.push(spotLight3);
    //         cars.push(obj, spotLight3);
            
    //         collidableMeshList.push(obj);
    //         // collidableMeshList.push(child_fcar);
    //     }
    //     });
          // car.rotation.x = 5*3.14

//     const lights = [];
//     const url2 = 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf';
//     gltfLoader.load(url2, (gltf2) => {
//       const root = gltf2.scene;
//       console.log("root", root);
//       // root.scale.x =15;
//       // root.scale.y =15;
//       // root.scale.z =15;
//       root.rotation.x = 5*3.14159 / 2;
//       // avatar = root;
//       // scene.add(root);
//       const loadedLights = root.getObjectByName('Lights');
//       const fixes1 = [
//         { prefix: 'traffic_light', x:-100, y: -100,  rot: [Math.PI/2, 3*Math.PI/2, Math.PI/2 ], },
//         { prefix: 'Light_3', x:-200,y: 100, z:-200, rot: [Math.PI/2, -Math.PI, Math.PI/2], },
//         { prefix: 'Light_2', x:100,y: 40, rot: [0, -3*Math.PI/2, Math.PI/2], },
//       ];
      
//       var lightX=[0, -100, 0];
//       var lightY=[350,200,-200];
//       var lightZ=[100,50,50];
//       var rlightX=[0, 0, 0];
//       var rlightY=[Math.PI/2, -3*Math.PI/2, Math.PI/2];
//       var rlightZ=[Math.PI/2, -3*Math.PI/2, Math.PI/2];
//       let index1 = 0;
//       root.updateMatrixWorld();
//       for (const light of loadedLights.children.slice()) {
//         console.log("lightt", light);
//         const fix1 = fixes1.find(fix1 => light.name.startsWith(fix1.prefix));
//         console.log("fixxx", fix1);
//         const obj = new THREE.Object3D();
//         light.position.set(lightX[index1], lightY[index1], lightZ[index1]);
//         light.rotation.set(rlightX[index1], rlightY[index1], rlightZ[index1]);
//         index1=index1+1;
      
     
//         obj.add(light);
//         // car.rotation.x = 5*3.14159 / 2;
//         scene.add(obj);
//         lights.push(obj);
//       }
//     });
//     const spotLight = new THREE.SpotLight( 0xFFFFFF);
//     spotLight.position.set( -100, 200,100 );

//     spotLight.castShadow = true;
//     const targetObject = new THREE.Object3D();
//     scene.add(targetObject);
//     targetObject.translateX(-100);
//     targetObject.translateY(200);
//     targetObject.translateZ(0)
//     spotLight.target = targetObject;
    
//     spotLight.shadow.mapSize.width = 1024;
//     spotLight.shadow.mapSize.height = 1024;

//     spotLight.shadow.camera.near = 500;
//     spotLight.shadow.camera.far = 4000;
//     spotLight.shadow.camera.fov = 30;

// scene.add( spotLight );


// const skyColor = 0xB1E1FF;  // light blue
//     const groundColor = 0xB97A20;  // brownish orange
//     const intensity = 1;
//     const light11 = new THREE.HemisphereLight(skyColor, groundColor, intensity);
//     // scene.add(light11);

    // const roads = [];
    // const url3 = 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf';
    
    // gltfLoader.load(url3, (gltf3) => {
    //   const root = gltf3.scene;
    //   console.log("root", root);
    //   // root.scale.x =15;
    //   // root.scale.y =15;
    //   // root.scale.z =15;
    //   root.rotation.x = 5*3.14159 / 2;
    //   // avatar = root;
    //   // scene.add(root);
    //   const loadedRoad = root.getObjectByName('ROAD');
    //   const fixes1 = [
    //     { prefix: 'ROAD_Lines_12', x:-100, y: -100,  rot: [Math.PI/2, 3*Math.PI/2, Math.PI/2 ], },
    //     // { prefix: 'Light_3', x:-200,y: 100, z:-200, rot: [0, Math.PI, 0], },
    //     // { prefix: 'Light_2', x:100,y: 40, rot: [0, Math.PI, 0], },
    //   ];
      

    //   root.updateMatrixWorld();
    //   for (const road of loadedRoad.children.slice()) {
    //     console.log("roaddd", road);
    //     const fix = fixes1.find(fix => road.name.startsWith(fix.prefix));
    //     console.log("fixxx", fix);
    //     const obj = new THREE.Object3D();
    //     // road.position.set(0, fix.y, 0);
    //     // road.rotation.set(...fix.rot);

    //     road.position.x = 200;
    //     road.position.y = 0;
    //     road.scale.x = 6/10;
    //     road.scale.y =5/10;
    //     road.scale.z =5/10;
    //     road.rotation.x = Math.PI;
        
    //     obj.add(road);
    //     // car.rotation.x = 5*3.14159 / 2;
    //     scene.add(obj);
    //     roads.push(obj);
    //   }
    // });
// var Road=new SceneObjects('https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(200,0,0),new GLTFLoader(),'ROAD',1,1,0,new THREE.Vector3(6/10,5/10,5/10))


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
          for(let j=1; j<objects.length;j++)
          {
            let temp_obj_1_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            temp_obj_1_bbox.setFromObject(collidableMeshList[i]);
            
            let temp_obj_2_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            temp_obj_2_bbox.setFromObject(objects[j]);
            console.log("mmmm",temp_obj_1_bbox,i, temp_obj_2_bbox, j);
            let is_collision = temp_obj_1_bbox.intersectsBox(temp_obj_2_bbox)
            console.log("Intersection:", is_collision);

            if(is_collision)
            {
              console.log("januuuu", "cl",i, "obj", j);
              num_collisions ++ ;
            }
          }
    }


    for(let i = 1; i < objects.length ; i++)
    {
          for(let j=1; j<objects.length && i!=j;j++)
          {
            let temp_obj_1_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            temp_obj_1_bbox.setFromObject(objects[i]);

            let temp_obj_2_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            temp_obj_2_bbox.setFromObject(objects[j]);
            console.log("mmnnn",temp_obj_1_bbox,objects[i], temp_obj_2_bbox, objects[j]);
            let is_collision = temp_obj_1_bbox.intersectsBox(temp_obj_2_bbox)
            console.log("Intersection:", is_collision);

            if(is_collision)
            {
              console.log("januuuu", "ob",i, "obj", j);
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
      case 67:  // camera mode change 
      camera_mode=camera_mode+1;
      camera_mode=camera_mode%3;
      break;
      case 82:
            if (camera_mode==2)
                {
                SceneAvatar.Rotate(0,0.05,0);
                CameraAngle+=0.05
                // console.log( AvatarLookAt);
                }
            else if (camera_mode==1)
                {
                cameraDroneAngle+=0.05
                }
        break;
      case 84:
        if (camera_mode==2)
            {
              SceneAvatar.Rotate(0,-0.05,0);
            CameraAngle-=0.05
            // console.log( AvatarLookAt);
            }
        else if(camera_mode==1)
            {
            cameraDroneAngle-=0.05
            }
      break;
      case 39: // Right
    
        SceneAvatar.Translate(-5,0,0);
        
        // MovingCube.translateX(5);
        console.log("pos", avatar.position);
        
        // BB check
        if(check_collision())
        {
          SceneAvatar.Translate(5,0,0);
          // console.log("balalalalala");
        }
        
        break;
      case 40:  // Near 
            if (camera_mode==2)
                {
                SceneAvatar.Translate(0,0,-5);
            // MovingCube.translateY(-5);
                console.log("pos", avatar.position);
                if(check_collision())
                {
                  SceneAvatar.Translate(0,0,5);
                }
            }
            else if (camera_mode==1)
            {
              if(cameraDrone.position.z>50)
                {
                cameraDrone.position.z-=8;
                }
            }
            // BB check
            // if(check_collision())
            // {
            //   avatar.translateZ(-5);
            // }
        break;

      case 37:  // Left
            SceneAvatar.Translate(5,0,0);
            // MovingCube.translateX(-5);
            console.log("pos", SceneAvatar.position);

            // BB check
            if(check_collision())
            {
              SceneAvatar.Translate(-5,0,0);
            }
        break;

      case 38:  // Far
            // console.log("janviii", SceneAvatar.position);
            // SceneAvatar.Translate(0,-5,-5);
            if (camera_mode==2)
            {
            SceneAvatar.Translate(0,0,5);
            // MovingCube.translateY(5);
            // console.log("pos", SceneAvatar.position);
            if(check_collision())
              {
              SceneAvatar.Translate(0,0,-5);
              }
            }
            else if (camera_mode==1)
                {
                  cameraDrone.position.z+=8;
                
                }
            // BB check
            // if(check_collision())
            // {
            //   avatar.translateY(5);
            // }
        break;
    }



});
        
console.log(wholeScene);
function animate()
{
    requestAnimationFrame( animate );
    render();		
    update();

}
let k=1;
var yo=0;
function render(time)
{

  if (wholeScene.StartRender()==1 )
    {
    wholeScene.UpdateScene();
    // console.log(CarDummy.Object.position);
    // CarDummy.Rotate(0,0,0.001);
    if (resizeRendererToDisplaySize(renderer)) 
    {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    time = time*0.01;

    
      // renderer.render(scene, camera);
  
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
    cameraAvatar.position.set(SceneAvatar.Object.position.x,SceneAvatar.Object.position.y,SceneAvatar.Object.position.z+75);
    AvatarLookAt.x=0;
    AvatarLookAt.y=-100;
    AvatarLookAt.z=75;
    cameraAvatar.aspect = canvas.clientWidth / canvas.clientHeight;
    cameraAvatar.up.set(0, 0, 1);
        
    AvatarLookAt=AvatarLookAt.applyAxisAngle( new THREE.Vector3( 0, 0, 1 ),CameraAngle);
    cameraAvatar.lookAt(SceneAvatar.Object.position.x+AvatarLookAt.x,SceneAvatar.Object.position.y+AvatarLookAt.y,SceneAvatar.Object.position.z+AvatarLookAt.z);
    console.log(CameraAngle)
    console.log( AvatarLookAt);
        // console.log( [avatar.position.x+AvatarLookAt.x,avatar.position.y+AvatarLookAt.y,avatar.position.z+AvatarLookAt.z]);
    console.log("In the third camera condtion");
    renderer.render(scene, cameraAvatar);
    }
    }
	
}

function update()
{
    controls.update();
}

animate();