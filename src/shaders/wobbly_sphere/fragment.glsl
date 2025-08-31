uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vWobble;


void main()
{     
    // create a float colorMix variable by remapping 
    // vWobble so that it goes from 0 to 1 instead of -1 to +1 and use a smoothstep to smooth the value:
    float colorMix = smoothstep(- 1.0, 1.0, vWobble);
    csm_Metalness = step(0.25, vWobble);
    csm_Roughness = 1.0 - csm_Metalness;
    
    csm_DiffuseColor.rgb = mix(uColorA, uColorB, colorMix);
    // csm_DiffuseColor.rgb = vec3(1.0, 1.0, 1.0);
    // csm_Metalness = step(0.0, sin(vUv.x * 100.0));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}