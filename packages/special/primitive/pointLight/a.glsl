uniform sampler2D colorTexture; // 定义颜色纹理
in vec2 v_textureCoordinates; // 输入纹理坐标
uniform sampler2D depthTexture; // 定义深度纹理
uniform sampler2D shadowMap_texture; // 定义阴影贴图纹理
uniform mat4 shadowMap_matrix; // 定义阴影贴图矩阵
uniform vec4 shadowMap_lightPositionEC; // 定义光源位置（相机坐标系）
uniform vec4 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness; // 定义法线偏移、缩放、距离、最大距离和黑暗度
uniform vec4 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth; // 定义texel大小、深度偏移、法线平滑度

// 重写了czm_shadowVisibility方法
float _czm_shadowVisibility(sampler2D shadowMap, czm_shadowParameters shadowParameters) { // 定义阴影可见性函数
    float depth = shadowParameters.depth; // 获取深度
    float depthBias = shadowParameters.depthBias; // 获取深度偏移
    float nDotL = shadowParameters.nDotL; // 获取法线与光源方向的点积
    float normalShadingSmooth = shadowParameters.normalShadingSmooth; // 获取法线平滑度
    float darkness = shadowParameters.darkness; // 获取黑暗度
    vec2 uv = shadowParameters.texCoords; // 获取纹理坐标
    depth -= depthBias; // 应用深度偏移
    float visibility = czm_shadowDepthCompare(shadowMap, uv, depth); // 计算可见性
    return visibility; // 返回可见性
}

void main() { // 主函数
    vec4 color = texture(colorTexture, v_textureCoordinates); // 获取颜色纹理
    out_FragColor = texture(colorTexture, v_textureCoordinates); // 输出颜色
    float depth = czm_unpackDepth(texture(depthTexture, v_textureCoordinates)); // 获取深度
    if(depth >= 1.0) { // 如果深度大于等于1.0
        return; // 退出
    }
    vec4 eyeCoordinate4 = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth); // 获取相机坐标系下的坐标
    vec4 positionEC = eyeCoordinate4 / eyeCoordinate4.w; // 归一化坐标
    vec3 normalEC = vec3(1.); // 定义法线
    czm_shadowParameters shadowParameters; // 定义阴影参数
    shadowParameters.texelStepSize = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.xy; // 设置texel大小
    shadowParameters.depthBias = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.z; // 设置深度偏移
    shadowParameters.normalShadingSmooth = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.w; // 设置法线平滑度
    shadowParameters.darkness = shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.w; // 设置黑暗度
    shadowParameters.depthBias *= max(depth * .01, 1.); // 调整深度偏移
    vec3 directionEC = normalize(positionEC.xyz - shadowMap_lightPositionEC.xyz); // 计算法线方向
    float nDotL = clamp(dot(normalEC, -directionEC), 0.0, 1.0); // 计算法线与光源方向的点积
    vec4 shadowPosition = shadowMap_matrix * positionEC; // 计算阴影位置
    shadowPosition /= shadowPosition.w; // 归一化阴影位置
    if(any(lessThan(shadowPosition.xyz, vec3(0.0))) || any(greaterThan(shadowPosition.xyz, vec3(1.0)))) { // 如果阴影位置超出范围
        return; // 退出
    }
    shadowParameters.texCoords = shadowPosition.xy; // 设置纹理坐标
    shadowParameters.depth = shadowPosition.z; // 设置深度
    shadowParameters.nDotL = nDotL; // 设置法线与光源方向的点积
    float visibility = _czm_shadowVisibility(shadowMap_texture, shadowParameters); // 计算可见性
    if(visibility == 1.) { // 如果可见性为1.0
        out_FragColor += vec4(0.0, 1., 0., 0.5); // 输出绿色
    } else { // 否则
        out_FragColor += vec4(1.0, 0., 0., 0.2); // 输出红色
    }
}
