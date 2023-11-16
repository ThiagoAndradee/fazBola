async function loadShader(url) {
  const response = await fetch(url);
  return await response.text();
}

async function init() {
  
  const vertexShader = await loadShader('vertexShader.glsl');
  const fragmentShader = await loadShader('fragmentShader.glsl');

  // Configuração da cena, câmera e renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff); // Definir a cor de fundo para branco
  document.body.appendChild(renderer.domElement);

  // Ajustar o canvas quando a janela for redimensionada
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // Configurações para o GUI
  const guiControls = {
    animationSpeed: 0.05,
    deformationIntensity: 0.1, // Inicialize com um valor padrão
    twistIntensity: 0
  };

  // Criar a esfera
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const textureLoader = new THREE.TextureLoader();
  const texture = await new Promise((resolve) => {
    textureLoader.load('https://images.unsplash.com/photo-1552083974-186346191183?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', resolve);
  });

  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      time: { value: 0 },
      deformationIntensity: { value: guiControls.deformationIntensity },
      twistIntensity: { value: guiControls.twistIntensity },
      map: { value: texture }
    }
  });

  const sphere = new THREE.Mesh(geometry, shaderMaterial);
  scene.add(sphere);

  // Posição da câmera
  camera.position.z = 5;

  // Adicionar luzes básicas
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Luz pontual 1
  const pointLight1 = new THREE.PointLight(0xff0000, 2, 50);
  pointLight1.position.set(50, 50, 50);
  scene.add(pointLight1);

  // Luz pontual 2
  const pointLight2 = new THREE.PointLight(0x0000ff, 2, 50);
  pointLight2.position.set(-50, -50, 50);
  scene.add(pointLight2);



  // Criar GUI com dat.GUI
  const gui = new dat.GUI();
  gui.add(guiControls, 'animationSpeed', 0, 0.2);
  gui.add(guiControls, 'deformationIntensity', 0, 1);
  gui.add(guiControls, 'twistIntensity', 0, 5.0);

  // Em sua função de animação
  const animate = () => {
    requestAnimationFrame(animate);

    // Rotação adicional da esfera
    sphere.rotation.y += 0.01;

    // Atualizar os uniforms
    shaderMaterial.uniforms.time.value += guiControls.animationSpeed;
    shaderMaterial.uniforms.deformationIntensity.value = guiControls.deformationIntensity;
    shaderMaterial.uniforms.twistIntensity.value = guiControls.twistIntensity;

    renderer.render(scene, camera);
  };

  animate();
}

init();
