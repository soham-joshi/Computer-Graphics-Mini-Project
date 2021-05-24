import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});
const scene = new THREE.Scene();

// const cameraDrone = new THREE.PerspectiveCamera(fov, aspect, near, far);
// cameraDrone.position.set(0, 0, 200);
// cameraDrone.up.set(0, 0, 1);
// cameraDrone.lookAt(300, 0, 0);

// const cameraFixed = new THREE.PerspectiveCamera(fov, aspect, near, far);
// cameraFixed.position.set(100, 400, 600);
// cameraFixed.up.set(0, 0, 1);
// cameraFixed.lookAt(0, 0, 0);



function addLight(...pos) 
{
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

  AddObjects(object)
  {
    this.ObjectsList.push(object);
  }
  CollisionDetector()
  {
    var i,j;
    for(i=0;i<this.ObjectsList;i++)
    {  
        for(j=0;j<this.ObjectsList;j++)
        {
          if(i!=j)
          {
          
          }
        }
    }
  }
}

class SceneObjects 
{
  constructor(url,position,glftLoader,Name,index,Loadarg,AvatarFlag,x,y,z,parent,child_flag)
  {
    this.AvatarFlag=AvatarFlag;
    this.hasLight=0;
    this.url=url;
    this.name=Name;
    this.position=position;
    this.x = x;
    this.y = y;
    this.z = z;
    this.index=index;
    this.Objects=[];
    this.spotLight3 = new THREE.SpotLight( 0xFFFFFF);
    this.parent = parent;
    this.k=1;
    this.child_flag = child_flag;
    this.is_moving = true;
  // this.glftLoader=glftLoader;
  // console.log( this.glftLoader);
//   this.CarsList=[];

  this.Load(Loadarg);

  }

  AddLight(lightPosition,TargetPosition)
  {
    this.hasLight=1;
    this.lightPosition=lightPosition;
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
  // console.log("tiger",this.targetObject3.position); 
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

          console.log(this.loadedObject);
          console.log(this.loadedObject.children.slice());
          var Object=this.loadedObject.children.slice()[this.index];
          this.Object= Object.clone();
          console.log(this.Object);
          this.Object.position.set(this.position.x,this.position.y,this.position.z);
          this.Object.rotateX(this.x);
          this.Object.rotateY(this.y);
          this.Object.rotateZ(this.z);
          // this.Object.rotation.set(this.rotation.x,this.rotation.y,this.rotation.z);
          this.root.updateMatrixWorld();
          // this.CarsList.push(this.Object);
          console.log(this.Objects);
        }
        else
        {
          this.root.scale.x =15;
          this.root.scale.y =15;
          this.root.scale.z =15;
          this.root.rotation.x = 5*3.14159 / 2;
          this.Object=this.root;
          this.Object.position.set(this.position.x,this.position.y,this.position.z);
          // this.Object.rotation.set(this.rotation.x,this.rotation.y,this.rotation.z);
          console.log(this.Object);
          scene.add(this.Object);
        }
        // this.obj = new THREE.Object3D();
        // this.obj.add(this.Object);
        // this.obj.position.set(this.position);
        if (flag==1 && this.AvatarFlag==0 && this.child_flag==0)
        {
          scene.add(this.Object);
        }
        if(this.AvatarFlag==0 && this.child_flag==1)
        {
          console.log("ka", this.parent.Object);
          this.parent.Object.add(this.Object);
        }
        //   console.log(this.CarsList); 
        this.flag=1;
      }); 
      
  // while(this.flag!=1){
  //     console.log("asdasdasd");
  //     }
      console.log(this.Object);
  }

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
      tempVector.applyAxisAngle(new THREE.Vector3( 0,1,0),x);
      tempVector.applyAxisAngle(new THREE.Vector3( 0,0,1),y);
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


var CarDummy=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(-400,0,50),new GLTFLoader(),'Cars',1,1,0, Math.PI/2,  2*Math.PI/2, -Math.PI/2, '', 0);
var Child_CarDummy=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(0,0,-200),new GLTFLoader(),'Cars',1,Math.PI,0,0,  Math.PI/2, 0, CarDummy,1);

