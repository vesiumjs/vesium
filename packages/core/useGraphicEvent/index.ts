import type { AnyFn, Nullable } from '@vesium/shared';
import type { Entity } from 'cesium';
import type { GraphicDragEvent } from './useDrag';
import type { GraphicHoverEvent } from './useHover';
import type { GraphicPositionedEvent, PositionedEventType } from './usePositioned';
import { isDef, isFunction, resolvePick, tryRun } from '@vesium/shared';
import { ref } from 'vue';
import { useViewer } from '../useViewer';
import { useDrag } from './useDrag';
import { useHover } from './useHover';
import { usePositioned } from './usePositioned';

type GlobalGraphicSymbol = symbol;

export type CesiumGraphic = Entity | any;

export type GraphicEventType = PositionedEventType | 'HOVER' | 'DRAG';

const GLOBAL_GRAPHIC_SYMBOL: GlobalGraphicSymbol = Symbol('GLOBAL_GRAPHIC_SYMBOL');

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

export type GraphicEventListener<T extends GraphicEventType>
  = T extends 'DRAG' ? (event: GraphicDragEvent) => void
    : T extends 'HOVER' ? (event: GraphicHoverEvent) => void
      : (event: GraphicPositionedEvent) => void;

export type removeFn = () => void;

export interface AddGraphicEventOptions {
  /**
   * The cursor style to use when the mouse is over the graphic.
   * @default 'pointer'
   */
  cursor?: Nullable<string> | ((event: GraphicHoverEvent) => Nullable<string>);

  /**
   * The cursor style to use when the mouse is over the graphic during a drag operation.
   * @default 'crosshair'
   */
  dragCursor?: Nullable<string> | ((event: GraphicHoverEvent) => Nullable<string>);
}

export interface UseGraphicEventRetrun {
  /**
   * Add a graphic event listener and return a function to remove it.
   * @param graphic - The graphic object, 'global' indicates the global graphic object.
   * @param type - The event type, 'all' indicates clearing all events.
   * @param listener - The event listener function.
   */
  add: <T extends GraphicEventType>(graphic: CesiumGraphic | 'global', type: T, listener: GraphicEventListener<T>, options?: AddGraphicEventOptions) => removeFn;

  /**
   * Remove a graphic event listener.
   * @param graphic - The graphic object, 'global' indicates the global graphic object.
   * @param type - The event type, 'all' indicates clearing all events.
   * @param listener - The event listener function.
   */
  remove: <T extends GraphicEventType>(graphic: CesiumGraphic | 'global', type: T, listener: GraphicEventListener<T>) => void;

  /**
   * Clear graphic event listeners.
   * @param graphic - The graphic object.
   * @param type - The event type, 'all' indicates clearing all events.
   */
  clear: (graphic: CesiumGraphic | 'global', type: GraphicEventType | 'all') => void;
}

/**
 * Handle graphic event listeners and cursor styles for Cesium graphics.
 * You don't need to overly worry about memory leaks from the function, as it automatically cleans up internally.
 */
