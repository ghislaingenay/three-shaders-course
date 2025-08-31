// uniform float uPositionFrequency;
// uniform float uStrength;
// uniform float uWarpStrength;
// uniform float uWarpFrequency;
// uniform float uTime;

// #include ./includes/simplexNoise2d.glsl

// float getElevation(vec2 position)
// {
//     float elevation = 0.0;

//     vec2 warpedPosition = position;
//     warpedPosition += uTime * 0.2;
//     warpedPosition += simplexNoise2d(
//       warpedPosition * uPositionFrequency * uWarpFrequency
//     ) * uWarpStrength;
//     elevation += simplexNoise2d(warpedPosition * uPositionFrequency) * 0.5;
//     elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) * 0.25;
//     elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) * 0.125; // we never reach one

//     float elevationSign = sign(elevation);
//     elevation = pow(abs(elevation), 2.0) * elevationSign; // Exaggerate the elevation
//     elevation *= uStrength;
//     return elevation;
// }


// void main() 
// {
//   // Neighbours positions
//   float shift = 0.02;
//   vec3 positionA = position.xyz + vec3(shift, 0.0, 0.0);
//   vec3 positionB = position.xyz + vec3(0.0, 0.0, -shift);

//   // Elevation
//   float elevation = getElevation(csm_Position.xz);
//   csm_Position.y += elevation;
//   positionA.y += getElevation(positionA.xz);
//   positionB.y += getElevation(positionB.xz);

//   // Compute normal
//   vec3 toA = normalize(positionA - csm_Position);
//   vec3 toB = normalize(positionB - csm_Position);
//   csm_Normal = cross(toA, toB);


// // }
// }

uniform float uTime;
uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpFrequency;
uniform float uWarpStrength;

varying vec3 vPosition;
varying float vUpDot;

#include ./includes/simplexNoise2d.glsl

float getElevation(vec2 position)
{
    vec2 warpedPosition = position;
    warpedPosition += uTime * 0.2;
    warpedPosition += simplexNoise2d(warpedPosition * uPositionFrequency * uWarpFrequency) * uWarpStrength;
    
    float elevation = 0.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency      ) / 2.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0;

    float elevationSign = sign(elevation);
    elevation = pow(abs(elevation), 2.0) * elevationSign;
    elevation *= uStrength;

    return elevation;
}

void main()
{
    // Neighbours positions
    // Use original position for all calculations

    // should compute them relative to the original position
    vec3 originalPos = position;
    float shift = 0.01;
    vec3 positionA = originalPos.xyz + vec3(shift, 0.0, 0.0);
    vec3 positionB = originalPos.xyz + vec3(0.0, 0.0, - shift);

    // Elevation
    float elevation = getElevation(originalPos.xz);
     // Apply displacements consistently
    csm_Position = originalPos;
    csm_Position.y += elevation;
    positionA.y    += getElevation(positionA.xz);
    positionB.y    += getElevation(positionB.xz);
    
    // Compute normal from displaced positions
    vec3 toA = positionA - csm_Position;
    vec3 toB = positionB - csm_Position;
    csm_Normal = normalize(cross(toA, toB));

    // Varyings
    vPosition = csm_Position;
    vPosition.xz += uTime * 0.2;
    vUpDot = dot(csm_Normal, vec3(0.0, 1.0, 0.0));
}