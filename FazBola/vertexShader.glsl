uniform float time;
uniform float deformationIntensity;
uniform float twistIntensity; // Intensidade da torção
varying vec3 vNormal;
varying vec2 vUv; // Coordenadas UV
varying vec3 vPosition; // Posição do vértice

void main() {
    vPosition = position;
    vUv = uv;
    vNormal = normalMatrix * normal; // Transformação da normal

    float twistAmount = twistIntensity * position.y; // Torção baseada na altura do vértice
    mat4 twist = mat4(
        cos(twistAmount), -sin(twistAmount), 0.0, 0.0,
        sin(twistAmount), cos(twistAmount), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    vec4 twistedPosition = twist * vec4(position, 1.0);

    // Lógica de deformação
    vec3 deformedPosition = twistedPosition.xyz + normal * sin(position.x * 10.0 + time) * deformationIntensity;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(deformedPosition, 1.0);
}