// CarDummy.Object.add(Child_CarDummy.Object);
// , },[Math.PI * .5, -2*Math.PI, 0]
//         [Math.PI * .5, -2*Math.PI, 0], },
//          [Math.PI * .5, -2*Math.PI, 0], },

var Avatar=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf',new THREE.Vector3(100,500,0),new GLTFLoader(),'Cars',1,1,1 );
// Avatar.AddLight(new THREE.Vector3(0,0,100),new THREE.Vector3(0,100,0))
// CarDummy.Load(1);
// CarDummy.AddToScene();
console.log(CarDummy.CarsList);
console.log(CarDummy.Objects);
// var CarDummy1=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(150,0,50),[Math.PI, 0, Math.PI * 1.5], new GLTFLoader(),'Cars',2,1 ,0);
// CarDummy1.AddLight(new THREE.Vector3(0,0,100),new THREE.Vector3(0,100,0))
// var CarDummy2=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(600,0,50),[Math.PI * .5, -2*Math.PI, 0], new GLTFLoader(),'Cars',16,1,0);
// CarDummy2.AddLight(new THREE.Vector3(0,0,100),new THREE.Vector3(0,100,0))
var CarDummy1=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(150,0,50),new GLTFLoader(),'Cars',2,1 ,0, Math.PI/2, - 2*Math.PI/2, -Math.PI/2, '',0);
// CarDummy1.AddLight(new THREE.Vector3(150,0,50),new THREE.Vector3(150,10,50))
var Child_CarDummy1=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(0,0,-200),new GLTFLoader(),'Cars',2,Math.PI,0,0,  Math.PI/2, 0, CarDummy1,1);
var CarDummy2=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(600,0,50), new GLTFLoader(),'Cars',16,1,0, Math.PI/2,  Math.PI/2, -Math.PI/2, '',0);
// var Child_CarDummy2=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(0,0,-200),new GLTFLoader(),'Cars',16,Math.PI,0,0,  Math.PI/2, 0, CarDummy2,1);
// CarDummy2.AddLight(new THREE.Vector3(0,0,100),new THREE.Vector3(0,100,0))
// console.log(CarsList[0]);
// var Light1=new SceneObjects('https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(0,0,100), new GLTFLoader(),'Lights',1,1,0);
// Light1.AddLight(new THREE.Vector3(0,0,100),new THREE.Vector3(100,0,0));

var collidableMeshList = [];
const CarsList=[CarDummy, CarDummy1];


const fov = 50;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 10000;
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
wall_mesh1.position.set(100, 400, 40);
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
      // scene.add(root);
      objects.push(avatar);
    //   const box = new THREE.Box3().setFromObject(root);

    //   const boxSize = box.getSize(new THREE.Vector3()).length();
    //   const boxCenter = box.getCenter(new THREE.Vector3());


    //   // update the Trackball controls to handle the new size
    //   controls.maxDistance = boxSize * 10;
    //   controls.target.copy(boxCenter);
    //   controls.update();
    });
    
    addLight(-100,-100,100);
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
function uv_spherical(geometry,buildingMesh){
	geometry.computeBoundingBox();

	var max = geometry.boundingBox.max;
	var min = geometry.boundingBox.min;
  
	var offset = new THREE.Vector3(0 - min.x, 0 - min.y, 0-min.z);
	var range = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
	// console.log(geometry.attributes);
	// console.log(geometry.attributes.uv);
	var faces = geometry.faces;
	var positions = Array.from(geometry.attributes.position.array);
	  var uvAttribute = geometry.attributes.uv;

	for (var i = 0; i < positions.length / 3; i++) {
		var x = positions[i * 3];
		var y = positions[i * 3 + 1];
		var z = positions[i * 3 + 2];
		x = (x+offset.x)/range.x;
		y = (y+offset.y)/range.y;
		z = (z+offset.z)/range.z;
		var U = uvAttribute.getX( i );
		var V = uvAttribute.getY( i );

		U =  0.5 - Math.atan2(z, x) / (Math.PI*2) ;
		V = 0.5 - Math.asin(y) / Math.PI;
		
		
		// U = z;
		// V = y;
		console.log(x, y, z, U, V);
		uvAttribute.setXY( i, U, V );
	}
	geometry.uvsNeedUpdate = true;
	uvAttribute.needsUpdate = true;
	buildingMesh.material.needsUpdate = true;
	// console.log(geometry.attributes.uv.array);
}

