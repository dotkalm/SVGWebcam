#version 300 es
precision mediump float;

in vec2 v_texCoord;
out vec4 fragColor;

uniform sampler2D u_texture;

void main() {
  // Sample the video texture
  fragColor = texture(u_texture, v_texCoord);
}