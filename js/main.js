let container;
let scene;
let camera;
let renderer;
let material;
let geometry;
let mesh;
let controls;

function init() {
  container = document.querySelector("#scene-container");
  createScene(); // universe in which my 3D objects live
  createCamera(); // camera that enables me to see the scene
  createMaterials(); // Materials define the surface properties of objects - that is, which material that the object looks like it is made from
  createGeometries(); // the geometry of an object defines its shape
  createMesh();
  createLight();
  createRenderer(); // this is a machine that takes a Camera and a Scene as input and outputs beautiful drawings (or renderings) onto your <canvas>
  createControls();
  play();
}

function createScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("skyblue"); // the color of the scene (think about it as the walls)
}

function createCamera() {
  const fov = 35; // field of view - the .fov parameter defines how much bigger the far clipping plane will be than the near clipping plane. The valid range for the FOV is from 1 to 179 degrees.
  // Console games designed to be shown on screens far away from the viewer are usually between 40 - 60 degrees, while a PC game might use a higher FOV of around 90 since the screen is likely to be right in front of the player.
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1; // the near clipping plane - le plan le + rapproché auquel la caméra a accès
  const far = 100; // the far clipping plane - le plan le + éloigné qui est encore dans le champs de la caméra
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // every object is initially created at ( 0, 0, 0 ); we'll move the camera back a bit so that we can view the scene
  camera.position.set(-4, 4, 10);
  //camera.lookAt(0, 0, 0); // value by default when we use OrbitControls
}

function createControls() {
  controls = new THREE.OrbitControls(camera, container);
}

function createMaterials() {
  // create a texture loader.
  const textureLoader = new THREE.TextureLoader();

  // Load a texture. See the note in chapter 4 on working locally, or the page
  // https://threejs.org/docs/#manual/introduction/How-to-run-things-locally
  // if you run into problems here
  const texture = textureLoader.load("textures/uv_test_bw.png"); // we are not obliged to load our own material, three.js has a lot of different materials of its own

  // set the "color space" of the texture
  texture.encoding = THREE.sRGBEncoding;

  // reduce blurring at glancing angles
  texture.anisotropy = 16;

  // create a Standard material using the texture we just loaded as a color map
  material = new THREE.MeshStandardMaterial({
    // different materials have different properties
    map: texture,
  });
  // materials handles light, color...
  //material = new THREE.MeshBasicMaterial(); // // create a default (white) Basic material - always use this in doubt, because it will still appear on the screen, even tho we forget to light up the scene
}

function createLight() {
  // by default, a room is without light. If we use Basic Mesh, it will still appear even if we don't turn on lights, but for other Meshs to work, we need to add add light to the room (the room itself can have colors, but this is the background of the scene)

  const ambientLight = new THREE.HemisphereLight(
    0xddeeff, // bright sky color
    0x202020, // dim ground color
    3 // intensity
  );

  const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
  // move the light back and up a bit
  mainLight.position.set(10, 10, 10); // the light will be shinning shining from ( 10, 10, 10 )(10,10,10) towards (0, 0, 0 )(0,0,0).
  // remember to add the light to the scene
  scene.add(ambientLight, mainLight);
}

function createGeometries() {
  geometry = new THREE.BoxBufferGeometry(2, 2, 2);
}

function createMesh() {
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh); // adding to the scene the object that we just created
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true }); // creates the canvas in the html / anti-alias is a parameter to handle the hedges
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.physicallyCorrectLights = true;
  container.appendChild(renderer.domElement);
}

function update() {
  // mesh.rotation.z += 0.01;
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;
}

function render() {
  // set the gamma correction so that output colors look
  // correct on our screens
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.render(scene, camera); // renders a still image of the scene from the point of view of the camera and outputs that picture into the <canvas> element.
}

function play() {
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function stop() {
  renderer.setAnimationLoop(null);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix(); // needs to be called everytime we change one property of the camera
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

init();
