uniform vec3 uColor;
uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    float sunOrientation = dot(normal, uSunDirection);
     
    // Day / night color
    float dayMix = smoothstep(-0.25, 0.5, sunOrientation); // - 0.25 day go a bit behind the earth
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    color = mix(nightColor, dayColor, dayMix);

    // Specular clouds color
    vec2 specularCloudColor = texture(uSpecularCloudsTexture, vUv).rg;
     // Clouds
    float cloudsMix = smoothstep(0.5, 1.0, specularCloudColor.g);
    cloudsMix *= dayMix;
    color = mix(color, vec3(1.0), cloudsMix);

    // Fresnel
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0); // uh the value in the edges

    // Atmosphere
    float atmosphereDayMix = smoothstep(- 0.5, 1.0, sunOrientation);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    //  The atmosphere is more visible on the edges of the planet. => FRESNEL
    color = mix(color, atmosphereColor, fresnel * atmosphereDayMix); // multiply by atmosphereDayMix: nothing in the back

    // Specular
    vec3 reflection = reflect(- uSunDirection, normal);
    // if reflection and viewDirection aligned => max value
    float specular =  - dot(reflection, viewDirection);
    specular = max( specular, 0.0);
    specular = pow(specular, 32.0);

    specular *= specularCloudColor.r;

    vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);
    color += specular * specularColor;

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