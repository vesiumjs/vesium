import type { AnyFn } from '@vesium/shared';
import type { Entity } from 'cesium';
import type { PositionedEventType } from './usePositioned';
import { resolvePick, tryRun } from '@vesium/shared';
import { useDrag } from './useDrag';
import { useHover } from './useHover';
import { usePositioned } from './usePositioned';

export type CesiumGraphic = Entity | object;

export type GraphicEventType = PositionedEventType | 'HOVER' | 'DRAG';

type GlobalGraphicSymbol = object;

const GLOBAL_GRAPHIC_SYMBOL: GlobalGraphicSymbol = new Object();

const POSITIONED_EVENT_TYPES: PositionedEventType[] = [
  'LEFT_DOWN',
  'LEFT_UP',
  'LEFT_CLICK',
  'LEFT_DOUBLE_CLICK',
  'RIGHT_DOWN',
  'RIGHT_UP',
  'RIGHT_CLICK',
  'MIDDLE_DOWN',
  'MIDDLE_UP',
  'MIDDLE_CLICK',
];

export type RemoveGraphicEventFn = () => void;

export interface UseGraphicEventRetrun {
  addGraphicEvent: (graphic: CesiumGraphic | 'global', type: GraphicEventType, listener: AnyFn) => RemoveGraphicEventFn;
  removeGraphicEvent: (graphic: CesiumGraphic | 'global', type: GraphicEventType, listener: AnyFn) => void;
  clearGraphicEvent: (graphic: CesiumGraphic | 'global', type: GraphicEventType | 'all') => void;
}

export function useGraphicEvent(): UseGraphicEventRetrun {
  const collection = new WeakMap<CesiumGraphic | GlobalGraphicSymbol, Map<GraphicEventType, Set<AnyFn>>>();

  const removeGraphicEvent = (graphic: CesiumGraphic | 'global', type: GraphicEventType, listener: AnyFn) => {
    const _graphic: CesiumGraphic | GlobalGraphicSymbol = graphic === 'global' ? GLOBAL_GRAPHIC_SYMBOL : graphic;
    if (!collection.get(_graphic)) {
      return;
    }
    const eventTypeMap = collection.get(_graphic)!;
    if (!eventTypeMap.get(type)) {
      return;
    }
    const listeners = eventTypeMap.get(type);
    if (!listeners) {
      return;
    }
    listeners.delete(listener);
    if (!listeners.size) {
      eventTypeMap.delete(type);
    }

    if (eventTypeMap.size) {
      collection.delete(_graphic);
    }
  };

  const addGraphicEvent = (graphic: CesiumGraphic | 'global', type: GraphicEventType, listener: AnyFn) => {
    const _graphic: CesiumGraphic | GlobalGraphicSymbol = graphic === 'global' ? GLOBAL_GRAPHIC_SYMBOL : graphic;
    if (!collection.get(_graphic)) {
      collection.set(_graphic, new Map());
    }
    const eventTypeMap = collection.get(_graphic)!;
    if (!eventTypeMap.get(type)) {
      eventTypeMap.set(type, new Set());
    }
    const listeners = eventTypeMap.get(type)!;
    listeners.add(listener);

    return () => removeGraphicEvent(graphic, type, listener);
  };

  const clearGraphicEvent = (graphic: CesiumGraphic | 'global', type: GraphicEventType | 'all') => {
    const _graphic: CesiumGraphic | GlobalGraphicSymbol = graphic === 'global' ? GLOBAL_GRAPHIC_SYMBOL : graphic;
    if (type === 'all') {
      collection.delete(_graphic);
      return;
    }
    if (!collection.get(_graphic)) {
      return;
    }
    const eventTypeMap = collection.get(_graphic)!;
    eventTypeMap.delete(type);
    if (eventTypeMap.size) {
      collection.delete(_graphic);
    }
  };

  for (const type of POSITIONED_EVENT_TYPES) {
    usePositioned(type, (event) => {
      const graphics = resolvePick(event.pick);
      graphics.concat(GLOBAL_GRAPHIC_SYMBOL).forEach((graphic) => {
        collection.get(graphic)?.get(type)?.forEach(fn => tryRun(fn)?.(event));
      });
    });
  }

  useHover((event) => {
    const graphics = resolvePick(event.pick);
    graphics.concat(GLOBAL_GRAPHIC_SYMBOL).forEach((graphic) => {
      collection.get(graphic)?.get('HOVER')?.forEach(fn => tryRun(fn)?.(event));
    });
  });

  useDrag((event) => {
    const graphics = resolvePick(event.pick);
    graphics.concat(GLOBAL_GRAPHIC_SYMBOL).forEach((graphic) => {
      collection.get(graphic)?.get('DRAG')?.forEach(fn => tryRun(fn)(event));
    });
  });

  return {
    addGraphicEvent,
    removeGraphicEvent,
    clearGraphicEvent,
  };
}
