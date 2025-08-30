 uniform vec3 uColor;
 uniform vec3 uPointColor;
 uniform vec2 uResolution;
 uniform float uShadowRepetition;

 uniform vec3 uHalfToneDirection;
 uniform float uLow;
 uniform float uHigh;
 uniform float uAlphaPoint;

 varying vec3 vPosition;
 varying vec3 vNormal;


#include ./includes/ambient_light.glsl
#include ./includes/directional_light.glsl


vec3 halftone(
    vec3 color,
    float repetition,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal,
    float alpha
) 
{
    float intensity = dot(direction, normal);
    intensity = smoothstep(low, high, intensity);

    vec2 uv = gl_FragCoord.xy / uResolution.y; // divide by resolution by screen is not always square => divide only y => apply both the same
    uv *= repetition;
    uv = mod(uv,1.0);

    // Disc instead of grid
    float point = distance(uv,vec2(0.5));
    point = 1.0 - step(0.5 * intensity,point * alpha);

    color = mix(color, pointColor, point);
    return color;

}



void main()
{
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 color = uColor;

    // Light
    vec3 light = ambientLight(vec3(1.0), 1.0);
    light += directionalLight(
        vec3(1.0, 1.0, 1.0),  // Light color
        1.0,  // Light intensity
        normal, // Normal
        vec3(1.0, 1.0, 1.0), // Light position
        viewDirection, // View direction
        32.0 // radius
    );
    color *= light;

    color = halftone(
        color, 
        uShadowRepetition, 
        uHalfToneDirection, 
        uLow, 
        uHigh, 
        uPointColor, 
        normal,
        uAlphaPoint
    );

 


    // Final color
    gl_FragColor = vec4(vec3(color), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
// void main()
// {
//     gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
//     #include <tonemapping_fragment>
//     #include <colorspace_fragment>
// }