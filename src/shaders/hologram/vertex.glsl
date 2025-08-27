uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
    

#include ./rotate2D.glsl

float random2D(vec2 value)
{
    return fract(sin(dot(value.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0); // 1 so all transformations will be applied
     // Glitch
    float glitchTime = uTime - modelPosition.y;
    // ombine multiple sin() together with various frequencies
     float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) +  sin(glitchTime * 8.76);
    glitchStrength /= 3.0;
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength); // want the effect to appear less often and we need to remap it.
     glitchStrength *= 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Fresnel
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0); // translations won't be applied

    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;

}

// void main()
// {
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectedPosition = projectionMatrix * viewPosition;
//     gl_Position = projectedPosition;
// }