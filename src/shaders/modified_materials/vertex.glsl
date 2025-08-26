float angle = position.y + uTime;
mat2 rotateMatrix = get2dRotationMatrix(angle);

// rotate every vertices
transformed.xz += transformed.xz * rotateMatrix;