function uv_planar(geometry,buildingMesh){
	geometry.computeBoundingBox();

	var max = geometry.boundingBox.max;
	var min = geometry.boundingBox.min;
  
	var offset = new THREE.Vector3(0 - min.x, 0 - min.y, 0-min.z);
	var range = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
	console.log(geometry.attributes);
	console.log(geometry.attributes.uv);
	var faces = geometry.faces;
	var positions = Array.from(geometry.attributes.position.array);
	var uvAttribute = geometry.attributes.uv;

	for (var i = 0; i < positions.length / 3; i++) {
		var x = positions[i * 3];
		var y = positions[i * 3 + 1];
		var z = positions[i * 3 + 2];
		x = (x+offset.x)/range.x;
		y = (y+offset.y)/range.y;
		z = (z+offset.z)/range.z;
		var U = uvAttribute.getX( i );
		var V = uvAttribute.getY( i );

		// U =  0.5 - Math.atan2(z, x) / (Math.PI*2) ;
		// V = 0.5 - Math.asin(y) / Math.PI;
		
		
		U = z;
		V = y;
		console.log(x, y, z, U, V);
		uvAttribute.setXY( i, U, V );
	}


	geometry.uvsNeedUpdate = true;
	uvAttribute.needsUpdate = true;
	buildingMesh.material.needsUpdate = true;
	console.log(geometry.attributes.uv.array);  
}

	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './dawnmountain-xpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './dawnmountain-xneg.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './dawnmountain-ypos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './dawnmountain-yneg.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './dawnmountain-zpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( './dawnmountain-zneg.png' ) }));
	for (var i = 0; i < 6; i++)
	   materialArray[i].side = THREE.BackSide;
	var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyboxGeom = new THREE.BoxGeometry( 5000, 5000, 5000, 1, 1, 1 );
  var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
  scene.add( skybox );
  skybox.rotateX(Math.PI/2);

  const Texture_loader = new THREE.TextureLoader();
  var radius = 8;
  var height = 7;
  var geometry = new THREE.CylinderGeometry(0, radius, height, 4, 1)
  var py_texture= Texture_loader.load('./wood-lighthouse.jpg');
  geometry.uvsNeedUpdate = true;
  const py_material= new THREE.MeshPhongMaterial({
      map : py_texture,
      side : THREE.DoubleSide,
  });
  // var Material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
  // var material = new THREE.MeshNormalMaterial();
  var pyramid = new THREE.Mesh(geometry, py_material);
  uv_spherical(geometry,pyramid);
  scene.add(pyramid);
  pyramid.position.set(0,-100,620);
  pyramid.scale.set(10,10,10);
  pyramid.rotateX(Math.PI/2);
  var cy_geometry = new THREE.CylinderGeometry(30, 30, 600, 32)
  // var cy_material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
  
  var cy_texture= Texture_loader.load('./janvi.jpg');
    cy_geometry.uvsNeedUpdate = true;
    const cy_material= new THREE.MeshPhongMaterial({
        map : cy_texture,
        side : THREE.DoubleSide,
    });
	
    var cylinder = new THREE.Mesh(cy_geometry, cy_material);
  // uv_planar(cy_geometry,cylinder);
  uv_planar(cy_geometry,cylinder);
  scene.add(cylinder);
  cylinder.position.set(0,-100,300);
  cylinder.rotateX(Math.PI/2);
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
let MovableObj = [] ; // [CarDummy, CarDummy1, CarDummy2];
// Left Set of cars
MovableObj.push(CarDummy);
MovableObj.push(CarDummy1);
// MovableObj.push(Child_CarDummy);


