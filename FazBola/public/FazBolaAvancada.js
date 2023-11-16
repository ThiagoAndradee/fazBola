async function loadShader(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao carregar o shader: ${response.statusText}`);
  }
  return await response.text();
}


async function init() {
  // Configuração da cena, câmera e renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);

  // Ajustar o canvas quando a janela for redimensionada
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  const vertexShader = await loadShader('vertexShader.glsl');
  const fragmentShader = await loadShader('fragmentShader.glsl');  

  // Inicialização dos controles GUI
  const gui = new dat.GUI();

  const guiControls = {
    animationSpeed: 0.05,
    deformationIntensity: 0.1,
    twistIntensity: 0,
    light1Color: "#ff0000", // Representação inicial em hexadecimal
    light2Color: "#0000ff"
  };
  

//Pontos



  // Criar a esfera com ShaderMaterial
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      time: { value: 0 },
      deformationIntensity: { value: guiControls.deformationIntensity },
      twistIntensity: { value: guiControls.twistIntensity },
      innerColor: { value: new THREE.Color(0xFFBF2B) }, // Laranja
      outerColor: { value: new THREE.Color(0x5CA7FF) } // Azul
    }
  });
  

  const sphere = new THREE.Mesh(geometry, shaderMaterial);
  scene.add(sphere);

    // Controles para a esfera
    gui.add(guiControls, 'animationSpeed', 0, 0.2).name('Velocidade de Animação').onChange(value => {
      guiControls.animationSpeed = value;
    });
  
    gui.add(guiControls, 'deformationIntensity', 0, 1).name('Intensidade de Deformação').onChange(value => {
      shaderMaterial.uniforms.deformationIntensity.value = value;
    });
  
    gui.add(guiControls, 'twistIntensity', -5.0, 5.0).name('Intensidade de Torção').onChange(value => {
      shaderMaterial.uniforms.twistIntensity.value = value;
    });
  

// Update color controls for innerColor and outerColor
const innerColorController = gui.addColor({ innerColor: shaderMaterial.uniforms.innerColor.value.getHex() }, 'innerColor').name('Cor Central');
innerColorController.onChange(value => {
  shaderMaterial.uniforms.innerColor.value.set(value);
});

const outerColorController = gui.addColor({ outerColor: shaderMaterial.uniforms.outerColor.value.getHex() }, 'outerColor').name('Cor Externa');
outerColorController.onChange(value => {
  shaderMaterial.uniforms.outerColor.value.set(value);
});


  // Posição da câmera
  camera.position.z = 5;

  // Adicionar luzes básicas
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Luzes pontuais
  const pointLight1 = new THREE.PointLight(0xff0000, 2, 50);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x0000ff, 2, 50);
  pointLight2.position.set(-5, -5, 5);
  scene.add(pointLight2);

  // Criar GUI com dat.GUI (opcional)
  // ... Você pode adicionar controles para ajustar propriedades da cena ...

  // Função de animação
  const animate = () => {
    requestAnimationFrame(animate);

    // Atualizar os uniforms
    shaderMaterial.uniforms.time.value += guiControls.animationSpeed;
    shaderMaterial.uniforms.deformationIntensity.value = guiControls.deformationIntensity;
    shaderMaterial.uniforms.twistIntensity.value = guiControls.twistIntensity;

    sphere.rotation.y += 0.01; // Rotação adicional da esfera

    renderer.render(scene, camera);
  };

  animate();
}

init();
