uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorMultiplier;
uniform float uColorOffset;

varying float vElevation;

// Permutation polynomial: (34x+1)*x mod 289
vec4 permute(vec4 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}



void main()
{
    float mixStrength = (vElevation  + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    // #include <waterFragment>
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
}