// collidableMeshList.push(CarDummy.Object);
// collidableMeshList.push(CarDummy1.Object);
// collidableMeshList.push(CarDummy2.Object);
// var coll_mode = 1;
// function check_collision()
// {
//     let num_collisions = 0;

//     MovableObj.forEach(obj => {
    
         
//             let temp_obj_1_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
//             temp_obj_1_bbox.setFromObject(obj.Object);
            
//             let temp_obj_2_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
//             temp_obj_2_bbox.setFromObject(Avatar.Object);
//             console.log("mmmm",temp_obj_1_bbox,obj, temp_obj_2_bbox);
//             let is_collision = temp_obj_1_bbox.intersectsBox(temp_obj_2_bbox)
//             console.log("Intersection:", is_collision);

//             if(is_collision)
//             {
//               console.log("januuuu", "cl",obj);
//               if(coll_mode == 1){
//                 obj.k *= -1;
//               }
//               else
//               {
//                 // Avatar.Object.position.set({x:obj.Object.position.x, y:obj.Object.position.y, z: obj.Object.position.z+100});
//                 Avatar.Object.translateZ(5);
//                 Avatar.Object.rotateY(Math.PI/2);
//                 Avatar.Object.translateX(-20);
//                 obj.Object.add(Avatar.Object);
//               }
              
//               num_collisions ++ ;
      
//           }
//     });


//     // for(let i = 1; i < objects.length ; i++)
//     // {
//     //       for(let j=1; j<objects.length && i!=j;j++)
//     //       {
//     //         let temp_obj_1_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
//     //         temp_obj_1_bbox.setFromObject(objects[i]);

//     //         let temp_obj_2_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
//     //         temp_obj_2_bbox.setFromObject(objects[j]);
//     //         console.log("mmnnn",temp_obj_1_bbox,objects[i], temp_obj_2_bbox, objects[j]);
//     //         let is_collision = temp_obj_1_bbox.intersectsBox(temp_obj_2_bbox)
//     //         console.log("Intersection:", is_collision);

//     //         if(is_collision)
//     //         {
//     //           console.log("januuuu", "ob",i, "obj", j);
//     //           num_collisions ++ ;
//     //         }
//     //       }
//     // }

    
//     // num_collisions -=2; // For walls with ground
//     // num_collisions -=1; // For avatar and ground
//     // console.log("Collisions: ", num_collisions);
//     if(num_collisions >=1)
//     {
//       return true;
//     }
//     else
//     {
//       return false;
//     }
// }

// A list of objects which can collide with the avatar
// let collidableMeshList = []

function check_dist_betweenBB(BB1, BB2)
{
    let mins1 = BB1.min;
    let mins2 = BB2.min;

    let maxs1 = BB1.max;
    let maxs2 = BB2.max;


    let pos1 = ( mins1.add(maxs1) ).multiplyScalar(0.5);
    let pos2 = (  mins2.add(maxs2) ).multiplyScalar(0.5);

    let dist = pos1.distanceTo(pos2);

    return dist;

}


// Avatar object is already present in the scene
// Check collisions of avatar with cars
function check_Collisions(obj)
{
  let num_collisions = 0;

  // Avatar bounding box
  let avatar_BBOX = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
  avatar_BBOX.setFromObject(Avatar.Object);


    // Check all the collidable objects
    let temp_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    temp_bbox.setFromObject(obj.Object);

    let dist = check_dist_betweenBB(avatar_BBOX, temp_bbox);

    console.log("Distance:", dist);

    if(dist <= 250)
    {
      num_collisions++;
      console.log("Objects collided: ", obj, " and Avatar");
    }

    
  if(num_collisions>=1)
  {
    return true;
  }
  else
  {
    return false;
  }

}

