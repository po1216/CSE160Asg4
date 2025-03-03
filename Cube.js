class Cube {
    constructor() {
        this.type = "cube";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.textureNum = [-2, -2];

        this.cubeVerts32 = new Float32Array([
            // Front of the cube
            0.0,0.0,0.0,   1.0,1.0,0.0,    1.0,0.0,0.0,
            0.0,0.0,0.0,   0.0,1.0,0.0,    1.0,1.0,0.0,

            // Top of the cube
            0.0,1.0,0.0,   1.0,1.0,1.0,    1.0,1.0,0.0,
            0.0,1.0,0.0,   0.0,1.0,1.0,    1.0,1.0,1.0,

            // Bottom of the cube
            0.0,0.0,0.0,   1.0,0.0,1.0,    1.0,0.0,0.0,
            0.0,0.0,0.0,   0.0,0.0,1.0,    1.0,0.0,1.0,

            // Back of the cube
            0.0,0.0,1.0,   1.0,1.0,1.0,    1.0,0.0,1.0,
            0.0,0.0,1.0,   0.0,1.0,1.0,    1.0,1.0,1.0,

            // Right face
            1.0,0.0,0.0,   1.0,1.0,1.0,    1.0,0.0,1.0,
            1.0,0.0,0.0,   1.0,1.0,0.0,    1.0,1.0,1.0,

            // Left face
            0.0,0.0,0.0,   0.0,1.0,1.0,    0.0,0.0,1.0,
            0.0,0.0,0.0,   0.0,1.0,0.0,    0.0,1.0,1.0
        ]);

        this.cubeVerts = [
            // Front of the cube
            0.0,0.0,0.0,   1.0,1.0,0.0,    1.0,0.0,0.0,
            0.0,0.0,0.0,   0.0,1.0,0.0,    1.0,1.0,0.0,

            // Top of the cube
            0.0,1.0,0.0,   1.0,1.0,1.0,    1.0,1.0,0.0,
            0.0,1.0,0.0,   0.0,1.0,1.0,    1.0,1.0,1.0,

            // Bottom of the cube
            0.0,0.0,0.0,   1.0,0.0,1.0,    1.0,0.0,0.0,
            0.0,0.0,0.0,   0.0,0.0,1.0,    1.0,0.0,1.0,

            // Back of the cube
            0.0,0.0,1.0,   1.0,1.0,1.0,    1.0,0.0,1.0,
            0.0,0.0,1.0,   0.0,1.0,1.0,    1.0,1.0,1.0,

            // Right face
            1.0,0.0,0.0,   1.0,1.0,1.0,    1.0,0.0,1.0,
            1.0,0.0,0.0,   1.0,1.0,0.0,    1.0,1.0,1.0,

            // Left face
            0.0,0.0,0.0,   0.0,1.0,1.0,    0.0,0.0,1.0,
            0.0,0.0,0.0,   0.0,1.0,0.0,    0.0,1.0,1.0
        ];

        this.uvVerts = [
            // Front of the cube
            0.0,0.0,    1.0,1.0,    1.0,0.0,
            0.0,0.0,    0.0,1.0,    1.0,1.0,

            // Top of the cube
            0.0,0.0,    1.0,1.0,    1.0,0.0,
            0.0,0.0,    0.0,1.0,    1.0,1.0,

            // Bottom of the cube
            0.0,0.0,    1.0,1.0,    1.0,0.0,
            0.0,0.0,    0.0,1.0,    1.0,1.0,

            // Back of the cube
            0.0,0.0,    1.0,1.0,    1.0,0.0,
            0.0,0.0,    0.0,1.0,    1.0,1.0,

            // Right face
            0.0,0.0,    1.0,1.0,    1.0,0.0,
            0.0,0.0,    0.0,1.0,    1.0,1.0,

            // Left face
            0.0,0.0,    1.0,1.0,    1.0,0.0,
            0.0,0.0,    0.0,1.0,    1.0,1.0
        ];

        this.normalVerts = [
            // Front
            0.0,0.0,-1.0,   0.0,0.0,-1.0,   0.0,0.0,-1.0,
            0.0,0.0,-1.0,   0.0,0.0,-1.0,   0.0,0.0,-1.0,

            // Top
            0.0,1.0,0.0,    0.0,1.0,0.0,    0.0,1.0,0.0,
            0.0,1.0,0.0,    0.0,1.0,0.0,    0.0,1.0,0.0,

            // Bottom
            0.0,-1.0,0.0,   0.0,-1.0,0.0,   0.0,-1.0,0.0,
            0.0,-1.0,0.0,   0.0,-1.0,0.0,   0.0,-1.0,0.0,

            // Back
            0.0,0.0,1.0,    0.0,0.0,1.0,    0.0,0.0,1.0,
            0.0,0.0,1.0,    0.0,0.0,1.0,    0.0,0.0,1.0,

            // Right
            1.0,0.0,0.0,   1.0,0.0,0.0,   1.0,0.0,0.0,
            1.0,0.0,0.0,   1.0,0.0,0.0,   1.0,0.0,0.0,

            // Left
            -1.0,0.0,0.0,    -1.0,0.0,0.0,    -1.0,0.0,0.0,
            -1.0,0.0,0.0,    -1.0,0.0,0.0,    -1.0,0.0,0.0
        ];

        this.vertexBuffer = null;
        this.uvBuffer = null;
        this.normalBuffer = null;
    }

    render() {
        // if(this.vertexBuffer === null) {
        //     this.vertexBuffer = gl.createBuffer();
        //     if(!this.vertexBuffer) {
        //         console.log("Failed to create the vertexBuffer object");
        //         return -1;
        //     }
        // }

        // if(this.uvBuffer === null) {
        //     this.uvBuffer = gl.createBuffer();
        //     if(!this.uvBuffer) {
        //         console.log("Failed to create the uvBuffer object");
        //         return -1;
        //     }
        // }

        // if(this.normalBuffer === null) {
        //     this.normalBuffer = gl.createBuffer();
        //     if(!this.normalBuffer) {
        //         console.log("Failed to create the normalBuffer object");
        //         return -1;
        //     }
        // }

        var rgba = this.color;

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum[0]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
    
        // Front of the cube
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        drawTriangle3DUVNormal1( [0.0,0.0,0.0,   1.0,1.0,0.0,    1.0,0.0,0.0], [0.0,0.0,    1.0,1.0,    1.0,0.0], [0,0,-1,  0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal1( [0.0,0.0,0.0,   0.0,1.0,0.0,    1.0,1.0,0.0], [0.0,0.0,    0.0,1.0,    1.0,1.0], [0,0,-1,  0,0,-1, 0,0,-1]);

        // Top of the cube
        gl.uniform4f(u_FragColor, rgba[0] * 0.85, rgba[1] * 0.85, rgba[2] * 0.85, rgba[3]);
        drawTriangle3DUVNormal1( [0.0,1.0,0.0,   1.0,1.0,1.0,    1.0,1.0,0.0], [0.0,0.0,    1.0,1.0,    1.0,0.0], [0,1,0,    0,1,0,  0,1,0]);
        drawTriangle3DUVNormal1( [0.0,1.0,0.0,   0.0,1.0,1.0,    1.0,1.0,1.0], [0.0,0.0,    0.0,1.0,    1.0,1.0], [0,1,0,    0,1,0,  0,1,0]);

        // Bottom of the cube
        gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
        drawTriangle3DUVNormal1( [0.0,0.0,0.0,   1.0,0.0,1.0,    1.0,0.0,0.0], [0.0,0.0,    1.0,1.0,    1.0,0.0], [0,-1,0,   0,-1,0, 0,-1,0]);
        drawTriangle3DUVNormal1( [0.0,0.0,0.0,   0.0,0.0,1.0,    1.0,0.0,1.0], [0.0,0.0,    0.0,1.0,    1.0,1.0], [0,-1,0,   0,-1,0, 0,-1,0]);

        // Back of the cube
        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
        drawTriangle3DUVNormal1( [0.0,0.0,1.0,   1.0,1.0,1.0,    1.0,0.0,1.0], [0.0,0.0,    1.0,1.0,    1.0,0.0], [0,0,1,    0,0,1,  0,0,1]);
        drawTriangle3DUVNormal1( [0.0,0.0,1.0,   0.0,1.0,1.0,    1.0,1.0,1.0], [0.0,0.0,    0.0,1.0,    1.0,1.0], [0,0,1,    0,0,1,  0,0,1]);

        // Right face
        gl.uniform4f(u_FragColor, rgba[0] * 0.75, rgba[1] * 0.75, rgba[2] * 0.75, rgba[3]);
        drawTriangle3DUVNormal1( [1.0,0.0,0.0,   1.0,1.0,1.0,    1.0,0.0,1.0], [0.0,0.0,    1.0,1.0,    1.0,0.0], [1,0,0,    1,0,0,  1,0,0])
        drawTriangle3DUVNormal1( [1.0,0.0,0.0,   1.0,1.0,0.0,    1.0,1.0,1.0], [0.0,0.0,    0.0,1.0,    1.0,1.0], [1,0,0,    1,0,0,  1,0,0]);

        // Left face
        drawTriangle3DUVNormal1( [0.0,0.0,0.0,   0.0,1.0,1.0,    0.0,0.0,1.0], [0.0,0.0,    1.0,1.0,    1.0,0.0], [-1,0,0,   -1,0,0, -1,0,0]);
        drawTriangle3DUVNormal1( [0.0,0.0,0.0,   0.0,1.0,0.0,    0.0,1.0,1.0], [0.0,0.0,    0.0,1.0,    1.0,1.0], [-1,0,0,   -1,0,0, -1,0,0]);
    }

    renderFast() {
        if(this.vertexBuffer === null) {
            this.vertexBuffer = gl.createBuffer();
            if(!this.vertexBuffer) {
                console.log("Failed to create the vertexBuffer object");
                return -1;
            }
        }

        if(this.uvBuffer === null) {
            this.uvBuffer = gl.createBuffer();
            if(!this.uvBuffer) {
                console.log("Failed to create the uvBuffer object");
                return -1;
            }
        }

        if(this.normalBuffer === null) {
            this.normalBuffer = gl.createBuffer();
            if(!this.normalBuffer) {
                console.log("Failed to create the normalBuffer object");
                return -1;
            }
        }
        
        var rgba = this.color;

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum[0]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
    
        // Front of the cube
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
 
        // drawTriangle3DUV(this.cubeVerts32, this.vertexBuffer, this.uvVerts, this.uvBuffer);
        drawTriangle3DUVNormal(this.cubeVerts32, this.vertexBuffer, this.uvVerts, this.uvBuffer, this.normalVerts, this.normalBuffer);
    }

    renderSky() {
        if(this.vertexBuffer === null) {
            this.vertexBuffer = gl.createBuffer();
            if(!this.vertexBuffer) {
                console.log("Failed to create the vertexBuffer object");
                return -1;
            }
        }

        if(this.uvBuffer === null) {
            this.uvBuffer = gl.createBuffer();
            if(!this.uvBuffer) {
                console.log("Failed to create the uvBuffer object");
                return -1;
            }
        }
        var rgba = this.color;

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum[0]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
    
        // Front of the cube
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        drawTriangle3DUV( [0.0,0.0,0.0,   1.0,1.0,0.0,    1.0,0.0,0.0], this.vertexBuffer, [0.0,0.0,    1.0,1.0,    1.0,0.0], this.uvBuffer);
        drawTriangle3DUV( [0.0,0.0,0.0,   0.0,1.0,0.0,    1.0,1.0,0.0], this.vertexBuffer, [0.0,0.0,    0.0,1.0,    1.0,1.0], this.uvBuffer);

        // Back of the cube
        drawTriangle3DUV( [0.0,0.0,1.0,   1.0,1.0,1.0,    1.0,0.0,1.0], this.vertexBuffer, [0.0,0.0,    1.0,1.0,    1.0,0.0], this.uvBuffer);
        drawTriangle3DUV( [0.0,0.0,1.0,   0.0,1.0,1.0,    1.0,1.0,1.0], this.vertexBuffer, [0.0,0.0,    0.0,1.0,    1.0,1.0], this.uvBuffer);

        // Right face
        drawTriangle3DUV( [1.0,0.0,0.0,   1.0,1.0,1.0,    1.0,0.0,1.0], this.vertexBuffer, [0.0,0.0,    1.0,1.0,    1.0,0.0], this.uvBuffer);
        drawTriangle3DUV( [1.0,0.0,0.0,   1.0,1.0,0.0,    1.0,1.0,1.0], this.vertexBuffer, [0.0,0.0,    0.0,1.0,    1.0,1.0], this.uvBuffer);

        // Left face
        drawTriangle3DUV( [0.0,0.0,0.0,   0.0,1.0,1.0,    0.0,0.0,1.0], this.vertexBuffer, [0.0,0.0,    1.0,1.0,    1.0,0.0], this.uvBuffer);
        drawTriangle3DUV( [0.0,0.0,0.0,   0.0,1.0,0.0,    0.0,1.0,1.0], this.vertexBuffer, [0.0,0.0,    0.0,1.0,    1.0,1.0], this.uvBuffer);

        gl.uniform1i(u_whichTexture, this.textureNum[1]);
        // Top of the cube
        drawTriangle3D( [0.0,1.0,0.0,   1.0,1.0,1.0,    1.0,1.0,0.0], this.vertexBuffer);
        drawTriangle3D( [0.0,1.0,0.0,   0.0,1.0,1.0,    1.0,1.0,1.0], this.vertexBuffer);

        // Bottom of the cube
        rgba = [0.81, 0.84, 0.92, 1.0];
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        drawTriangle3D( [0.0,0.0,0.0,   1.0,0.0,1.0,    1.0,0.0,0.0], this.vertexBuffer);
        drawTriangle3D( [0.0,0.0,0.0,   0.0,0.0,1.0,    1.0,0.0,1.0], this.vertexBuffer);
    }

    // drawCube() {
    //     var rgba = this.color;
        
    //     // Pass the color of a point to u_FragColor variable
    //     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    //     // Pass the matrix to u_ModelMatrix attribute
    //     // gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
    //     // Front of cube
    //     drawTriangle3D( [0.0,0.0,0.0,   1.0,1.0,0.0,    1.0,0.0,0.0]);
    //     drawTriangle3D( [0.0,0.0,0.0,   0.0,1.0,0.0,    1.0,1.0,0.0]);
    // }

    drawCube(matrix, color) {
        if(this.vertexBuffer === null) {
            this.vertexBuffer = gl.createBuffer();
            if(!this.vertexBuffer) {
                console.log("Failed to create the vertexBuffer object");
                return -1;
            }
        }

        // if(this.uvBuffer === null) {
        //     this.uvBuffer = gl.createBuffer();
        //     if(!this.uvBuffer) {
        //         console.log("Failed to create the uvBuffer object");
        //         return -1;
        //     }
        // }
        var rgba = color;

        gl.uniform1i(u_whichTexture, this.textureNum[0]);
        
        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        drawTriangle3D(this.cubeVerts32, this.vertexBuffer);
    
        // // Front of the cube
        // drawTriangle3D( [0.0,0.0,0.0,   1.0,1.0,0.0,    1.0,0.0,0.0], this.vertexBuffer);
        // drawTriangle3D( [0.0,0.0,0.0,   0.0,1.0,0.0,    1.0,1.0,0.0], this.vertexBuffer);

        // // Top of the cube
        // gl.uniform4f(u_FragColor, rgba[0] * 0.85, rgba[1] * 0.85, rgba[2] * 0.85, rgba[3]);
        // drawTriangle3D( [0.0,1.0,0.0,   0.0,1.0,1.0,    1.0,1.0,1.0], this.vertexBuffer);
        // drawTriangle3D( [0.0,1.0,0.0,   1.0,1.0,1.0,    1.0,1.0,0.0], this.vertexBuffer);

        // // Bottom of the cube
        // gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
        // drawTriangle3D( [0.0,0.0,0.0,   1.0,0.0,1.0,    1.0,0.0,0.0], this.vertexBuffer);
        // drawTriangle3D( [0.0,0.0,0.0,   0.0,0.0,1.0,    1.0,0.0,1.0], this.vertexBuffer);

        // // Back of the cube
        // gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
        // drawTriangle3D( [0.0,0.0,1.0,   1.0,1.0,1.0,    1.0,0.0,1.0], this.vertexBuffer);
        // drawTriangle3D( [0.0,0.0,1.0,   0.0,1.0,1.0,    1.0,1.0,1.0], this.vertexBuffer);

        // // Right face
        // gl.uniform4f(u_FragColor, rgba[0] * 0.75, rgba[1] * 0.75, rgba[2] * 0.75, rgba[3]);
        // drawTriangle3D( [1.0,0.0,0.0,   1.0,1.0,1.0,    1.0,0.0,1.0], this.vertexBuffer);
        // drawTriangle3D( [1.0,0.0,0.0,   1.0,1.0,0.0,    1.0,1.0,1.0], this.vertexBuffer);

        // // Left face
        // drawTriangle3D( [0.0,0.0,0.0,   0.0,1.0,1.0,    0.0,0.0,1.0], this.vertexBuffer);
        // drawTriangle3D( [0.0,0.0,0.0,   0.0,1.0,0.0,    0.0,1.0,1.0], this.vertexBuffer);
    }
}