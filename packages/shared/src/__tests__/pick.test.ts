import type { Entity } from 'cesium';
import type { ScenePickResult } from '../pick';
import { describe, expect, it } from 'vitest';
import { pickHitGraphic, resolvePick } from '../pick';

describe('pick', () => {
  describe('resolvePick', () => {
    it('should return an empty array for empty input', () => {
      const result = resolvePick({});
      expect(result).toEqual([]);
    });

    it('should return an empty array for undefined input', () => {
      const result = resolvePick(undefined);
      expect(result).toEqual([]);
    });

    it('should extract id from pick result', () => {
      const entity = { id: 'entity1' } as Entity;
      const pickResult: ScenePickResult = { id: entity };
      const result = resolvePick(pickResult);
      expect(result).toContain(entity);
    });

    it('should extract primitive from pick result', () => {
      const primitive = { type: 'primitive' };
      const pickResult: ScenePickResult = { primitive: primitive as any };
      const result = resolvePick(pickResult);
      expect(result).toContain(primitive);
    });

    it('should extract primitiveCollection from pick result', () => {
      const collection = { type: 'collection' };
      const pickResult: ScenePickResult = { primitiveCollection: collection as any };
      const result = resolvePick(pickResult);
      expect(result).toContain(collection);
    });

    it('should extract collection from pick result', () => {
      const collection = { type: 'collection' };
      const pickResult: ScenePickResult = { collection: collection as any };
      const result = resolvePick(pickResult);
      expect(result).toContain(collection);
    });

    it('should handle array ids', () => {
      const entities = [{ id: '1' }, { id: '2' }] as Entity[];
      const pickResult: ScenePickResult = { id: entities };
      const result = resolvePick(pickResult);
      expect(result).toContain(entities[0]);
      expect(result).toContain(entities[1]);
    });

    it('should filter out falsy values from single id array', () => {
      const pickResult: ScenePickResult = { id: null as any };
      const result = resolvePick(pickResult);
      expect(result).toEqual([]);
    });

    it('should extract entityCollection and dataSource from id', () => {
      const dataSource = { name: 'test-datasource' };
      const entityCollection = { owner: dataSource };
      const entity = { entityCollection } as unknown as Entity;
      const pickResult: ScenePickResult = { id: entity };
      const result = resolvePick(pickResult);
      expect(result).toContain(entityCollection);
      expect(result).toContain(dataSource);
    });

    it('should return all valid elements', () => {
      const dataSource = { name: 'ds' };
      const entityCollection = { owner: dataSource };
      const entity = { entityCollection, id: 'e1' } as unknown as Entity;
      const primitive = { type: 'prim' };
      const pickResult: ScenePickResult = {
        id: entity,
        primitive: primitive as any,
      };
      const result = resolvePick(pickResult);
      expect(result.length).toBe(4);
    });

    it('should handle id being a Cesium3DTileFeature-like object', () => {
      const tileFeature = { primitive: 'tile', featureId: 0 };
      const pickResult: ScenePickResult = { id: tileFeature as any };
      const result = resolvePick(pickResult);
      expect(result).toContain(tileFeature);
    });

    it('should handle id being Entity[] from scene.drillPick', () => {
      const entities = [
        { id: 'a', entityCollection: { owner: { name: 'ds1' } } },
        { id: 'b', entityCollection: { owner: { name: 'ds2' } } },
      ] as unknown as Entity[];
      const pickResult: ScenePickResult = { id: entities };
      const result = resolvePick(pickResult);
      // id is an Entity[]; resolvePick spreads it but does not check entityCollection on array itself
      expect(result).toHaveLength(2);
      expect(result).toContain(entities[0]);
      expect(result).toContain(entities[1]);
    });
  });

  describe('pickHitGraphic', () => {
    it('should return false for undefined pick', () => {
      expect(pickHitGraphic(undefined, [{ id: '1' } as Entity])).toBe(false);
    });

    it('should return false for empty graphic array', () => {
      expect(pickHitGraphic({}, [])).toBe(false);
    });

    it('should return false when graphic is not an array', () => {
      expect(pickHitGraphic({}, 'not-array' as any)).toBe(false);
    });

    it('should return false when pick result is empty', () => {
      expect(pickHitGraphic({}, [{ id: '1' } as Entity])).toBe(false);
    });

    it('should return true when graphic is in pick result', () => {
      const entity = { id: 'entity1' } as Entity;
      const pickResult: ScenePickResult = { id: entity };
      expect(pickHitGraphic(pickResult, [entity])).toBe(true);
    });

    it('should return false when graphic is not in pick result', () => {
      const entity = { id: 'entity1' } as Entity;
      const otherEntity = { id: 'entity2' } as Entity;
      const pickResult: ScenePickResult = { id: entity };
      expect(pickHitGraphic(pickResult, [otherEntity])).toBe(false);
    });

    it('should work with multiple graphics', () => {
      const entity = { id: 'entity1' } as Entity;
      const pickResult: ScenePickResult = { id: entity };
      expect(pickHitGraphic(pickResult, [entity, { id: 'other' } as Entity])).toBe(true);
    });
  });
});