function check_collision_wall(obj)
{
  let num_collisions = 0;

  // Avatar bounding box
    let wall_BBOX = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    wall_BBOX.setFromObject(wall_mesh1);


      // Check all the collidable objects
      let temp_bbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      temp_bbox.setFromObject(obj.Object);

      let dist = check_dist_betweenBB(wall_BBOX, temp_bbox);

      console.log("Distance:", dist);

      if(dist <= 250)
      {
        num_collisions++;
        console.log("Objects collided: ", obj, " and Wall");
      }

      
    if(num_collisions>=1)
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
        Avatar.Object.translateX(5);
        // MovingCube.translateX(5);
        console.log("pos", avatar.position);
        
        break;
      case 84: //turn
        // const quaternion = new THREE.Quaternion();
        // quaternion.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), 0.1 );
        // MovingCube.translateY(5);
        // MovingCube1.(-1);
        // MovingCube2.rotateZ(-1);
        // const vector = MovingCube.position;
        // vector.applyQuaternion( quaternion );
          // MovingCube.rotateZ(0.1);
          // MovingCube.translateY(10);
          break;
      case 40:  // Near 
            Avatar.Object.translateZ(5);
            // MovingCube.translateY(-5);
            console.log("pos", avatar.position);

        break;

      case 37:  // Left
          Avatar.Object.translateX(-5);
            // MovingCube.translateX(-5);
            console.log("pos", avatar.position);

        break;

      case 38:  // Far
            // console.log("janviii", avatar.position);
            Avatar.Object.translateZ(-5);
            // MovingCube.translateY(5);
            // console.log("pos", Avatar.position);

            // BB check
            // if(check_collision())
            // {
            //   avatar.translateY(5);
            // }
        break;
    }

    switch(eee.key)
    {
        case "j":
          // Jump mode
          console.log("Jump avatar jump");
          avatar_jump();
          break;

        case "u":
          // Jump mode
          console.log("UnJump avatar jump");
          avatar_ujump();
          break;
    }


});
        
function avatar_jump()
{
  scene.remove(Avatar.Object);
  CarDummy2.Object.add(Avatar.Object);
  Avatar.Object.position.set(-50,0,-60);
  Avatar.Object.rotateX(Math.PI);
}
function avatar_ujump()
{
  CarDummy2.Object.remove(Avatar.Object);
  scene.add(Avatar.Object);
  Avatar.Object.position.set(-120,0,0);
  Avatar.Object.rotateX(Math.PI);
}

function animate()
{
  requestAnimationFrame( animate );
  update();
  render();
  

}
// let k=1;
function render()
{
   renderer.render(scene, camera);

}
	

let Dynamic_obj = [];
Dynamic_obj.push(CarDummy);
Dynamic_obj.push(CarDummy1);
Dynamic_obj.push(CarDummy2);

function update()
{ 
  MovableObj.forEach(car => {

    let is_colliding = check_Collisions(car);

    if(is_colliding)
    {
      car.is_moving = false;
      // car.k *=-1;
    }
    else
    {
      car.is_moving = true;
    }

  })

  Dynamic_obj.forEach(car => {

    let is_colliding = check_collision_wall(car);

    if(is_colliding)
    {
      // car.is_moving = false;
      car.k *=-1;
    }


  })



    CarsList.forEach(car => {
      if(car.flag==1)
      {
           car.AddLight(car.Object.position, {x:car.Object.position.x, y:car.Object.position.y+10, z: car.Object.position.z});

            if(car.Object.position.y >= 500)
            {
              car.k=-1;
            }
  
            else if(car.Object.position.y <= -500)
            {
                car.k=1;
            }
            

            if(car.is_moving)
            {
              car.Object.translateZ(car.k*10);
            }

      }
  });

  if(CarDummy2.flag==1)
      {
        CarDummy2.AddLight(CarDummy2.Object.position, {x:CarDummy2.Object.position.x, y:CarDummy2.Object.position.y+10, z: CarDummy2.Object.position.z})  
        // console.log("lala",CarDummy2.Object.position);
          if(CarDummy2.Object.position.y >= 500)
          {
              CarDummy2.k=-1;
          }
  
          else if(CarDummy2.Object.position.y <= -500)
          {
              CarDummy2.k=1;
          }
          CarDummy2.Object.translateX(CarDummy2.k*10);
      }
      // console.log(CarDummy.Object.position);
      // CarDummy.Rotate(0,0,Math.PI/2);
      if (resizeRendererToDisplaySize(renderer)) 
      {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
      }

    controls.update();
}

animate();