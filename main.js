// Scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0e7e5);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 0); // FPP height

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(5,10,7);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff,0.5));

// PointerLockControls
const controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener('click', ()=>{controls.lock();});
scene.add(controls.getObject());

// Floor plane
const floorGeometry = new THREE.PlaneGeometry(50,50);
const floorMaterial = new THREE.MeshStandardMaterial({color:0x228B22});
const floor = new THREE.Mesh(floorGeometry,floorMaterial);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

// Loaders
const loader = new THREE.GLTFLoader();
let gifts = [];
let collected = 0;
const letters = [
  "Hello Maharani Ji! 🎀 This is your first gift!",
  "You're amazing and deserve happiness 💖",
  "Each gift brings you closer to your surprise 💌",
  "Almost there! Keep going, DD 🥰",
  "You found all gifts! Open your final letter ❤️"
];

// Load garden
loader.load('assets/garden.glb', gltf=>{
  scene.add(gltf.scene);
});

// Load gifts
for(let i=0;i<5;i++){
  loader.load('assets/gift.glb', gltf=>{
    const gift = gltf.scene;
    gift.position.set(Math.random()*20-10,0,Math.random()*20-10);
    gift.userData.index = i;
    scene.add(gift);
    gifts.push(gift);
  });
}

// Movement
const velocity = new THREE.Vector3();
const move = {forward:false,back:false,left:false,right:false};

document.addEventListener('keydown',e=>{
  if(e.code==='KeyW') move.forward=true;
  if(e.code==='KeyS') move.back=true;
  if(e.code==='KeyA') move.left=true;
  if(e.code==='KeyD') move.right=true;
});
document.addEventListener('keyup',e=>{
  if(e.code==='KeyW') move.forward=false;
  if(e.code==='KeyS') move.back=false;
  if(e.code==='KeyA') move.left=false;
  if(e.code==='KeyD') move.right=false;
});

// Letter popup
const letterDiv = document.getElementById('letterPopup');
function showLetter(text){
  letterDiv.innerText = text;
  letterDiv.style.display='block';
  setTimeout(()=>{letterDiv.style.display='none';},3000);
}

// Collision detection
function checkGifts(){
  gifts.forEach((gift,index)=>{
    const dist = camera.position.distanceTo(gift.position);
    if(dist<1.5 && !gift.userData.collected){
      gift.userData.collected=true;
      scene.remove(gift);
      showLetter(letters[index]);
      collected++;
      document.getElementById('scoreUI').innerText=`Gifts Collected: ${collected}/5`;
      if(collected===5){
        showLetter("🎉 All gifts collected! Happy Birthday, Maharani Ji! 🎉");
      }
    }
  });
}

// Animate loop
const clock = new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const speed = 5;

  // Movement
  if(move.forward) controls.moveForward(speed*delta);
  if(move.back) controls.moveForward(-speed*delta);
  if(move.left) controls.moveRight(-speed*delta);
  if(move.right) controls.moveRight(speed*delta);

  checkGifts();
  renderer.render(scene,camera);
}
animate();

// Resize
window.addEventListener('resize',()=>{
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
});
