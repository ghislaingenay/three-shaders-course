uniform sampler2D uTexture;
uniform vec3 uColor;


void main()
{
    float textureAlpha = texture(uTexture, gl_PointCoord).r;

    vec4 textureColor = texture(uTexture, gl_PointCoord);

    gl_FragColor = vec4(uColor,textureAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
// void main()
// {
//     gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
//     #include <tonemapping_fragment>
//     #include <colorspace_fragment>
// }