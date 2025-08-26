
varying vec3 vColor;


void main()
{

    // Disc pattern
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = smoothstep(0.4, 0.5, strength);
    // strength = 1.0 - strength;

    // Diffuse pattern
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0;
    // strength = 1.0 - strength;

    // Light point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);


    gl_FragColor = vec4(vec3(vColor),strength);
    #include <colorspace_fragment>
}