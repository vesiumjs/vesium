import type { JulianDate } from 'cesium';
import type { ComputedRef, ShallowRef } from 'vue';
import type { PlotFeature } from './PlotFeature';
import type { PlotSkeleton } from './PlotSkeleton';
import { onKeyStroke, watchArray } from '@vueuse/core';
import { CustomDataSource } from 'cesium';
import { arrayDiff, isFunction, useCesiumEventListener, useDataSource, useEntityScope, useGraphicEvent, useViewer } from 'vesium';
import { nextTick, shallowRef, toValue, watch, watchEffect } from 'vue';
import { PlotAction, PlotSkeletonEntity } from './PlotSkeleton';

export function useSkeleton(
  plots: ComputedRef<PlotFeature[]>,
  current: ShallowRef<PlotFeature | undefined>,
  getCurrentTime: () => JulianDate,
) {
  const viewer = useViewer();

  const dataSource = useDataSource(new CustomDataSource());
  const entityScope = useEntityScope({ collection: () => dataSource.value!.entities });

  const hoverEntity = shallowRef<PlotSkeletonEntity>();
  const activeEntity = shallowRef<PlotSkeletonEntity>();

  // 获取当前点位的状态
  const getPointAction = (entity?: PlotSkeletonEntity) => {
    if (!entity) {
      return PlotAction.IDLE;
    }
    return activeEntity.value?.id === entity.id
      ? PlotAction.ACTIVE
      : hoverEntity.value?.id === entity.id
        ? PlotAction.HOVER
        : PlotAction.IDLE;
  };

  const update = (plot: PlotFeature, destroyed?: boolean) => {
    const oldEntities = plot.skeletons;
    const entities: PlotSkeletonEntity[] = [];

    if (destroyed || plot.disabled) {
      plot.skeletons = [];
    }
    else {
      const packable = plot.sampled.getValue(getCurrentTime());
      const defining = plot.defining;
      const active = current.value === plot;
      const skeletons = plot.scheme.skeletons;

      skeletons.forEach((skeleton) => {
        const disabled = isFunction(skeleton.disabled) ? skeleton.disabled({ active, defining }) : skeleton.disabled;
        if (disabled) {
          return;
        }
        const positions = skeleton.format?.(packable!) ?? packable?.positions ?? [];

        positions.forEach((position, index) => {
          let entity = oldEntities.find(item => item.index === index && item.skeleton === skeleton);
          const options = skeleton.render?.({
            defining,
            active,
            index,
            packable,
            positions,
            position,
            action: getPointAction(entity),
          });

          const merge = new PlotSkeletonEntity(options ?? {});
          if (entity) {
            merge.propertyNames.forEach((key) => {
              if (key !== 'id') {
                // @ts-expect-error ignore
                entity[key] = merge[key];
              }
            });
          }
          else {
            entity = merge;
          }
          entity.plot = plot;
          entity.skeleton = skeleton;
          entity.index = index;
          entities.push(entity);
        });
      });
    }
    plot.skeletons = entities;
  };

  const { addGraphicEvent } = useGraphicEvent();

  watchEffect((onCleanup) => {
    // cursor 仅在不存在定义态的标绘时才生效
    const remove = addGraphicEvent('global', 'DRAG', ({ event, pick, dragging, lockCamera }) => {
      if (pick.id instanceof PlotSkeletonEntity && entityScope.scope.has(pick.id)) {
        const entity = pick.id as PlotSkeletonEntity;

        const plot = entity.plot as PlotFeature;
        // 仅在非定义态时才可拖拽
        if (plot.defining) {
          return;
        }
        activeEntity.value = entity;
        const skeleton = entity.skeleton as PlotSkeleton;
        const index = entity.index as number;
        const packable = plot.sampled.getValue(getCurrentTime());
        skeleton.onDrag?.({
          viewer: viewer.value!,
          sampled: plot.sampled,
          packable,
          active: current.value === plot,
          index,
          event,
          dragging,
          lockCamera,
        });
      }
      else {
        activeEntity.value = undefined;
      }
    }, {
      cursor: ({ pick }) => {
        if (!current.value?.defining && entityScope.scope.has(pick.id)) {
          const skeleton = pick.id.skeleton as PlotSkeleton;
          return isFunction(skeleton?.cursor) ? skeleton.cursor(pick) : toValue(skeleton?.cursor);
        }
      },
      dragCursor: ({ pick }) => {
        if (!current.value?.defining && entityScope.scope.has(pick.id)) {
          const skeleton = pick.id.skeleton as PlotSkeleton;
          return isFunction(skeleton?.dragCursor) ? skeleton.dragCursor(pick) : toValue(skeleton?.dragCursor);
        }
      },
    });
    onCleanup(remove);
  });

  // 键盘控制当前激活的点位
  onKeyStroke((keyEvent) => {
    if (activeEntity.value) {
      const entity = activeEntity.value;
      const plot = entity.plot as PlotFeature;
      const skeleton = entity.skeleton as PlotSkeleton;
      const index = entity.index as number;
      const packable = plot.sampled.getValue(getCurrentTime());

      skeleton.onKeyPressed?.({
        viewer: viewer.value!,
        sampled: plot.sampled,
        packable,
        index,
        keyEvent,
      });
    }
  });

  watchEffect((onCleanup) => {
    const remove = addGraphicEvent('global', 'HOVER', ({ hovering, pick }) => {
      if (hovering && pick.id instanceof PlotSkeletonEntity && entityScope.scope.has(pick.id)) {
        const entity = pick.id as PlotSkeletonEntity;
        hoverEntity.value = entity;
      }
      else {
        hoverEntity.value = undefined;
      }
    });
    onCleanup(remove);
  });

  watchEffect((onCleanup) => {
    const remove = addGraphicEvent('global', 'LEFT_CLICK', ({ event, pick }) => {
      if (pick.id instanceof PlotSkeletonEntity && entityScope.scope.has(pick.id)) {
        const entity = pick.id as PlotSkeletonEntity;
        activeEntity.value = entity;
        const plot = entity.plot as PlotFeature;
        const skeleton = entity.skeleton as PlotSkeleton;
        const index = entity.index as number;
        const packable = plot.sampled.getValue(getCurrentTime());

        skeleton.onLeftClick?.({
          viewer: viewer.value!,
          sampled: plot.sampled,
          packable: packable!,
          active: current.value === plot,
          defining: plot.defining,
          index,
          event,
        });
      }
      else {
        activeEntity.value = undefined;
      }
    });
    onCleanup(remove);
  });

  watchArray(plots, (value, oldValue, added, removed = []) => {
    added.forEach(plot => update(plot));
    removed.forEach(plot => update(plot, true));
  });

  useCesiumEventListener(
    () => plots.value.map(plot => plot.definitionChanged),
    (plot, key, newValue, oldValue) => {
      if (['disabled', 'defining', 'scheme', 'sampled', 'time'].includes(key)) {
        nextTick(() => update(plot));
      }
      else if (key === 'skeletons') {
        const { added, removed } = arrayDiff(newValue as PlotSkeletonEntity[], oldValue as PlotSkeletonEntity[]);
        added.forEach(item => entityScope.add(item));
        removed.forEach(item => entityScope.remove(item));
      }
    },
  );

  // 当前激活的标绘变化时，更新渲染
  watch(current, (plot, previous) => {
    plot && update(plot);
    previous && update(previous);
  });

  return {
    dataSource,
  };
}
