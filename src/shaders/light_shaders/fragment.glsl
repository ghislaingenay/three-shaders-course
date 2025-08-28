uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vPosition;


#include ./includes/ambient_light.glsl
#include ./includes/directional_light.glsl
#include ./includes/point_light.glsl


void main()
{
    vec3 color = uColor;
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);



    // add the listing of lights
    vec3 light = vec3(0.0);
    light += ambientLight(vec3(1.0), 0.03);
    light += directionalLight(
        vec3(0.1,0.1,1.0), 
        0.5, 
        normal, 
        vec3(0.0,0.0,3.0),
        viewDirection,
        20.0
    );
    light += pointLight(
        vec3(1.0,0.1,0.1), 
        0.5, 
        normal, 
        vec3(0.0,2.5,0.0),
        viewDirection,
        20.0,
        vPosition,
        0.3
    );
      light += pointLight(
        vec3(0.1, 1.0, 0.5), // Light color
        1.0,                 // Light intensity,
        normal,              // Normal
        vec3(2.0, 2.0, 2.0), // Light position
        viewDirection,       // View direction
        20.0,                // Specular power
        vPosition,           // Position
        0.2                  // Light decay
    );
    color *= light;

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
// void main()
// {
//     gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
//     #include <tonemapping_fragment>
//     #include <colorspace_fragment>
// }