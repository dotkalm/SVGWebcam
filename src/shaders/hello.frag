#version 300 es
precision mediump float;
in vec2 v_position;
out vec4 fragColor;

void main() {
  // Convert from -1,1 to 0,1 range
  vec2 st = v_position * 0.5 + 0.5;
  
  // Use position to create gradient
  fragColor = vec4(st.x, st.y, 0.5, 1.0);
}