import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});
const scene = new THREE.Scene();


var CameraAngle=0,cameraDroneAngle=0,textureToggle=0,CarDummyLightFlag=0,CarDummy2LightFlag=1,Jump_flag=1,OnetimeFlag=0;
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
cameraFixed.position.set(1000, 1000, 600);
cameraFixed.up.set(0, 0, 1);
cameraFixed.lookAt(0, 0, 0);
//Avatar Camera
const cameraAvatar = new THREE.PerspectiveCamera(fov, aspect, near, far);

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
    this.LightToggle=0;
  // this.glftLoader=glftLoader;
  // console.log( this.glftLoader);
//   this.CarsList=[];

  this.Load(Loadarg);

  }

  AddLight(lightPosition,TargetPosition, angle, intensity)
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
    // this.spotLight3.penumbra = 0.5; 
    this.intensity=intensity;     
    this.spotLight3.intensity = intensity;
    this.spotLight3.shadow.mapSize.width = 1024;
    this.spotLight3.shadow.mapSize.height = 1024;
    this.spotLight3.shadow.camera.near = 500;
    this.spotLight3.shadow.camera.far = 4000;
    this.spotLight3.shadow.camera.fov = 20;
    this.spotLight3.angle = angle;
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

  SwitchLight()
    {
    if (this.LightToggle==1)
      {
      this.LightToggle=0;
      this.spotLight3.intensity=this.intensity;
      }
    else
      {
      this.LightToggle=1;
      this.spotLight3.intensity=0;
      }
        
    }

}



var CarDummy=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(-380,10,70),new GLTFLoader(),'Cars',1,1,0, Math.PI/2,  2*Math.PI/2, -Math.PI/2, '', 0);
var Child_CarDummy=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(0,0,-170),new GLTFLoader(),'Cars',1,Math.PI,0,0,  Math.PI/2, 0, CarDummy,1);



var Avatar=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf',new THREE.Vector3(-120,0,0),new GLTFLoader(),'Cars',1,1,1 );

console.log(CarDummy.CarsList);
console.log(CarDummy.Objects);

var CarDummy1=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(150,0,50),new GLTFLoader(),'Cars',2,1 ,0, Math.PI/2, - 2*Math.PI/2, -Math.PI/2, '',0);
// CarDummy1.AddLight(new THREE.Vector3(150,0,50),new THREE.Vector3(150,10,50))
var Child_CarDummy1=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(0,0,-200),new GLTFLoader(),'Cars',2,Math.PI,0,0,  Math.PI/2, 0, CarDummy1,1);
var CarDummy2=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(600,0,50), new GLTFLoader(),'Cars',16,1,0, Math.PI/2,  Math.PI/2, -Math.PI/2, '',0);

var StreetLight=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf',new THREE.Vector3(-100,0,50), new GLTFLoader(),'Lights',1,1,0,0,  0, Math.PI/2, '',0);
StreetLight.AddLight(new THREE.Vector3(-100,-90,100), new THREE.Vector3(-100,-80,0), Math.PI/4,2);  
var collidableMeshList = [];
const CarsList=[CarDummy, CarDummy1];


// const fov = 50;
// const aspect = 2;  // the canvas default
// const near = 0.1;
// const far = 10000;
const cameraOrbit = new THREE.PerspectiveCamera(fov, aspect, near, far);
cameraOrbit.position.set(0, -400, 600);
cameraOrbit.up.set(0, 0, 1);
cameraOrbit.lookAt(0, 0, 0);
const controls = new OrbitControls(cameraOrbit, canvas);
controls.enableKeys = false;
controls.target.set(0, 5, 0);
controls.update();

const objects = [];
const Texture_loader = new THREE.TextureLoader();
// Ground
var plane_geometry = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );
var plane_texture= Texture_loader.load('./brick.jpg');
    plane_geometry.uvsNeedUpdate = true;
    const plane_material= new THREE.MeshPhongMaterial({
        map : plane_texture,
        side : THREE.DoubleSide,
    });
