uniform vec3 uColor;
uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 normal = normalize(vNormal);
    // vec3 color = uColor;
     vec3 color = vec3(0.0);

     vec3 viewDirection = vPosition - cameraPosition;

    // Day / night color
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    color = nightColor;


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