uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
varying vec3 vColor;



void main()
{

    // Picture
    float pictureIntensity = texture(uPictureTexture, uv).r;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = 0.15 * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // we are going to make the dark ones even darker, while keeping the bright ones the same brightness
    // Crush vColor by applying powers
    vColor = vec3(pow(pictureIntensity, 2.0));

}