// var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:false } );
let ground_mesh = new THREE.Mesh( plane_geometry, plane_material );
uv_spherical(plane_geometry, ground_mesh);
scene.add( ground_mesh ); 
ground_mesh.position.set(120,0,0);
objects.push(ground_mesh);


// Cube
var cubeGeometry1 = new THREE.BoxGeometry(50,50,50, 1, 1, 1);
var cube_texture= Texture_loader.load('./bench.jpg');
    cubeGeometry1.uvsNeedUpdate = true;
    const cube_material= new THREE.MeshPhongMaterial({
        map : cube_texture,
        side : THREE.DoubleSide,
    });
// var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:false } );
let MovingCube = new THREE.Mesh( cubeGeometry1, cube_material );
uv_spherical(cubeGeometry1, MovingCube);
MovingCube.position.set(20, -400, 26);
MovingCube.geometry.computeBoundingBox();
var cubeBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());

    // console.log("cube bbox", cubeBBox);
scene.add( MovingCube );
// objects.push(MovingCube);

//cube 2
var cubeGeometry2 = new THREE.BoxGeometry(50,50,50, 1, 1, 1);
var cube_texture2= Texture_loader.load('./bench.jpg');
    cubeGeometry2.uvsNeedUpdate = true;
    const cube_material2= new THREE.MeshPhongMaterial({
        map : cube_texture2,
        side : THREE.DoubleSide,
    });
// var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:false } );
let MovingCube1 = new THREE.Mesh( cubeGeometry2, cube_material2 );
uv_spherical(cubeGeometry2, MovingCube1);
MovingCube1.position.set(-50, -400, 26);
    // console.log("cube bbox", cubeBBox);
scene.add(MovingCube1);
// objects.push(MovingCube1);

//cube 3
var cubeGeometry3 = new THREE.BoxGeometry(50,50,50, 1, 1, 1);
var cube_texture3= Texture_loader.load('./bench.jpg');
    cubeGeometry3.uvsNeedUpdate = true;
    const cube_material3= new THREE.MeshPhongMaterial({
        map : cube_texture3,
        side : THREE.DoubleSide,
    });
// var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:false } );
let MovingCube2 = new THREE.Mesh( cubeGeometry3, cube_material3 );
uv_spherical(cubeGeometry3, MovingCube2);
MovingCube2.position.set(-130, -400, 26);
    // console.log("cube bbox", cubeBBox);
scene.add(MovingCube2);
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
// scene.add(wall_wire1);


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

    });
    
    addLight(-100,-100,100);

    


const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 0.2;
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
		// console.log(x, y, z, U, V);
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

		// U =  0.5 - Math.atan2(z, x) / (Math.PI*2) ;
		// V = 0.5 - Math.asin(y) / Math.PI;
		
		
		U = z;
		V = y;
		// console.log(x, y, z, U, V);
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

