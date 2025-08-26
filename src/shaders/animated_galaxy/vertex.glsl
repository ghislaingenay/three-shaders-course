
uniform float uSize;
uniform float uTime;
attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // Move slightly up and down
    modelPosition.y += sin(uTime + position.x * 0.1) * 0.1;

    float angle = atan(modelPosition.x, modelPosition.z);
    // everything is already centered in the scene
    float distanceToCenter = length(modelPosition.xz);
    // how much partcle should have spin 
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;

    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    // Randomness
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uSize * aScale;
    // size attenuation
    gl_PointSize *= ( 1.0 / - viewPosition.z ); // do not want scale by height = set to 1.0

    vColor = color;
}