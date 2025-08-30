uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;






void main()
{

    // Picture
    float pictureIntensity = texture(uPictureTexture, uv).r;

    // Displacement
    vec3 newPosition = position;
    // particles to elevaltion when case is white
    float displacementIntensity = smoothstep(0.1, 0.3, texture(uDisplacementTexture, uv).r);

    // direction in which displament should happen
    float uAngleFactor = 0.2;
    
    vec3 displacement = vec3(cos(aAngle * uAngleFactor),  sin(aAngle * uAngleFactor), 1.0);
    displacement = normalize(displacement);
    displacement *= displacementIntensity * aIntensity;
    displacement *= 3.0;
    
    newPosition += displacement;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
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