

varying vec3 vColor;


void main()
{

    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);
    // We want it to be very high at first and plunge very fast. We can use the small number division technique.
    // alpha never reaches 0.0 at the edges.
    float alpha = 0.05 / distanceToCenter - 0.1;


    gl_FragColor = vec4(vColor, alpha);



    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}