export function useGraphicEvent(): UseGraphicEventRetrun {
  const collection = new WeakMap<CesiumGraphic | GlobalGraphicSymbol, Map<GraphicEventType, Set<AnyFn>>>();
  const cursorCollection = new WeakMap<CesiumGraphic | GlobalGraphicSymbol, Map<GraphicEventType, Map<AnyFn, AnyFn>>>();
  const dragCursorCollection = new WeakMap<CesiumGraphic | GlobalGraphicSymbol, Map<GraphicEventType, Map<AnyFn, AnyFn>>>();

  const remove = (graphic: CesiumGraphic | 'global', type: GraphicEventType, listener: AnyFn) => {
    const _graphic: CesiumGraphic | GlobalGraphicSymbol = graphic === 'global' ? GLOBAL_GRAPHIC_SYMBOL : graphic;

    // Remove the listener for the specified type
    collection?.get(_graphic)?.get(type)?.delete(listener);
    cursorCollection?.get(_graphic)?.get(type)?.delete(listener);

    // If the listener set for the specified type is empty, delete that type
    if (collection?.get(_graphic)?.get(type)?.size === 0) {
      collection!.get(_graphic)!.delete(type);
    }
    // If the event map for the graphic is empty, delete that graphic
    if (collection.get(_graphic)?.size === 0) {
      collection.delete(_graphic);
    }
    cursorCollection?.get(_graphic)?.get(type)?.delete(listener);
    if (cursorCollection?.get(_graphic)?.get(type)?.size === 0) {
      cursorCollection?.get(_graphic)?.delete(type);
    }
    if (cursorCollection?.get(_graphic)?.size === 0) {
      cursorCollection?.delete(_graphic);
    }
    dragCursorCollection?.get(_graphic)?.get(type)?.delete(listener);

    // If the listener set for the drag type is empty, delete that type
    if (dragCursorCollection?.get(_graphic)?.get(type)?.size === 0) {
      dragCursorCollection?.get(_graphic)?.delete(type);
    }
    // If the drag event map for the graphic is empty, delete that graphic
    if (dragCursorCollection?.get(_graphic)?.size === 0) {
      dragCursorCollection?.delete(_graphic);
    }
  };

  const add = (graphic: CesiumGraphic | 'global', type: GraphicEventType, listener: AnyFn, options: AddGraphicEventOptions = {}) => {
    const _graphic: CesiumGraphic | GlobalGraphicSymbol = graphic === 'global' ? GLOBAL_GRAPHIC_SYMBOL : graphic;
    // Ensure the event map for the graphic exists
    collection.get(_graphic) ?? collection.set(_graphic, new Map());
    const eventTypeMap = collection.get(_graphic)!;

    // Ensure the listener set for the specified type exists
    eventTypeMap.get(type) ?? eventTypeMap.set(type, new Set());
    const listeners = eventTypeMap.get(type)!;

    listeners.add(listener);

    let { cursor = 'pointer', dragCursor } = options;

    // Handle cursor style for hover events
    if (isDef(cursor)) {
      const _cursor = isFunction(cursor) ? cursor : () => cursor;
      // Ensure the cursor map for the graphic exists
      cursorCollection.get(_graphic) ?? cursorCollection.set(_graphic, new Map());
      cursorCollection.get(_graphic)!.get(type) ?? cursorCollection.get(_graphic)!.set(type, new Map());
      cursorCollection.get(_graphic)!.get(type)!.set(listener, _cursor);
    }

    // Handle cursor style for drag events
    if (type === 'DRAG') {
      dragCursor ??= ((event: GraphicDragEvent) => event?.dragging ? 'crosshair' : undefined) as any;
    }

    if (isDef(dragCursor)) {
      const _dragCursor = isFunction(dragCursor) ? dragCursor : () => dragCursor;
      // Ensure the drag cursor map for the graphic exists
      dragCursorCollection.get(_graphic) ?? dragCursorCollection.set(_graphic, new Map());
      dragCursorCollection.get(_graphic)!.get(type) ?? dragCursorCollection.get(_graphic)!.set(type, new Map());
      dragCursorCollection.get(_graphic)!.get(type)!.set(listener, _dragCursor);
    }

    return () => remove(graphic, type, listener);
  };

  const clear = (graphic: CesiumGraphic | 'global', type: GraphicEventType | 'all') => {
    const _graphic: CesiumGraphic | GlobalGraphicSymbol = graphic === 'global' ? GLOBAL_GRAPHIC_SYMBOL : graphic;
    // Clear all events
    if (type === 'all') {
      collection.delete(_graphic);
      cursorCollection.delete(_graphic);
      dragCursorCollection.delete(_graphic);
      return;
    }

    // Delete the event for the specified type
    collection.get(_graphic)?.delete(type);
    if (collection.get(_graphic)?.size === 0) {
      collection.delete(_graphic);
    }
    cursorCollection?.get(_graphic)?.delete(type);
    dragCursorCollection?.get(_graphic)?.delete(type);

    // If the cursor map for the graphic is empty, delete that graphic
    if (cursorCollection?.get(_graphic)?.size === 0) {
      cursorCollection?.delete(_graphic);
    }

    // If the drag cursor map for the graphic is empty, delete that graphic
    if (dragCursorCollection?.get(_graphic)?.size === 0) {
      dragCursorCollection?.delete(_graphic);
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

  const dragging = ref(false);
  const viewer = useViewer();

  useHover((event) => {
    const graphics = resolvePick(event.pick).concat(GLOBAL_GRAPHIC_SYMBOL);
    graphics.forEach((graphic) => {
      collection.get(graphic)?.get('HOVER')?.forEach(fn => tryRun(fn)?.(event));
      if (!dragging.value) {
        cursorCollection.get(graphic)?.forEach((map) => {
          map.forEach((fn) => {
            const cursor = event.hovering ? tryRun(fn)(event) : '';
            viewer.value?.canvas.style?.setProperty('cursor', cursor);
          });
        });
      }
    });
  });

  useDrag((event) => {
    const graphics = resolvePick(event.pick).concat(GLOBAL_GRAPHIC_SYMBOL);
    dragging.value = event.dragging;

    graphics.forEach((graphic) => {
      collection.get(graphic)?.get('DRAG')?.forEach(fn => tryRun(fn)(event));
      dragCursorCollection.get(graphic)?.forEach((map) => {
        map.forEach((fn) => {
          const cursor = event.dragging ? tryRun(fn)(event) : '';
          viewer.value?.canvas.style?.setProperty('cursor', cursor);
        });
      });
    });
  });

  return {
    add,
    remove,
    clear,
  };
}