//   const Texture_loader = new THREE.TextureLoader();
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
  pyramid.position.set(0,-100,520);
  pyramid.scale.set(10,10,10);
  pyramid.rotateX(Math.PI/2);
  var cy_geometry = new THREE.CylinderGeometry(30, 30, 600, 32)
  // var cy_material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
  
  var cy_texture= Texture_loader.load('./roof.jpg');
    cy_geometry.uvsNeedUpdate = true;
    const cy_material= new THREE.MeshPhongMaterial({
        map : cy_texture,
        side : THREE.DoubleSide,
    });
	
    var cylinder = new THREE.Mesh(cy_geometry, cy_material);
  // uv_planar(cy_geometry,cylinder);
  uv_planar(cy_geometry,cylinder);
  scene.add(cylinder);
  cylinder.position.set(0,-100,200);
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

    // console.log("Distance:", dist);

    if(dist <= 250)
    {
      num_collisions++;
      // console.log("Objects collided: ", obj, " and Avatar");
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

      // console.log("Distance:", dist);

      if(dist <= 250)
      {
        num_collisions++;
        // console.log("Objects collided: ", obj, " and Wall");
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
      case 70:
      StreetLight.SwitchLight();
      break;

      case 71:
      if (CarDummyLightFlag==1 )
        {
        CarDummyLightFlag=0;
        }
      else
        {
          CarDummyLightFlag=1;
        }
      break;
      case 72:
      if (CarDummy2LightFlag==1 )
        {
        CarDummy2LightFlag=0;
        }
      else
        {
        CarDummy2LightFlag=1;
        }

        
      break;

      case 67:  // camera mode change 
      camera_mode=camera_mode+1;
      camera_mode=camera_mode%4;
      break;
      case 39: // Right
        Avatar.Object.translateX(-5);
        // MovingCube.translateX(5);
        console.log("pos", avatar.position);
        
        break;
      case 69:
            if (camera_mode==2)
                {
                Avatar.Rotate(0,0.05,0);
                CameraAngle+=0.05
                // console.log( AvatarLookAt);
                }
            else if (camera_mode==1)
                {
                cameraDroneAngle+=0.05
                }
        break;
      case 82: //turn
        if (camera_mode==2)
            {
            Avatar.Rotate(0,-0.05,0);
            CameraAngle-=0.05
      // console.log( AvatarLookAt);
            }
        else if(camera_mode==1)
            {
            cameraDroneAngle-=0.05
            }
          break;
      case 40:  // Near 
            if (camera_mode!=1)
                {
                Avatar.Object.translateZ(-5);
  // MovingCube.translateY(-5);
                console.log("pos", avatar.position);  
                }
            else if (camera_mode==1)
                {
                  if(cameraDrone.position.z>50)
                    {
                    cameraDrone.position.z-=8;
                    }
                }
            
            // MovingCube.translateY(-5);
           

        break;

      case 37:  // Left
          Avatar.Object.translateX(5);
            // MovingCube.translateX(-5);
            console.log("pos", avatar.position);

        break;
      case 84:
        if (textureToggle==1)
            {
            textureToggle=0;
            console.log("Texture changed")
            uv_spherical(geometry,pyramid);
            uv_spherical(cy_geometry,cylinder);
            }
        else
            {
            textureToggle=1;
            uv_planar(geometry,pyramid);
            uv_planar(cy_geometry,cylinder);
            }
        break;
      case 38:  // Far
            // console.log("janviii", avatar.position);
            if (camera_mode!=1)
                {
                Avatar.Object.translateZ(5);
                }
            else if (camera_mode==1)
                {
                  cameraDrone.position.z+=8;
                
                }

        break;
    }

    switch(eee.key)
    {
        case "j":
          // Jump mode
          if(Jump_flag!=0)
            {
            console.log("Jump avatar jump");
            avatar_jump();
            }
          break;

        case "u":
          // Jump mode
          if(Jump_flag!=1)
            {
            console.log("UnJump avatar jump");
            avatar_ujump();
            }
          break;
    }


});
        
function avatar_jump()
{
  scene.remove(Avatar.Object);
  CarDummy2.Object.add(Avatar.Object);
  // Avatar.rotateX(Math.PI);
  Avatar.Object.position.set(-50,0,-50);
  Jump_flag=0;
  // cameraAvatar.position.set(CarDummy2.Object.position.x-50,CarDummy2.Object.position.y,CarDummy2.Object.position.z-40);
  Avatar.Object.rotateX(Math.PI);
  // Avatar.Object.rotateY(Math.PI);
}
function avatar_ujump()
{
  Jump_flag=1;
  // Avatar.Object.rotateY( -1*Math.PI/2);
  // var Avatar_temp
  CarDummy2.Object.remove(Avatar.Object);
  // Avatar=new SceneObjects( 'https://threejsfundamentals.org/threejs/resources/models/knight/KnightCharacter.gltf',new THREE.Vector3(-120,0,0),new GLTFLoader(),'Cars',1,1,1 );
  scene.add(Avatar.Object);
  Avatar.Object.position.set(-120,0,0);
  // Avatar.Object.rotation=new THREE.Vector3(0,0,0);
  Avatar.Object.rotateY( -1*Math.PI/2);
  
  // cameraAvatar.position.set(-120,0,0);
  Avatar.Object.rotateX(Math.PI);
}

function animate()
{
  requestAnimationFrame( animate );
  update();

  

}

