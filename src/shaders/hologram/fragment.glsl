uniform float uTime;
uniform vec3 uColor;


varying vec3 vPosition;
varying vec3 vNormal;




void main()
{

    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing) normal *= - 1.0;
    float stripes = mod((vPosition.y - uTime * 0.2) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);

    vec3 viewDirection = normalize(vPosition - cameraPosition);

    // 1 if same direction, -1 if opposite, perpendicular 0
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);

    float falloff = smoothstep(0.8, 0.0, fresnel);
    // The 0.8 and 0.0 limits for the smoothstep might sound odd, 
    // but it’s because we’ve already applied a pow on fresnel and also 
    // because the AdditiveBlending is making the edges already quite bright 
    // since we see both faces.



    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;
    gl_FragColor = vec4(uColor, holographic);


    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}


// void main()
// {
//     gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
//     #include <tonemapping_fragment>
//     #include <colorspace_fragment>
// }