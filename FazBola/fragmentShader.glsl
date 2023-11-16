uniform sampler2D map; // Textura
uniform vec3 ambientLightIntensity; // Intensidade da luz ambiente
uniform vec3 pointLightPosition; // Posição da luz pontual
uniform vec3 pointLightColor; // Cor da luz pontual

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vec4 texelColor = texture2D(map, vUv);

    // Cálculo da luz ambiente
    vec3 lightColor = ambientLightIntensity * (vNormal * 0.5 + 0.5);
    vec3 ambient = mix(texelColor.rgb, lightColor, 0.5);

    // Cálculo da luz pontual
    vec3 lightDirection = normalize(pointLightPosition - vPosition);
    float dotProduct = max(dot(vNormal, lightDirection), 0.0);
    vec3 diffuse = pointLightColor * texelColor.rgb * dotProduct;

    // Mistura das influências de luz
    vec3 result = mix(ambient, diffuse, 0.5);

    gl_FragColor = vec4(result, 1.0);
}
