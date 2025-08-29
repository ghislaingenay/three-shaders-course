uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorMultiplier;
uniform float uColorOffset;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ./includes/ambient_light.glsl
#include ./includes/directional_light.glsl
#include ./includes/point_light.glsl


void main()
{

    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);


    // Base Color
    float mixStrength = (vElevation  + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0, 1.0, mixStrength);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    
    vec3 light = vec3(0.0);
    light += pointLight(
      vec3(1.0),
      1.0,
      normal,
      vec3(0.0,0.25,0.0),
      viewDirection,
      30.0,
      vPosition,
      0.95
    );

    color*= light;


    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}