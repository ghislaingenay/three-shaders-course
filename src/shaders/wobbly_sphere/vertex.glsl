varying vec2 vUv; 
void main()
{
    csm_Position.y += sin(csm_Position.z * 3.0) * 0.5;
    // Final position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vUv = uv;

}