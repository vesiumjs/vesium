import { describe, expect, it, vi } from 'vitest';
import { effectScope } from 'vue';
import { useCollectionScope } from '../useCollectionScope';

describe('useCollectionScope', () => {
  it('should add items to scope', () => {
    const addEffect = vi.fn(i => i);
    const removeEffect = vi.fn();
    const { add, scope } = useCollectionScope({ addEffect, removeEffect });

    const item = { id: 1 };
    add(item);
    expect(addEffect).toHaveBeenCalledWith(item);
    expect(scope.has(item)).toBe(true);
  });

  it('should remove items from scope', () => {
    const addEffect = vi.fn(i => i);
    const removeEffect = vi.fn();
    const { add, remove, scope } = useCollectionScope({ addEffect, removeEffect });

    const item = { id: 1 };
    add(item);
    remove(item);
    expect(removeEffect).toHaveBeenCalledWith(item);
    expect(scope.has(item)).toBe(false);
  });

  it('should handle async addEffect', async () => {
    const addEffect = vi.fn(async i => i);
    const removeEffect = vi.fn();
    const { add, scope } = useCollectionScope({ addEffect, removeEffect });

    const item = { id: 1 };
    const result = await add(item);
    expect(result).toBe(item);
    expect(scope.has(item)).toBe(true);
  });

  it('should removeWhere correctly', () => {
    const addEffect = vi.fn(i => i);
    const removeEffect = vi.fn();
    const { add, removeWhere, scope } = useCollectionScope({ addEffect, removeEffect });

    add({ id: 1, type: 'a' });
    add({ id: 2, type: 'b' });
    removeWhere((item: any) => item.type === 'a');
    expect(scope.size).toBe(1);
    expect(Array.from(scope)[0].id).toBe(2);
  });

  it('should cleanup on scope dispose', () => {
    const addEffect = vi.fn(i => i);
    const removeEffect = vi.fn();

    const scope = effectScope();
    scope.run(() => {
      const { add } = useCollectionScope({ addEffect, removeEffect });
      add({ id: 1 });
    });

    scope.stop();
    expect(removeEffect).toHaveBeenCalled();
  });
});
