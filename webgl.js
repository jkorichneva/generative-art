import canvasSketch from "canvas-sketch";
import random from 'canvas-sketch-util/random';
import getPalette from "./utils/getPalette";
// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const settings = {
  dimensions: [512, 512],
  fps: 30,
  duration: 4,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes: { antialias: false },
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("white", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();
  const palette = getPalette(2, 6);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 40; i++) {

    // Setup a material
    const material = new THREE.MeshStandardMaterial({
      color: random.pick(palette),
    });

    // Setup a mesh with geometry + material
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(random.range(-1, 1), random.range(-1, 1), random.range(-1, 1));
    mesh.scale.set(random.range(-1, 1), random.range(-1, 1), random.range(-1, 1));
    mesh.scale.multiplyScalar(0.5);
    scene.add(mesh);
  }
  const light = new THREE.DirectionalLight('white', 0.6);
  light.position.set(0, 0, 4);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight('hsl(0, 0%, 40%)');
  scene.add(ambientLight);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      const aspect = viewportWidth / viewportHeight;
      // Ortho zoom
      const zoom = 2;
      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      // Near/Far
      camera.near = -100;
      camera.far = 100;
      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      scene.rotation.z = playhead * Math.PI * 2;
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
