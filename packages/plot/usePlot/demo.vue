<script setup lang="ts">
import {
  PlotSchemeBillboard,
  PlotSchemeBillboardPinBuilder,
  PlotSchemeCylinder,
  PlotSchemeEllipse,
  PlotSchemeLabel,
  PlotSchemePoint,
  PlotSchemePolygon,
  PlotSchemePolygonArc,
  PlotSchemePolygonArrowAttackDirection,
  PlotSchemePolygonArrowAttackDirectionTailed,
  PlotSchemePolygonArrowClamped,
  PlotSchemePolygonArrowStraight,
  PlotSchemePolygonArrowStraightSharp,
  PlotSchemePolygonArrowUnitCombatOperation,
  PlotSchemePolygonArrowUnitCombatOperationTailed,
  PlotSchemePolygonAssemblingPlace,
  PlotSchemePolygonSmooth,
  PlotSchemePolyline,
  PlotSchemePolylineCurve,
  PlotSchemeRectangle,
  usePlot,
} from '@vesium/plot';

const { operate } = usePlot();

const otpions = [
  {
    label: 'Billboard',
    scheme: PlotSchemeBillboard,
  },
  {
    label: 'BillboardPinBuilder',
    scheme: PlotSchemeBillboardPinBuilder,
  },
  {
    label: 'Cylinder',
    scheme: PlotSchemeCylinder,
  },
  {
    label: 'Ellipse',
    scheme: PlotSchemeEllipse,
  },
  {
    label: 'Label',
    scheme: PlotSchemeLabel,
  },
  {
    label: 'Point',
    scheme: PlotSchemePoint,
  },
  {
    label: 'Polygon',
    scheme: PlotSchemePolygon,
  },
  {
    label: 'PolygonArc',
    scheme: PlotSchemePolygonArc,
  },
  {
    label: 'PolygonArrowAttackDirection',
    scheme: PlotSchemePolygonArrowAttackDirection,
  },
  {
    label: 'PolygonArrowAttackDirectionTailed',
    scheme: PlotSchemePolygonArrowAttackDirectionTailed,
  },
  {
    label: 'PolygonArrowClamped',
    scheme: PlotSchemePolygonArrowClamped,
  },
  {
    label: 'PolygonArrowStraight',
    scheme: PlotSchemePolygonArrowStraight,
  },
  {
    label: 'PolygonArrowStraightSharp',
    scheme: PlotSchemePolygonArrowStraightSharp,
  },
  {
    label: 'PolygonArrowUnitCombatOperation',
    scheme: PlotSchemePolygonArrowUnitCombatOperation,
  },
  {
    label: 'PolygonArrowUnitCombatOperationTailed',
    scheme: PlotSchemePolygonArrowUnitCombatOperationTailed,
  },
  {
    label: 'PolygonAssemblingPlace',
    scheme: PlotSchemePolygonAssemblingPlace,
  },
  {
    label: 'PolygonSmooth',
    scheme: PlotSchemePolygonSmooth,
  },
  {
    label: 'Polyline',
    scheme: PlotSchemePolyline,
  },
  {
    label: 'PolylineCurve',
    scheme: PlotSchemePolylineCurve,
  },
  {
    label: 'Rectangle',
    scheme: PlotSchemeRectangle,
  },
];
</script>

<template>
  <div p="10px" flex="~ wrap" gap="4px">
    <button v-for="item in otpions" :key="item.label" @click="operate({ scheme: item.scheme })">
      {{ item.label }}
    </button>
  </div>
</template>
