in vec3 v_position;

void main() {
    // 根据高度设置颜色
  float heightFactor = clamp(v_position.z / 1000.0, 0.0, 1.0);
  vec3 color = mix(vec3(0.1, 0.5, 0.8), vec3(0.9, 0.9, 1.0), heightFactor);

  out_FragColor = vec4(color, 1.0);
}
