

varying vec2 vUv; 


void main()
{     

    csm_DiffuseColor.rgb = vec3(1.0, 0.0, 0.0);
    csm_Metalness = step(0.0, sin(vUv.x * 100.0));
    csm_Roughness = 1.0 - csm_Metalness;
    // csm_FragColor.rgb = vec3(1.0, 0.5, 0.5);
    // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}