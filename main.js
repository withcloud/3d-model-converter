import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Set up the scene, camera, and renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add basic lighting
let ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
scene.add(ambientLight);
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 0).normalize();
scene.add(directionalLight);

// Function to update the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Begin animation
animate();

// Function to handle file input change
function handleFileInputChange(event) {
  const URL = window.URL || window.webkitURL;
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  
  if (file.name.match(/\.(fbx)$/i)) {
    let loader = new FBXLoader();
    loader.load(url, (object) => {
      scene.add(object);
    });
  } else if (file.name.match(/\.(gltf|glb)$/i)) {
    let loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      scene.add(gltf.scene);
    });
  }
}

// Function to handle the conversion and downloading of the GLTF
function convertAndDownloadGLTF() {
  // Ensure textures are ready for export
  scene.traverse((node) => {
    if (node.isMesh && node.material && node.material.map) {
      let texture = node.material.map;
      if (texture.image instanceof HTMLCanvasElement) {
        let img = new Image();
        img.src = texture.image.toDataURL();
        texture.image = img;
      } else if (texture.image instanceof HTMLVideoElement) {
        let canvas = document.createElement('canvas');
        canvas.width = texture.image.videoWidth;
        canvas.height = texture.image.videoHeight;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height);
        let img = new Image();
        img.src = canvas.toDataURL();
        texture.image = img;
      }
      texture.needsUpdate = true;
    }
  });

  let exporter = new GLTFExporter();
  exporter.parse(scene, (result) => {
    if (result instanceof ArrayBuffer) {
      saveArrayBuffer(result, 'scene.glb');
    } else {
      let output = JSON.stringify(result, null, 2);
      console.log(output);
      saveString(output, 'scene.gltf');
    }
  }, (e) => { console.log(e) }, { binary: true });
}

// Function to save the GLTF or GLB
function saveArrayBuffer(buffer, filename) {
  let blob = new Blob([buffer], { type: 'application/octet-stream' });
  let link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  // Clean up
  document.body.removeChild(link);
}

// Add event listener to file input
document.getElementById('file-input').addEventListener('change', handleFileInputChange, false);
document.getElementById('convert-button').addEventListener('click', convertAndDownloadGLTF, false);