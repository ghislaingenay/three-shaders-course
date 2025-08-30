 varying vec3 vPosition;
 varying vec3 vNormal;


void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vPosition = modelPosition.xyz;
    vec3 modelNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vNormal = modelNormal;

}


// void main()
// {
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectedPosition = projectionMatrix * viewPosition;
//     gl_Position = projectedPosition;
// }