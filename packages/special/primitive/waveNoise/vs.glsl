in vec3 position3DHigh;
in vec3 position3DLow;
in vec2 st;
in float batchId;
uniform sampler2D noiseTexture;
uniform float time;
uniform float amplitude;
uniform float frequency;

out vec3 v_position;

void main() {
    // 获取噪点图的值
  float noiseValue = texture(noiseTexture, st).r;

    // 计算波浪高度
  float waveHeight = sin(st.s * frequency + time) * amplitude * noiseValue;

    // 修改顶点位置
  vec4 position = czm_computePosition();
  position.z += waveHeight * 1000.0; // 调整高度，单位为米

    // 设置新的顶点位置
  gl_Position = czm_modelViewProjectionRelativeToEye * position;

    // 传递顶点位置给片元着色器
  v_position = position.xyz;
}