// cameraAvatar.position.set(0,0,40);
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
            if (CarDummyLightFlag==1)
              {
              car.AddLight(car.Object.position, {x:car.Object.position.x, y:car.Object.position.y+10, z: car.Object.position.z}, Math.PI/4,1);
              }
            else
              {
              car.spotLight3.intensity=0;
              }
            if(car.Object.position.y >= 500)
            {
              car.k=-1;
            }
  
            else if(car.Object.position.y <= -300)
            {
                car.k=1;
            }
            

            if(car.is_moving)
            {
              car.Object.translateZ(car.k*10);
            }

      }
  });

  if(CarDummy2.flag==1 && Avatar.flag==1)
      {
      
        if(OnetimeFlag==0)
          {
          OnetimeFlag++;
          Avatar.Object.add(cameraAvatar);
          cameraAvatar.position.set(0,5,0)
          console.log(cameraAvatar);
          }
        if (Jump_flag==1)
        {
        // Avatar.Object.add(cameraAvatar);
        // Avatar.position.set(0,0,40);
        // cameraAvatar.position.set(Avatar.position.x,Avatar.position.y,Avatar.position.z);
        }
      else
        {
        // Avatar.Object.add(cameraAvatar);
        // Avatar.position.set(0,0,40);
        // cameraAvatar.position.set(CarDummy2.Object.position.x+Avatar.position.x,CarDummy2.Object.position.y+Avatar.position.y,CarDummy2.Object.position.z+ Avatar.position.z);
        // AvatarLookAt.z+=CarDummy2.k*10;
        }
        
        if (CarDummy2)
          {
          CarDummy2.AddLight(pyramid.position, {x:CarDummy2.Object.position.x, y:CarDummy2.Object.position.y, z: CarDummy2.Object.position.z}, Math.PI/24,2);  
          }
        else
          {
          CarDummy2.spotLight3.intensity=0;
          }
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
      
      if (resizeRendererToDisplaySize(renderer)) 
      {
        //   const canvas = renderer.domElement;
        //   cameraFixed.aspect = canvas.clientWidth / canvas.clientHeight;
        //   cameraFixed.updateProjectionMatrix();
      }
    
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
    else if (camera_mode==2)
      {
      // cameraAvatar.position.set(Avatar.Object.position.x,Avatar.Object.position.y,Avatar.Object.position.z+75);
      // console.log(Avatar.Object.rotation);
      AvatarLookAt.x=0;
      AvatarLookAt.y=-200;
      AvatarLookAt.z=20;
      cameraAvatar.aspect = canvas.clientWidth / canvas.clientHeight;
      cameraAvatar.up.set(0, 0, 1);
      // cameraAvatar.postition.set(Avatar.Object.position.x,Avatar.Object.position.y,Avatar.Object.position.z);
      AvatarLookAt=AvatarLookAt.applyAxisAngle( new THREE.Vector3( 0, 0, 1 ),CameraAngle);
      // console.log(AvatarLookAt);
      if(Jump_flag==1)
        {
        cameraAvatar.lookAt(Avatar.Object.position.x+AvatarLookAt.x,Avatar.Object.position.y +AvatarLookAt.y,Avatar.Object.position.z+AvatarLookAt.z);
        }
      else
        {
        AvatarLookAt.x=-500;
        AvatarLookAt.y=400;
        AvatarLookAt.z=0;
        AvatarLookAt=AvatarLookAt.applyAxisAngle( new THREE.Vector3( 0, 0, 1 ),CameraAngle);
        cameraAvatar.lookAt(CarDummy2.Object.position.x+Avatar.Object.position.x+AvatarLookAt.x,Avatar.Object.position.y+CarDummy2.Object.position.y +AvatarLookAt.y,Avatar.Object.position.z+CarDummy2.Object.position.z+AvatarLookAt.z);  
        }
        console.log(Avatar.Object.position);
      console.log(Avatar.Object.position.x+AvatarLookAt.x,Avatar.Object.position.y +AvatarLookAt.y,Avatar.Object.position.z+AvatarLookAt.z)

      renderer.render(scene, cameraAvatar);
      }
    else 
      {
        renderer.render(scene, cameraOrbit); 
      }
    }
    controls.update();

}

animate();