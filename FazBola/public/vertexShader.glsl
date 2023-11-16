uniform float time;
uniform float deformationIntensity;
uniform float twistIntensity;
uniform vec3 innerColor;
uniform vec3 outerColor;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;

void main() {
    vPosition = position;
    vUv = uv;
    vNormal = normalMatrix * normal;

    float twistAmount = twistIntensity * position.y;
    mat4 twist = mat4(
        cos(twistAmount), -sin(twistAmount), 0.0, 0.0,
        sin(twistAmount), cos(twistAmount), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    vec4 twistedPosition = twist * vec4(position, 1.0);
    vec3 deformedPosition = twistedPosition.xyz + normal * sin(position.x * 10.0 + time) * deformationIntensity;

    // Cálculo da distância do centro para misturar as cores
    float distanceFromCenter = length(deformedPosition.xy);
    vColor = mix(innerColor, outerColor, distanceFromCenter);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(deformedPosition, 1.0);
}
