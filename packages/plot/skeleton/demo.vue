<script setup lang="ts">
import { control, interval, moved, PlotSchemePolygon, usePlot } from '@vesium/plot';

// 演示 skeleton 交互骨架的使用方式
// skeleton 定义了标绘的控制点交互方式：拖拽、中点插入、整体平移等

const { operate } = usePlot();

// 直接使用预设方案（内部已挂载 skeleton）
async function drawWithSkeleton() {
  await operate({ scheme: PlotSchemePolygon });
}

// 自定义 skeleton 组合示例
// control: 可拖拽控制点
// interval: 闭合图形的中点骨架
// intervalNonclosed: 开放图形的中点骨架
// moved: 将整个图形作为整体拖动
const _customSkeletons = [moved, control, interval];
</script>

<template>
  <div class="p-10px">
    <p class="text-sm mb-4">
      Skeleton 模块提供标绘交互骨架：control(控制点拖拽)、interval(中点插入)、moved(整体平移)。
      点击按钮开始标绘，完成后可以拖拽顶点或边进行编辑。
    </p>
    <button @click="drawWithSkeleton">
      使用预设 Skeleton 标绘
    </button>
  </div>
</template>
