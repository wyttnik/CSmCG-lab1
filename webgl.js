var gl;
var vertexPositionAttribute;
var squareVerticesBuffer;
var triangleVerticesBuffer;
var triangleColorsBuffer;
var vertexColorAttribute;

// Shader programs
const vsSource = `
attribute vec3 aVertexPosition;

void main() {
  gl_Position =  vec4 (aVertexPosition, 1.0);
}
`;

const fsSource = `
#ifdef GL_ES 
precision highp float;
#endif 

void main() { 
  gl_FragColor = vec4(0.0,1.0,0.0,1.0);
}`;

const vsTrSource = `
attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
varying vec4 color;

void main(void) {
  gl_Position = vec4 ( aVertexPosition, 1.0 );
  color = aVertexColor;
}
`;

const fsTrSource = `
#ifdef GL_ES 
precision highp float;
#endif 
varying vec4 color;

void main() { 
  gl_FragColor = color;
}`;

main();

function main() {
  var canvas = document.getElementById("glcanvas");
  // Initialize the GL context

    /** @type {WebGLRenderingContext} */
  gl = canvas.getContext("webgl2");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  gl.viewport(0,0,gl.canvas.width,gl.canvas.height);

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.DEPTH_TEST)

  gl.depthFunc(gl.LEQUAL)

  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  gl.useProgram(shaderProgram);
  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
  
  initBuffers();
  drawScene();

  // Triangle now
  canvas = document.getElementById("glcanvasForTriangle");
  gl = canvas.getContext("webgl2");

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.DEPTH_TEST)

  gl.depthFunc(gl.LEQUAL)

  const shaderProgramForTriangle = initShaderProgram(gl, vsTrSource, fsTrSource);
  gl.useProgram(shaderProgramForTriangle);

  vertexPositionAttribute = gl.getAttribLocation(shaderProgramForTriangle, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
  vertexColorAttribute = gl.getAttribLocation(shaderProgramForTriangle, "aVertexColor");
  gl.enableVertexAttribArray(vertexColorAttribute);

  initBuffersTriangle();
  drawSceneTriangle();
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(
      shaderProgram)}`);
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initBuffers() {
  squareVerticesBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer)

  var vertices = [
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0
    ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
}

function drawScene() { 
  gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT); 
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function initBuffersTriangle() {
  triangleVerticesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesBuffer)
  const positions =[[-1,-1],[0,1],[1,-1],].flat()
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  triangleColorsBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorsBuffer)
  const colors = [ [1, 0, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1], ].flat()
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
}

function drawSceneTriangle() { 
  gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT); 
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorsBuffer);
  gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
}