uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;

uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;


attribute vec4 tangent; // geometry.computeTangent()

varying float vWobble;


#include ./includes/simplexNoise4d.glsl

float getWobble(vec3 position)
{
    vec3 warpedPosition = position;
     warpedPosition += simplexNoise4d(
        vec4(
            position * uWarpPositionFrequency,
            uTime * uWarpTimeFrequency
        )
    ) * uWarpStrength;
    return simplexNoise4d(
        vec4(
             warpedPosition * uPositionFrequency,
             uTime * uTimeFrequency
        )
        ) * uStrength;
}

void main()
{

    vec3 biTangent = cross(normal, tangent.xyz);

    // calculate neighbors to process normals
    float shift = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent.xyz * shift;


    // Wobble
    float wobble = getWobble(csm_Position);
    csm_Position += wobble * normal;
    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;

    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);

    // Compute normal
    csm_Normal = normalize(cross(toA, toB));
    
    vWobble = wobble / uStrength;

}