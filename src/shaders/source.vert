#version 300 es
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);

    // Flip X coordinate to fix mirroring
    v_texCoord = vec2(1.0 - a_texCoord.x, a_texCoord.y);
}