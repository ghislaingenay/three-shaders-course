uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;



attribute vec3 aPositionTarget;
attribute float aSize;

varying vec3 vColor;


#include ./simplexNoise3d.glsl


void main()
{

    vec3 newPosition = position;

    // Mixed  position - 0.1 is frequency
    float originalNoise = simplexNoise3d(newPosition * 0.1); // The Simplex Noise ranges from -1 to +1
    float targetedNoise = simplexNoise3d(aPositionTarget * 0.1); // The Simplex Noise ranges from -1 to +1
    float noise = mix(originalNoise, targetedNoise, uProgress);
    noise = smoothstep(-1.0, 1.0, originalNoise);



    float duration  = 0.4;
    float delay = (1.0 - duration) * noise;
    float end = delay + duration;
    float progress = smoothstep(delay,end,uProgress);
    vec3 mixedPosition = mix(newPosition, aPositionTarget, progress);
    // Final position
    vec4 modelPosition = modelMatrix * vec4(mixedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = uSize * uResolution.y * aSize;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor = mix(uColorA, uColorB,vec3(noise));

}