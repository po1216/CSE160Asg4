// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;

  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_GlobalRotation;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotation * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;

  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform vec4 u_FragColor;
  uniform bool u_lightOn;
  uniform vec3 u_lightColor;
  uniform vec3 u_ambientColor;

  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;

  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    } else if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    } else if (u_whichTexture == 4) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);
    } else if (u_whichTexture == 5) {
      gl_FragColor = texture2D(u_Sampler5, v_UV);
    } else {
      gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
    }
      
    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);
    
    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    // Reflection
    vec3 R = reflect(-L, N);

    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    // Specular
    float specular = pow(max(dot(E,R), 0.0), 10.0);

    vec3 diffuse = vec3(gl_FragColor) * nDotL * u_lightColor * 0.7;
    vec3 ambient = vec3(gl_FragColor) * u_ambientColor * 0.3;

    if(u_lightOn) {
      if(u_whichTexture == 5) {
        gl_FragColor = vec4(specular + diffuse + ambient, 1.0);
      } else {
        gl_FragColor = vec4(diffuse + ambient, 1.0);
      }
    }   
  }`

// Global Variables
let canvas;
let gl;
let a_position;
let a_UV;
let a_Normal;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotation;
let u_whichTexture;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_NormalMatrix;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_lightColor;
let u_ambientColor;
let camera;

let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;

function setUpWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Enable depth test
  gl.enable(gl.DEPTH_TEST);
  //gl.enable(gl.CULL_FACE);
  //gl.cullFace(gl.BACK);
}

function connectVarsToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV =  gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of a_Normal
  a_Normal =  gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotation
  u_GlobalRotation = gl.getUniformLocation(gl.program, 'u_GlobalRotation');
  if (!u_GlobalRotation) {
    console.log('Failed to get the storage location of u_GlobalRotation');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log('Failed to get the storage location of u_lightColor');
    return;
  }

  u_ambientColor = gl.getUniformLocation(gl.program, 'u_ambientColor');
  if (!u_ambientColor) {
    console.log('Failed to get the storage location of u_ambientColor');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  // Get the storage location of u_Sampler2
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  // Get the storage location of u_Sampler3
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get the storage location of u_Sampler3');
    return false;
  }

  // Get the storage location of u_Sampler4
  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get the storage location of u_Sampler4');
    return false;
  }

  // Get the storage location of u_Sampler5
  u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
  if (!u_Sampler5) {
    console.log('Failed to get the storage location of u_Sampler5');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of whichTexture');
    return false;
  }

  // Set an initial value for this matrix to identity
  let identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

  camera = new Camera();
  //camera.eye = [0, 0, 3];
  //camera.at = [0, 0, -100];
  //camera.up = [0, 1, 0];
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const LINE = 3;

// Global variables related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10.0;
let g_selectedType = POINT;
let g_selectedSeg = 10;
let g_selectedLength = 30;
let g_animalGlobalRotationX = 50;
let g_animalGlobalRotationY = 0;
let g_breathingAnimation = true;
let g_walkingAnimation = g_tailAnimation = false;
let g_rightArmAnimation = g_leftArmAnimation = g_rightLegAnimation = g_leftLegAnimation = false;
let g_rightArm1Angle = g_leftArm1Angle = 180;
let g_rightArm2Angle = g_leftArm2Angle = 10;
let g_rightFFeetAngle = g_leftFFeetAngle = g_rightFeetAngle = g_leftFeetAngle = 60;
let g_rightLegAngle = g_leftLegAngle = 160; 
let g_bodyPos = 0;
let g_headPos = 0;
let g_tailAngle = 0;
let g_normalOn = false;
let g_lightAnimation = true;
let g_lightOn = true;
let g_lightPos = [0, 1, 0.4];
let g_lightColor = [1.0, 1.0, 1.0];
let g_ambientColor = [1.0, 1.0, 1.0];
let colorChange;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI() {
  // FOV slider event
  document.getElementById('fovSlide').addEventListener('mousemove', function() { 
    camera.projMat.setPerspective(this.value, canvas.width/canvas.height, 0.1, 100);
  });

  // Shift + click event
  document.getElementById('webgl').addEventListener('click', function (ev) {
    if(ev.shiftKey) {
      g_tailAnimation = !g_tailAnimation;
    }
  });

  // Button events
  document.getElementById('normalOn').onclick = function() {g_normalOn = true;};
  document.getElementById('normalOff').onclick = function() {g_normalOn = false;};
  document.getElementById('lightOn').onclick = function() {g_lightOn = true;};
  document.getElementById('lightOff').onclick = function() {g_lightOn = false;};
  document.getElementById('lightAniOn').onclick = function() {g_lightAnimation = true;};
  document.getElementById('lightAniOff').onclick = function() {g_lightAnimation = false;};

  document.getElementById("diffuseColor").addEventListener("change", watchColorPicker, false);
  function watchColorPicker(event) {
    g_lightColor = hexToRGB(event.target.value);
  }
  document.getElementById("ambientColor").addEventListener("change", watchColorPicker1, false);
  function watchColorPicker1(event) {
    g_ambientColor = hexToRGB(event.target.value);
  }

  // Light slider events
  document.getElementById('lightSlideX').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) { g_lightPos[0] = this.value/100; renderScene(); } });
  document.getElementById('lightSlideY').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) { g_lightPos[1] = this.value/100; renderScene(); } });
  document.getElementById('lightSlideZ').addEventListener('mousemove', function(ev) { if(ev.buttons == 1) { g_lightPos[2] = this.value/100; renderScene(); } });
}

function hexToRGB(hex) {
  return [('0x' + hex[1] + hex[2] | 0)/255, ('0x' + hex[3] + hex[4] | 0)/255, ('0x' + hex[5] + hex[6] | 0)/255];
}

function initTextures() {
  // Create the image object
  let image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }

  image.onload = function() { loadTexture0(image); }
  image.src = 'textures/sky.jpg';

  let image1 = new Image();
  if (!image1) {
    console.log('Failed to create the image1 object');
    return false;
  }
  image1.onload = function() { loadTexture1(image1); }
  image1.src = 'textures/brickwall.jpg';

  let image2 = new Image();
  if (!image2) {
    console.log('Failed to create the image2 object');
    return false;
  }
  image2.onload = function() { loadTexture2(image2); }
  image2.src = 'textures/grassTop.jpg';

  let image3 = new Image();
  if (!image3) {
    console.log('Failed to create the image3 object');
    return false;
  }
  image3.onload = function() { loadTexture3(image3); }
  image3.src = 'textures/wood.jpg';

  let image4 = new Image();
  if (!image4) {
    console.log('Failed to create the image4 object');
    return false;
  }
  image4.onload = function() { loadTexture4(image4); }
  image4.src = 'textures/leaves.jpg';

  let image5 = new Image();
  if (!image5) {
    console.log('Failed to create the image5 object');
    return false;
  }
  image5.onload = function() { loadTexture5(image5); }
  image5.src = 'textures/ball.png';

  return true;
}

function loadTexture0(image) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Flip the image's y axis
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  console.log('finished loadTexture0');
}

function loadTexture1(image) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler1, 1);

  console.log('finished loadTexture1');
}

function loadTexture2(image) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler2, 2);

  console.log('finished loadTexture2');
}

function loadTexture3(image) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler3, 3);

  console.log('finished loadTexture3');
}

function loadTexture4(image) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler4, 4);

  console.log('finished loadTexture4');
}

function loadTexture5(image) {
  // Create a texture object
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE5);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler5, 5);

  console.log('finished loadTexture4');
}

let coordinates = [0,0];
let mouseCoord = new Vector3();
let deltaX;
let deltaY;

function main() {
  // Set up canvas and gl variables
  setUpWebGL();

  // Set up GLSL shader programs and connect GLSL variables
  connectVarsToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHtmlUI();

  document.onkeydown = keydown;

  canvas.addEventListener("click", async () => {
    if(!document.pointerLockElement) {
      await canvas.requestPointerLock({
        unadjustedMovement: true,
      });
    }
  })

  document.addEventListener("pointerlockchange", function(ev) {
    console.log("The pointer lock is now locked");
    document.addEventListener("mousemove", updateDeltaX, false);
  })
  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = rotateCamera;

  canvas.addEventListener("wheel", function(ev) {
    if (ev.deltaY  < 0) {
      camera.zoomIn();
    } else {
      camera.zoomOut();
    }
    document.getElementById('fovSlide').value = camera.getFOV();
  })

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.5, 0.75, 0.46, 1.0);

  requestAnimationFrame(tick);

}

function updateDeltaX(ev) {
  deltaX = ev.movementX;
  deltaY = ev.movementY;
  mousePan(ev);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

// Called by the browser repeatedly whenever its time
function tick() {
  // Save the current time
  g_seconds = performance.now()/1000.0 - g_startTime;
  
  // Update animation angles
  updateAnimationAngles()

  // Draw everything
  renderScene();

  // Tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function click(ev) {
  // Extract the event click and return it in WebGL coordinates
  let [x,y] = convertCoordinatesEventToGL(ev);

  // Create and store the new point
  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
    point.segments = g_selectedSeg;
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  // Draw every shape that is supposed to be in the canvas
  renderScene();
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}

// Update the angles of everything if currently animated
function updateAnimationAngles() {
  if(g_breathingAnimation) {
    g_bodyPos = g_headPos = (0.016 * Math.sin(1.5 * g_seconds));
  }

  if(g_walkingAnimation) {
    g_rightArm1Angle = (45 * Math.sin(2 * g_seconds) + 170);
    g_leftArm1Angle = (45 * Math.sin(2 * g_seconds + 10) + 170);
    g_rightLegAngle = (30 * Math.sin(2 * g_seconds + 10) - 200);
    g_leftLegAngle = (30 * Math.sin(2 * g_seconds) - 200);
  }

  if(g_rightArmAnimation) {
    g_rightArm1Angle = (45 * Math.sin(g_seconds) + 170);
  }

  if(g_leftArmAnimation) {
    g_leftArm1Angle = (45 * Math.sin(g_seconds + 10) + 170);
  }

  if(g_rightLegAnimation) {
    g_rightLegAngle = (30 * Math.sin(g_seconds + 10) - 200);
  }

  if(g_leftLegAnimation) {
    g_leftLegAngle = (30 * Math.sin(g_seconds) - 200);
  }

  if(g_tailAnimation) {
    g_tailAngle = (20 * Math.sin(8 * g_seconds));
    g_headPos = (0.014 * Math.sin(5 * g_seconds));
  } else {
    g_tailAngle = 0;
    if(g_breathingAnimation) {
      g_headPos = (0.016 * Math.sin(1.5 * g_seconds));
    } else {
      g_headPos = 0;
    }
  }

  if(g_lightAnimation) {
    let light_X = Math.cos(g_seconds);
  // console.log(light_X);
    g_lightPos[0] = light_X;
    document.getElementById("lightSlideX").value = light_X * 100;
  }
}

function keydown(ev) {
  if(ev.keyCode == 38 || ev.keyCode == 87) { // Up arrow or W
    camera.moveForward();
    // camera.lookUp(10);
  } else if (ev.keyCode == 40 || ev.keyCode == 83) { // Down arrow or S
    camera.moveBackwards();
  } else if (ev.keyCode == 37 || ev.keyCode == 65) { // Left arrow or A
    camera.moveLeft();
  } else if (ev.keyCode == 39 || ev.keyCode == 68) { // Right arrow or D
    camera.moveRight();
  } else if (ev.keyCode == 81) { // Q
    camera.panLeft(10);
  } else if (ev.keyCode == 69) { // E
    camera.panRight(10);
  } else if (ev.keyCode == 32) { // Space
    camera.moveUp();
  } else if (ev.keyCode == 17 && camera.eye.elements[1] > 0) { // Left control
    camera.moveDown();
  } else if (ev.keyCode == 90) { // Z
    camera.lookUp(10);
  } else if (ev.keyCode == 88) { // X
    camera.lookDown(10);
  }

  renderScene();
  //console.log(ev.keyCode);
}

function mousePan(ev) {
  if(deltaX < 0) {
    camera.panLeft((deltaX/10) * -5);
  } else {
    camera.panRight((deltaX/10) * 5);
  }
}

var g_house = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 0, 1, 1, 1],
];

function drawMap() {
  for(x = 0;  x < 12; x++) {
    for(y = 0; y < 18; y++) {
      //if (g_map[x][y] == 2) {
      //if (x < 1 || x == 31 || y == 0 || y == 31) {
      var ground = new Cube();
      ground.textureNum = [2, 2];
      if (g_normalOn) ground.textureNum = [-3, -3];
      ground.matrix.translate(y - 8, -1.55, x - 7);
      ground.normalMatrix.setInverseOf(ground.matrix).transpose();
      ground.renderFast();
      //}
      //} else if (g_map[x][y] == -2) {
        // var ground = new Cube();
        // ground.color = [0.73, 0.86, 0.91, 1.0];
        // ground.textureNum = [-2, -2];
        // ground.matrix.translate(y - 10, -1.55, x - 15);
        // ground.renderFast();
      }
    }
}

function drawHouse() {
  let height = 0;
  let yBound = 8;
  let roofX = 2;
  for(i = 0; i < 3; i++) {
    for(x = 0; x < 6; x++) {
      for(y = 0; y < 8; y++) {
        if(g_house[x][y] != 0) {
          var wall = new Cube();
          // if(g_house[x][y] == -2) {
          //   wall.color = [0.3, 0.15, 0.15, 1.0];
          // }
          wall.textureNum = [(g_house[x][y]), (g_house[x][y])];
          if(g_normalOn) wall.textureNum = [-3, -3];
          wall.matrix.translate(y + 2, -0.75 + height, x - 6);
          wall.renderFast();
        }
      }
    }
    height += 1;
  }
  for(i = 0; i < 2; i++) {
    for(x = 0; x < 6; x++) {
      for(y = 0; y < 8; y++) {
        if(x == 0 || x == 5) {
          var wall = new Cube();
          wall.textureNum = [1, 1];
          if(g_normalOn) wall.textureNum = [-3, -3];
          wall.matrix.translate(y + 2, -0.75 + height, x - 6);
          wall.renderFast();
        } else {
          if(y == 0 || y == 7) {
            var wall = new Cube();
            wall.textureNum = [1, 1];
            if(g_normalOn) wall.textureNum = [-3, -3];
            wall.matrix.translate(y + 2, -0.75 + height, x - 6);
            wall.renderFast();
          }
        }
      }
    }
  }
  height += 1;
  // Roof
  for(i = 0; i < 4; i++) {
    for(x = 0; x < 6; x++) {
      for(y = 0; y < yBound; y++) {
        var wall = new Cube();
        wall.color = [0.23, 0.25, 0.32, 1.0];
        wall.textureNum = [-2, -2];
        if(g_normalOn) wall.textureNum = [-3, -3];
        wall.matrix.translate(y + roofX, -0.75 + height, x - 6);
        wall.matrix.scale(1.0, 0.5, 1.0);
        wall.renderFast();
      }
    }
    height += 0.5;
    yBound -= 2;
    roofX += 1;
  }
  //Fence
  for(i = 0; i < 3; i++) {
    for(x = 0; x < 11; x++) {
      for(y = 0; y < 17; y++) {
        if(i == 1) {
          if(x == 0) {
            if(y % 2 == 0) {
              var wall = new Cube();
              wall.textureNum = [3, 3];
              if(g_normalOn) wall.textureNum = [-3, -3];
              wall.matrix.translate(y - 7, -0.75 + i, x - 7);
              //console.log(wall.normalMatrix);
              wall.normalMatrix.setInverseOf(wall.matrix).transpose();
              wall.renderFast();
            }
          } else {
            if (y == 0) {
              if(x % 2 == 0) {
                var wall = new Cube();
                wall.textureNum = [3, 3];
                if(g_normalOn) wall.textureNum = [-3, -3];
                wall.matrix.translate(y - 7, -0.75 + i, x - 7);
                wall.renderFast();
              }
            }
          }
        } else {
          if(x == 0) {
            var wall = new Cube();
            wall.textureNum = [3, 3];
            if(g_normalOn) wall.textureNum = [-3, -3];
            wall.matrix.translate(y - 7, -0.75 + i, x - 7);
            wall.renderFast();
          } else {
            if (y == 0) {
              var wall = new Cube();
              wall.textureNum = [3, 3];
              if(g_normalOn) wall.textureNum = [-3, -3];
              wall.matrix.translate(y - 7, -0.75 + i, x - 7);
              wall.renderFast();
            }
          }
        }
      }
    }
  }
}

// Draw every shape that is supposed to be in the canvas
function renderScene() {
  // Check the time at the start of this function
  var startTime = performance.now();

  // Pass the projection matrix
  let projMat = camera.projMat;

  //projMat.setPerspective(50, canvas.width/canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  let viewMat = new Matrix4();
  viewMat.setLookAt(
    camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
    camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
    camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Pass the matrix to u_GlobalRotation
  var globalRotMat = new Matrix4().rotate(g_animalGlobalRotationX, 0, 1, 0).rotate(g_animalGlobalRotationY, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotation, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  gl.uniform3f(u_ambientColor, g_ambientColor[0], g_ambientColor[1], g_ambientColor[2]);

  // Pass the light position to GLSL
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  // Pass the camera position to GLSL
  gl.uniform3f(u_cameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);

  gl.uniform1i(u_lightOn, g_lightOn);

  var light = new Cube();
  light.color = [2, 2, 0, 1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-0.1, -0.1, -0.1);
  light.matrix.translate(4, 0.7, -4);
  light.renderFast();

  // Draw the ground plane
  var floor = new Cube();
  floor.color = [0.45, 0.35, 0.24, 1.0];
  //floor.textureNum = [-2, -2];
  floor.matrix.translate(0.0, -1.56, 0.0);
  floor.matrix.scale(20, 0, 14);
  floor.matrix.translate(-0.45, 0.0, -0.55);
  floor.renderFast();

  // Draw the sky
  var sky = new Cube();
  sky.color = [0.41, 0.56, 0.85, 1.0];
  sky.textureNum = [0, -2];
  //sky.matrix.translate(10, 0, 0);
  sky.matrix.scale(70, 70, 70);
  sky.matrix.translate(-0.55, -0.1, -0.55);
  sky.renderSky();

  drawMap();
  drawHouse();

  var cube = new Cube();
  cube.color = [1.0, 0.0, 0.0, 1.0];
  cube.textureNum = [4, 4];
  if(g_normalOn) cube.textureNum = [-3, -3];
  cube.matrix.translate(-1, -0.5, -3.5);
  cube.renderFast();

  const M = new Matrix4();
  M.setTranslate(-1, 0.0, -1);
  M.rotate(-70, 0, 1, 0);
  drawDog(M);

  var sphere = new Sphere();
  sphere.color = [0.78, 0.86, 0.45, 1.0];
  sphere.textureNum = [5, 5];
  if(g_normalOn) sphere.textureNum = [-3, -3];
  sphere.matrix.scale(0.4, 0.4, 0.4);
  sphere.matrix.translate(1, -0.4, -1.7);
  sphere.normalMatrix.setInverseOf(sphere.matrix).transpose();
  sphere.render();

  // M.setTranslate(0, -0.13, 1.8);
  // M.scale(0.7, 0.7, 0.78);
  // M.rotate(100, 0, 1, 0);
  // drawDog(M);

  // M.setTranslate(13.5, -0.13, -4);
  // M.scale(0.7, 0.7, 0.78);
  // M.rotate(-120, 0, 1, 0);
  // drawDog(M);

  M.setTranslate(-3, -0.5, -4);
  drawTree(M);

//   M.setTranslate(12.5, -0.5, -3.5);
//   drawTree(M);

//   M.setTranslate(-5, -0.5, 7.5);
//   drawTree(M);

  // M.setTranslate(6, -0.5, 7.5);
  // drawTree(M);

  // Check the time at the end of the function, and show on the web page
  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "performance");
}

function drawTree(matrix) {
  // const M1 = new Matrix4();

  for(i = 0; i < 2; i++) {
    var trunk = new Cube();
    trunk.color = [0.43, 0.27, 0.23, 1.0];
    if(g_normalOn) trunk.textureNum = [-3, -3];
    trunk.matrix.set(matrix);
    trunk.matrix.translate(0, i, 0);
    trunk.renderFast();
  }
  
  var height = 0;
  var boundX = 3;
  for(i = 0; i < 2; i++) {
    for(x = 0; x < boundX; x++) {
      for(y = 0; y < 3; y++) {
        var leaves = new Cube();
        leaves.textureNum = [4, 4];
        if(g_normalOn) leaves.textureNum = [-3, -3];
        leaves.matrix.set(matrix);
        leaves.matrix.translate(y - 1, 2 + height, x - 1);
        leaves.renderFast();
      }
    }
    height += 1;
    boundX -= 1;
  }

  
}

function drawDog(matrix) {
  const M1 = new Matrix4();

  // Right iris
  var rightIris = new Cube();
  if(g_normalOn) rightIris.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(0.466, 0.32 + g_headPos, 0.13);
  M1.scale(0.07, 0.05, 0.04);
  rightIris.normalMatrix.setInverseOf(M1).transpose();
  rightIris.drawCube(M1, [0.0, 0.0, 0.0, 1.0]);

  // Left iris
  var leftIris = new Cube();
  if(g_normalOn) leftIris.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(0.466, 0.32 + g_headPos, 0.29);
  M1.scale(0.07, 0.05, 0.04);
  leftIris.normalMatrix.setInverseOf(M1).transpose();
  leftIris.drawCube(M1, [0.0, 0.0, 0.0, 1.0]);

  // Right eye
  var rightEye = new Cube();
  if(g_normalOn) rightEye.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(0.465, 0.32 + g_headPos, 0.12); // 0.32
  M1.scale(0.07, 0.07, 0.05);
  rightEye.normalMatrix.setInverseOf(M1).transpose();
  rightEye.drawCube(M1, [1.0, 1.0, 1.0, 1.0]);

  // Left eye
  var leftEye = new Cube();
  if(g_normalOn) leftEye.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(0.465, 0.32 + g_headPos, 0.28); // 0.32
  M1.scale(0.07, 0.07, 0.05);
  leftEye.normalMatrix.setInverseOf(M1).transpose();
  leftEye.drawCube(M1, [1.0, 1.0, 1.0, 1.0]);

  // Forehead band
  var forehead = new Cube();
  if(g_normalOn) forehead.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(0.26, 0.182 + g_headPos, 0.21);
  M1.scale(0.28, 0.29, 0.04);
  forehead.normalMatrix.setInverseOf(M1).transpose();
  forehead.drawCube(M1, [0.9, 0.9, 0.9, 1.0]);

  // Head
  var head = new Cube();
  if(g_normalOn) head.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(0.25, 0.17 + g_headPos, 0.06); // 0.17
  M1.scale(0.28, 0.30, 0.33);
  head.normalMatrix.setInverseOf(M1).transpose();
  head.drawCube(M1, [0.25, 0.25, 0.25, 1.0]);

  // Right ear
  var rightEar = new Cube();
  if(g_normalOn) rightEar.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(0.26, 0.45 + g_headPos, 0.06); // 0.45
  M1.scale(0.15, 0.23, 0.14);
  rightEar.normalMatrix.setInverseOf(M1).transpose();
  rightEar.drawCube(M1, [0.2, 0.2, 0.2, 1.0]);

  // Left ear
  var leftEar = new Cube();
  if(g_normalOn) leftEar.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(0.26, 0.45 + g_headPos, 0.24); // 0.45
  M1.scale(0.15, 0.23, 0.14);
  leftEar.normalMatrix.setInverseOf(M1).transpose();
  leftEar.drawCube(M1, [0.2, 0.2, 0.2, 1.0]);

  // Nose
  var nose = new Cube();
  if(g_normalOn) nose.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(0.63, 0.23 + g_headPos, 0.19); // 0.23
  M1.scale(0.07, 0.07, 0.07);
  nose.normalMatrix.setInverseOf(M1).transpose();
  nose.drawCube(M1, [0.1, 0.1, 0.1, 1.0]);

  // Fang
  var fang = new Cube();
  if(g_normalOn) fang.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(0.45, 0.18 + g_headPos, 0.125); 
  M1.scale(0.2, 0.15, 0.20);
  fang.normalMatrix.setInverseOf(M1).transpose();
  fang.drawCube(M1, [1.0, 1.0, 1.0, 1.0]);

  // Tongue
  var tongue = new Cube();
  if(g_normalOn) tongue.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(0.6, 0.1, 0.17);
  M1.rotate(45, 0, 0, 1);
  M1.scale(0.05, 0.15, 0.1);
  tongue.normalMatrix.setInverseOf(M1).transpose();
  tongue.drawCube(M1, [0.94, 0.60, 0.65, 1.0]);

  // Right shoulder
  var rightShoulder = new Cube();
  if(g_normalOn) rightShoulder.textureNum = [-3, -3];
  M1.set(matrix);
  M1.rotate(7, 0, 0, 1);
  M1.translate(0, g_bodyPos - 0.2, 0.04);
  M1.scale(0.3, 0.4, 0.18);
  rightShoulder.normalMatrix.setInverseOf(M1).transpose();
  rightShoulder.drawCube(M1, [1.0, 1.0, 1.0, 1.0]);

  // Left shoulder
  var leftShoulder = new Cube();
  if(g_normalOn) leftShoulder.textureNum = [-3, -3];
  M1.set(matrix);
  M1.rotate(7, 0, 0, 1);
  M1.translate(0, g_bodyPos - 0.2, 0.23);
  M1.scale(0.3, 0.4, 0.18);
  leftShoulder.normalMatrix.setInverseOf(M1).transpose();
  leftShoulder.drawCube(M1, [1.0, 1.0, 1.0, 1.0]);

  // Neck
  var neck = new Cube();
  if(g_normalOn) neck.textureNum = [-3, -3];
  M1.set(matrix);
  M1.rotate(-5, 0, 0, 1);
  M1.translate(0.2, 0.22 + g_bodyPos, 0.07);
  M1.scale(0.2, 0.2, 0.3);
  neck.normalMatrix.setInverseOf(M1).transpose();
  neck.drawCube(M1, [0.25, 0.25, 0.25, 1.0]);

  // Right arm1
  var rightArm1 = new Cube();
  if(g_normalOn) rightArm1.textureNum = [-3, -3];
  M1.set(matrix);
  rightArm1.normalMatrix.setInverseOf(M1).transpose();
  M1.translate(0.14, -0.33, 0.05);
  //M1.translate(0.25, -0.07, 0.06);
  //M1.rotate(30, 0, 0, 1);
  // var rightArm1Coordinates = new Matrix4(M1);
  M1.scale(0.12, 0.30, 0.13);
  rightArm1.drawCube(M1, [0.98, 0.98, 0.98, 1.0]);

  // Right arm2
  var rightArm2 = new Cube();
  if(g_normalOn) rightArm2.textureNum = [-3, -3];
  M1.set(matrix);
  // rightArm2.matrix = rightArm1.matrix;
  // M1.translate(0.01, 0, 0);
  // M1 = rightArm1Coordinates;
  M1.translate(0.17, -0.5, 0.06);
  M1.rotate(g_rightArm2Angle, 0, 0, 1);
  //var rightArm2Coordinates = new Matrix4(rightArm2.matrix);
  M1.scale(0.12, 0.17, 0.12);
  rightArm2.normalMatrix.setInverseOf(M1).transpose();
  rightArm2.drawCube(M1, [0.98, 0.98, 0.98, 1.0]);

  // Right front feet
  var rightFrontFeet = new Cube();
  if(g_normalOn) rightFrontFeet.textureNum = [-3, -3];
  M1.set(matrix);
  // rightFrontFeet.matrix = rightArm2Coordinates;
  //rightFrontFeet.matrix.translate(0.1, 0, 0);
  M1.translate(0.3, -0.55, 0.06);
  M1.rotate(g_rightFFeetAngle, 0, 0, 1);
  M1.scale(0.06, 0.13, 0.10);
  rightFrontFeet.normalMatrix.setInverseOf(M1).transpose();
  rightFrontFeet.drawCube(M1, [0.98, 0.98, 0.98, 1.0]);

  // Left arm1
  var leftArm1 = new Cube();
  if(g_normalOn) leftArm1.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(0.14, -0.33, 0.25);
  //M1.translate(0.25, -0.07, 0.26);
  //M1.rotate(g_leftArm1Angle, 0, 0, 1);
  // var leftArm1Coordinates = new Matrix4(leftArm1.matrix);
  M1.scale(0.12, 0.30, 0.13);
  leftArm1.normalMatrix.setInverseOf(M1).transpose();
  leftArm1.drawCube(M1, [0.98, 0.98, 0.98, 1.0]);

  // Left arm2
  var leftArm2 = new Cube();
  if(g_normalOn) leftArm2.textureNum = [-3, -3];
  M1.set(matrix);
  // M1.setTranslate(0.01, 0, 0);
  // M1 = leftArm1Coordinates;
  M1.translate(0.17, -0.5, 0.26);
  M1.rotate(g_leftArm2Angle, 0, 0, 1);
  // var leftArm2Coordinates = new Matrix4(M1);
  M1.scale(0.12, 0.17, 0.12);
  leftArm2.normalMatrix.setInverseOf(M1).transpose();
  leftArm2.drawCube(M1, [0.98, 0.98, 0.98, 1.0]);

  // Left front feet
  var leftFrontFeet = new Cube();
  if(g_normalOn) leftFrontFeet.textureNum = [-3, -3];
  M1.set(matrix);
  // M1 = leftArm2Coordinates;
  M1.translate(0.3, -0.55, 0.26);
  M1.rotate(g_leftFFeetAngle, 0, 0, 1);
  M1.scale(0.06, 0.13, 0.10);
  leftFrontFeet.normalMatrix.setInverseOf(M1).transpose();
  leftFrontFeet.drawCube(M1, [0.98, 0.98, 0.98, 1.0]);

  // Right leg1
  var rightLeg1 = new Cube();
  if(g_normalOn) rightLeg1.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(-0.52, -0.33, 0.05);
  //M1.translate(-0.35, -0.07, 0.06);
  //M1.rotate(160, 0, 0, 1);
  // var rightLeg1Coordinates = new Matrix4(M1);
  M1.scale(0.15, 0.30, 0.13);
  rightLeg1.normalMatrix.setInverseOf(M1).transpose();
  rightLeg1.drawCube(M1, [0.98, 0.98, 0.98, 1.0]);

  // Right leg2
  var rightLeg2 = new Cube();
  if(g_normalOn) rightLeg2.textureNum = [-3, -3];
  M1.set(matrix);
  //M1.setTranslate(0.01, 0, 0);
  // M1 = rightLeg1Coordinates;
  M1.translate(-0.45, -0.5, 0.06);
  M1.rotate(25, 0, 0, 1);
  // var rightLeg2Coordinates = new Matrix4(M1);
  M1.scale(0.12, 0.2, 0.12);
  rightLeg2.normalMatrix.setInverseOf(M1).transpose();
  rightLeg2.drawCube(M1, [0.98, 0.98, 0.98, 1.0]);

  // Right back feet
  var rightBackFeet = new Cube();
  if(g_normalOn) rightBackFeet.textureNum = [-3, -3];
  M1.set(matrix);
  // M1 = rightLeg2Coordinates;
  //rightFrontFeet.matrix.translate(0.1, 0, 0);
  M1.translate(-0.3, -0.55, 0.06);
  M1.rotate(g_rightFeetAngle, 0, 0, 1);
  M1.scale(0.08, 0.15, 0.10);
  rightBackFeet.normalMatrix.setInverseOf(M1).transpose();
  rightBackFeet.drawCube(M1, [0.98, 0.98, 0.98, 1.0]);

  // Left leg1
  var leftLeg1 = new Cube();
  if(g_normalOn) leftLeg1.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(-0.52, -0.33, 0.25);
  // M1.translate(-0.35, -0.07, 0.26);
  // M1.rotate(g_leftLegAngle, 0, 0, 1);
  // var leftLeg1Coordinates = new Matrix4(M1);
  M1.scale(0.15, 0.30, 0.13);
  leftLeg1.normalMatrix.setInverseOf(M1).transpose();
  leftLeg1.drawCube(M1, [0.98, 0.98, 0.98, 1.0]);

  // Left leg2
  var leftLeg2 = new Cube();
  if(g_normalOn) leftLeg2.textureNum = [-3, -3];
  M1.set(matrix);
  //M1.setTranslate(0.01, 0, 0);
  // M1 = leftLeg1Coordinates;
  M1.translate(-0.45, -0.5, 0.26);
  M1.rotate(25, 0, 0, 1);
  // var leftLeg2Coordinates = new Matrix4(M1);
  M1.scale(0.12, 0.2, 0.12);
  leftLeg2.normalMatrix.setInverseOf(M1).transpose();
  leftLeg2.drawCube(M1, [0.98, 0.98, 0.98, 1.0]);

  // Left back feet
  var leftBackFeet = new Cube();
  if(g_normalOn) leftBackFeet.textureNum = [-3, -3];
  M1.set(matrix);
  // M1 = leftLeg2Coordinates;
  //rightFrontFeet.matrix.translate(0.1, 0, 0);
  M1.translate(-0.3, -0.55, 0.26);
  M1.rotate(g_leftFeetAngle, 0, 0, 1);
  M1.scale(0.08, 0.15, 0.10);
  leftBackFeet.normalMatrix.setInverseOf(M1).transpose();
  leftBackFeet.drawCube(M1, [0.98, 0.98, 0.98, 1.0]);

  // Spot
  var spot = new Cube();
  if(g_normalOn) spot.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(-0.35, g_bodyPos + 0.01, 0.04);
  M1.scale(0.3, 0.2, 0.35);
  spot.normalMatrix.setInverseOf(M1).transpose();
  spot.drawCube(M1, [0.2, 0.2, 0.2, 1.0]);

  // Body
  var body = new Cube();
  if(g_normalOn) body.textureNum = [-3, -3];
  //body.textureNum = 0;
  M1.set(matrix);
  M1.translate(-0.5, g_bodyPos - 0.2, 0.05);
  M1.scale(0.6, 0.4, 0.35);
  body.normalMatrix.setInverseOf(M1).transpose();
  body.drawCube(M1, [1.0, 1.0, 1.0, 1.0]);

  // Tail
  var tail = new Cube();
  if(g_normalOn) tail.textureNum = [-3, -3];
  M1.set(matrix);
  M1.translate(-0.55, 0.05, 0.15);
  M1.rotate(25, 0, 0, 1);
  M1.rotate(g_tailAngle, 1, 0, 0);
  M1.scale(0.17, 0.4, 0.12);
  tail.normalMatrix.setInverseOf(M1).transpose();
  tail.drawCube(M1, [1.0, 1.0, 1.0, 1.0]);
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML.");
    return;
  }
  htmlElm.innerHTML = text;
}