#define USE_CUBE_MAP_SHADOW

uniform sampler2D colorTexture;
uniform samplerCube shadowMap_textureCube;
uniform mat4 shadowMap_matrix;
uniform vec3 shadowMap_lightDirectionEC;
uniform vec4 shadowMap_lightPositionEC;
uniform vec4 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness;
uniform vec4 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth;

uniform sampler2D depthTexture; // 定义深度纹理
in vec2 v_textureCoordinates; // 输入纹理坐标

#ifdef LOG_DEPTH
in vec3 v_logPositionEC;
#endif
// vec4 getPositionEC() {
//   // czm_shadow_cast_main();
//   return (czm_inverseProjection * gl_Position).xyz;
// }
vec3 getNormalEC() {
  return vec3(1.0);
}
struct _czm_shadowParameters {
  vec3 texCoords;
  float depthBias;
  float depth;
  float nDotL;
  vec2 texelStepSize;
  float normalShadingSmooth;
  float darkness;
};

float _czm_private_shadowVisibility(float visibility, float nDotL, float normalShadingSmooth, float darkness) {
#ifdef USE_NORMAL_SHADING_SMOOTH
  float strength = clamp(nDotL / normalShadingSmooth, 0.0, 1.0);
#else
  float strength = step(0.0, nDotL);
#endif
  visibility *= strength;

  visibility = max(visibility, darkness);
  return visibility;
}

float _czm_shadowVisibility(samplerCube shadowMap, _czm_shadowParameters shadowParameters) {
  float depthBias = shadowParameters.depthBias;
  float depth = shadowParameters.depth;
  float nDotL = shadowParameters.nDotL;
  float normalShadingSmooth = shadowParameters.normalShadingSmooth;
  float darkness = shadowParameters.darkness;
  vec3 uvw = shadowParameters.texCoords;

  depth -= depthBias;
  float visibility = czm_shadowDepthCompare(shadowMap, uvw, depth);
  return _czm_private_shadowVisibility(visibility, nDotL, normalShadingSmooth, darkness);
}

void main() {
  vec4 color = texture(colorTexture, v_textureCoordinates);
  float logDepthOrDepth = czm_unpackDepth(texture(depthTexture, v_textureCoordinates));
  out_FragColor = color;
  if(logDepthOrDepth >= 1.0) {
    return;
  }
  float depth = czm_readDepth(depthTexture, v_textureCoordinates);
  vec4 eyeCoordinate = czm_windowToEyeCoordinates(v_textureCoordinates.xy * czm_viewport.zw, logDepthOrDepth);
  vec3 positionEC = eyeCoordinate.xyz / eyeCoordinate.w;
  // vec4 positionEC = getPositionEC();
  vec3 normalEC = getNormalEC();
  // float depth = -positionEC.z;
  _czm_shadowParameters shadowParameters;
  shadowParameters.texelStepSize = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.xy;
  shadowParameters.depthBias = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.z;
  shadowParameters.normalShadingSmooth = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.w;
  shadowParameters.darkness = shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.w;
  shadowParameters.depthBias *= max(depth * 0.01, 1.0);
  vec3 directionEC = positionEC.xyz - shadowMap_lightPositionEC.xyz;
  float distance = length(directionEC);
  directionEC = normalize(directionEC);
  float radius = shadowMap_lightPositionEC.w;
    // Stop early if the fragment is beyond the point light radius
  if(distance > radius) {
    out_FragColor = color;
    return;
  }
  vec3 directionWC = czm_inverseViewRotation * directionEC;
  shadowParameters.depth = distance / radius;
  shadowParameters.nDotL = clamp(dot(normalEC, -directionEC), 0.0, 1.0);
  shadowParameters.texCoords = directionWC;
  float visibility = _czm_shadowVisibility(shadowMap_textureCube, shadowParameters);
  out_FragColor.rgb *= 1.-visibility;
}
