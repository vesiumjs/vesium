import { describe, expect, it } from 'vitest';
import { pickHitGraphic, resolvePick } from '../src/pick';

describe('pick utils', () => {
  it('resolvePick', () => {
    const mockId = { entityCollection: { owner: 'dataSource' } };
    const mockPrimitive = { id: 'primitive' };
    const pick = {
      id: mockId,
      primitive: mockPrimitive,
    };
    const resolved = resolvePick(pick);
    expect(resolved).toContain(mockId);
    expect(resolved).toContain(mockPrimitive);
    expect(resolved).toContain('dataSource');
  });

  it('pickHitGraphic', () => {
    const mockId = { id: 'id' };
    const pick = { id: mockId };
    expect(pickHitGraphic(pick, [mockId])).toBe(true);
    expect(pickHitGraphic(pick, [{ id: 'other' }])).toBe(false);
  });
});
