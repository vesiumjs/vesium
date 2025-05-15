import { Cartesian3, CoplanarPolygonGeometry, VertexFormat } from 'cesium';

/**
 * 将多个边界点组成的面切割成多个三角形返回参数，为三角形三点的数组
 */
export type TesselateReturn = Array<[p0: Cartesian3, p1: Cartesian3, p2: Cartesian3]>;

/**
 * 将多个边界点组成的面切割成多个三角形
 * @param positions
 */
export function tesselate(positions: Cartesian3[]): TesselateReturn {
  if (positions.length < 3) {
    throw new Error('positions must >= 3');
  }

  if (positions.length === 3) {
    return [[positions[0].clone(), positions[1].clone(), positions[2].clone()]];
  }

  const geometry = CoplanarPolygonGeometry.createGeometry(
    CoplanarPolygonGeometry.fromPositions({
      positions,
      vertexFormat: VertexFormat.POSITION_ONLY,
    }),
  )!;

  if (!geometry) {
    throw new Error('positions无法组成有效的geometry,检查点位是否错误');
  }
  const values = geometry.attributes.position!.values as number[];
  const indices = geometry.indices;
  const result: TesselateReturn = [];
  for (let i = 0; i < indices!.length; i += 3) {
    const a = Cartesian3.unpack(values, indices![i] * 3, new Cartesian3());
    const b = Cartesian3.unpack(values, indices![i + 1] * 3, new Cartesian3());
    const c = Cartesian3.unpack(values, indices![i + 2] * 3, new Cartesian3());
    result.push([a, b, c]);
  }
  return result;
}
