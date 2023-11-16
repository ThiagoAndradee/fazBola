// Configuração da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Redimensionar o canvas quando a janela for redimensionada
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

//Configuracao das cores das luzes para o gradiente
const lightConfig = {
    light1Color: 0xff0040, // Cor inicial para a luz 1
    light2Color: 0x0040ff  // Cor inicial para a luz 2
  };
  

// Configuração da esfera
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sphere = new THREE.Mesh(geometry, material);


// Função para ajustar os vértices da esfera
const adjustVertices = () => {
    const vertices = sphere.geometry.attributes.position;
    const offset = 0.02; // Ajuste para controlar a intensidade do movimento
  
    for (let i = 0; i < vertices.count; i++) {
      // Pegar a posição atual do vértice
      const x = vertices.getX(i);
      const y = vertices.getY(i);
      const z = vertices.getZ(i);
  
      // Criar um vetor a partir da posição do vértice
      let vertex = new THREE.Vector3(x, y, z);
  
      // Normalizar o vetor (faz com que aponte para fora do centro da esfera)
      vertex.normalize();
  
      // Aplicar o deslocamento aleatório
      let randomOffset = (Math.random() - 0.5) * offset;
      vertex.multiplyScalar(1 + randomOffset); // Escala o vetor
  
      // Atualizar a posição do vértice
      vertices.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
  
    vertices.needsUpdate = true; // Informa ao Three.js que os vértices foram atualizados
  };
  

  

scene.add(sphere);

// Posição da câmera
camera.position.z = 5;

// Iluminação básica
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

//Luzes coloridas
const light1 = new THREE.PointLight(lightConfig.light1Color, 50, 50);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new THREE.PointLight(lightConfig.light2Color, 50, 50);
light2.position.set(-5, -5, -5);
scene.add(light2);

// Alterar o material da esfera para Phong, que reage melhor à luz
sphere.material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x555555, shininess: 100 });


//Controlador para girar a bola
let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0
};

const onMouseDown = (e) => {
    isDragging = true;
  };
  
  const onMouseMove = (e) => {
    if (isDragging) {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };
  
      const rotationSpeed = 0.005; // Ajuste para controlar a velocidade de rotação
  
      sphere.rotation.y += deltaMove.x * rotationSpeed;
      sphere.rotation.x += deltaMove.y * rotationSpeed;
    }
  
    previousMousePosition = {
      x: e.offsetX,
      y: e.offsetY
    };
  };
  
  const onMouseUp = () => {
    isDragging = false;
  };
  
  // Adicionar event listeners
  renderer.domElement.addEventListener('mousedown', onMouseDown, false);
  renderer.domElement.addEventListener('mousemove', onMouseMove, false);
  renderer.domElement.addEventListener('mouseup', onMouseUp, false);

// Loop de animação
const animate = () => {
    requestAnimationFrame(animate);
  
    // Adicione a rotação e a função para ajustar os vértices aqui
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
  
    adjustVertices(); // Chamada para ajustar os vértices
  
    renderer.render(scene, camera);
  };

animate();

//GUI

const gui = new dat.GUI();

// Adicionando controles de cor no dat.GUI
gui.addColor(lightConfig, 'light1Color').onChange(value => {
    light1.color.set(value);
  });
  
  gui.addColor(lightConfig, 'light2Color').onChange(value => {
    light2.color.set(value);
  });

const sphereConfig = {
  radius: 1,
  widthSegments: 32,
  heightSegments: 32,
  offset: 50 //Valor inicial do offset da animacao
};

gui.add(sphereConfig, 'radius', 0.1, 5).onChange(value => {
  sphere.geometry.dispose();
  sphere.geometry = new THREE.SphereGeometry(value, sphereConfig.widthSegments, sphereConfig.heightSegments);
});
