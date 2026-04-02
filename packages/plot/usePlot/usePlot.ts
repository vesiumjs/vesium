import type { ComputedRef, ShallowRef } from 'vue';
import type { PlotFeatureConstructorOptions } from './PlotFeature';
import type { SampledPlotPackable } from './SampledPlotProperty';
import { JulianDate, ScreenSpaceEventType } from 'cesium';
import { pickHitGraphic, useCesiumEventListener, useScreenSpaceEventHandler, useViewer } from 'vesium';
import { computed, nextTick, shallowReactive, shallowRef } from 'vue';
import { PlotFeature } from './PlotFeature';
import { useRender } from './useRender';
import { useSampled } from './useSampled';
import { useSkeleton } from './useSkeleton';

export interface UsePlotOptions {
  /**
   * Shared timeline used by the plotting session.
   */
  time?: ShallowRef<JulianDate | undefined>;
}

export type UsePlotOperate = (plot: PlotFeature | PlotFeatureConstructorOptions) => Promise<PlotFeature>;

export interface UsePlotReturn {
  /**
   * Reactive snapshot of every plot managed by the current session.
   */
  plots: ComputedRef<PlotFeature[]>;

  /**
   * Shared timeline used by the current plotting session.
   */
  time: ShallowRef<JulianDate | undefined>;

  /**
   * Start a new plot or resume an existing `PlotFeature`.
   */
  operate: UsePlotOperate;

  /**
   * Remove a plot from the current session.
   */
  remove: (plot: PlotFeature) => boolean;

  /**
   * Abort the current `operate()` call if one is pending.
   * This can be `undefined` before a plot operation starts.
   */
  cancel: VoidFunction | undefined;
}

export function usePlot(options?: UsePlotOptions): UsePlotReturn {
  const time = options?.time || shallowRef<JulianDate>();

  const viewer = useViewer();

  const getCurrentTime = () => {
    return time.value?.clone() || new JulianDate(0, 0);
  };

  // Keep plots in a Set so feature identity is stable and re-adding the same instance does not
  // create duplicates in the session state.
  const collection = shallowReactive(new Set<PlotFeature>());
  const plots = computed(() => Array.from(collection));
  // The plot currently being defined or restored.
  const current = shallowRef<PlotFeature>();
  const packable = shallowRef<SampledPlotPackable>();

  useCesiumEventListener([
    () => current.value?.sampled.definitionChanged,
  ], () => {
    packable.value = current.value?.sampled.getValue(getCurrentTime());
  });

  useSampled(current, getCurrentTime);
  useRender(plots, current, getCurrentTime);
  useSkeleton(plots, current, getCurrentTime);

  // 单击激活
  useScreenSpaceEventHandler(ScreenSpaceEventType.LEFT_CLICK, (data) => {
    if (current.value?.defining) {
      return;
    }

    const pick = viewer.value?.scene.pick(data.position.clone());
    // 点击到了骨架点则不处理
    if (pick?.id?.plot instanceof PlotFeature) {
      return;
    }

    if (!pick) {
      current.value = undefined;
      return;
    }

    current.value = plots.value.find(plot => pickHitGraphic(pick, [...plot.entities, ...plot.primitives, ...plot.groundPrimitives]));
  });

  let operateResolve: (() => void) | undefined;
  let operateReject: (() => void) | undefined;
  useCesiumEventListener(() => current.value?.definitionChanged, (_, key, value) => {
    if (key === 'defining' && !value) {
      operateResolve?.();
    }
  });

  const operate: UsePlotOperate = async (plot) => {
    await nextTick();

    // 当前激活的标绘发生变动时，上一个标绘取消激活。若上一标绘仍处于定义态时，应立即强制完成，若无法完成则删除。
    const previous = current.value;
    if (previous?.defining) {
      const packable = previous.sampled.getValue(getCurrentTime());
      const completed = previous.scheme.allowManualComplete?.(packable);
      if (completed) {
        PlotFeature.setDefining(previous, false);
        operateResolve?.();
      }
      else {
        collection.delete(previous);
        operateReject?.();
      }
    }

    return new Promise((resolve, reject) => {
      const _plot = plot instanceof PlotFeature ? plot : new PlotFeature(plot);
      if (!collection.has(_plot)) {
        collection.add(_plot);
      }
      operateResolve = () => {
        operateResolve = undefined;
        operateReject = undefined;
        resolve(_plot);
      };
      operateReject = () => {
        operateResolve = undefined;
        operateReject = undefined;
        reject(new Error('plot is not completed', { cause: _plot }));
      };
      current.value = _plot;
      // 新增的标绘若不是定义态，则属于带有初始化点位的标绘（标绘恢复场景），此时需要立即更新一次
      if (!_plot.defining) {
        operateResolve?.();
      }
    });
  };

  const remove = (plot: PlotFeature): boolean => {
    if (plot === current.value) {
      current.value = undefined;
    }
    if (collection.has(plot)) {
      collection.delete(plot);
      return true;
    }
    return false;
  };

  return {
    plots,
    time,
    operate,
    remove,
    cancel: operateReject,
  };
}
