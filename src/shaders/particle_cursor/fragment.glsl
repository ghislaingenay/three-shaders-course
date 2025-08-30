uniform sampler2D uPictureTexture;
uniform vec2 uResolution;
varying vec3 vColor;


void main()
{
    vec2 uv = gl_PointCoord;

    // Picture
    float pictureIntensity = texture(uPictureTexture, uv).r;

    vec3 textureColor = texture(uPictureTexture, uv).xyz;

    float distanceToCenter = length(uv-vec2(0.5));
    if (distanceToCenter > 0.5) discard; // can have performance impact
    gl_FragColor = vec4(vColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}