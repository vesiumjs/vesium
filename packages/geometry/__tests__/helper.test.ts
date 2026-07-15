import type { CoordArray } from '@vesium/shared';
import { describe, expect, it } from 'vitest';
import {
  FITTING_COUNT,
  getAngleOfThreeCoords,
  getArcCoords,
  getAzimuth,
  getBaseLength,
  getBezierCoords,
  getBinomialFactor,
  getBisectorNormals,
  getCircleCenterOfThreeCoords,
  getCoordOnLine,
  getCubicValue,
  getCurveCoords,
  getFactorial,
  getIntersectCoord,
  getLeftMostControlCoord,
  getNormal,
  getQBSplineCoords,
  getQuadricBSplineFactor,
  getRightMostControlCoord,
  getThirdCoord,
  HALF_PI,
  isClockWise,
  mathDistance,
  mid,
  TWO_PI,
  wholeDistance,
  ZERO_TOLERANCE,
} from '../src/helper';

describe('constants', () => {
  it('should have correct FITTING_COUNT value', () => {
    expect(FITTING_COUNT).toBe(100);
  });

  it('should have correct HALF_PI value', () => {
    expect(HALF_PI).toBe(Math.PI / 2);
  });

  it('should have correct TWO_PI value', () => {
    expect(TWO_PI).toBe(Math.PI * 2);
  });

  it('should have small ZERO_TOLERANCE value', () => {
    expect(ZERO_TOLERANCE).toBe(0.0001);
  });
});

describe('mathDistance', () => {
  it('should return 0 for identical points', () => {
    expect(mathDistance([0, 0], [0, 0])).toBe(0);
    expect(mathDistance([5, 5], [5, 5])).toBe(0);
  });

  it('should return correct distance for horizontal points', () => {
    expect(mathDistance([0, 0], [3, 0])).toBe(3);
    expect(mathDistance([0, 0], [-3, 0])).toBe(3);
  });

  it('should return correct distance for vertical points', () => {
    expect(mathDistance([0, 0], [0, 4])).toBe(4);
  });

  it('should return correct distance for diagonal points (3-4-5 triangle)', () => {
    expect(mathDistance([0, 0], [3, 4])).toBe(5);
  });

  it('should handle coordinates with negative values', () => {
    expect(mathDistance([-3, -4], [0, 0])).toBe(5);
  });
});

describe('wholeDistance', () => {
  it('should return 0 for empty array', () => {
    expect(wholeDistance([])).toBe(0);
  });

  it('should return 0 for single point', () => {
    expect(wholeDistance([[0, 0]])).toBe(0);
  });

  it('should return correct distance for two points', () => {
    expect(wholeDistance([[0, 0], [3, 4]])).toBe(5);
  });

  it('should return sum of distances for multiple points', () => {
    expect(wholeDistance([[0, 0], [3, 0], [3, 4]])).toBe(7);
  });
});

describe('getBaseLength', () => {
  it('should return 0 for empty array', () => {
    expect(getBaseLength([])).toBe(0);
  });

  it('should return wholeDistance ^ 0.99', () => {
    const points: CoordArray[] = [[0, 0], [10, 0]];
    const distance = wholeDistance(points);
    expect(getBaseLength(points)).toBeCloseTo(distance ** 0.99, 5);
  });
});

describe('mid', () => {
  it('should calculate midpoint between identical points', () => {
    expect(mid([5, 5], [5, 5])).toEqual([5, 5]);
  });

  it('should calculate midpoint between (0,0) and (10,10)', () => {
    expect(mid([0, 0], [10, 10])).toEqual([5, 5]);
  });

  it('should calculate midpoint with negative coordinates', () => {
    expect(mid([-10, -10], [10, 10])).toEqual([0, 0]);
  });
});

describe('getCircleCenterOfThreeCoords', () => {
  it('should calculate center of circle through three points', () => {
    const center = getCircleCenterOfThreeCoords([0, -1], [1, 0], [0, 1]);
    expect(center[0]).toBeCloseTo(0, 5);
    expect(center[1]).toBeCloseTo(0, 5);
  });

  it('should return correct center for points (0,0), (10,0), (5,10)', () => {
    const center = getCircleCenterOfThreeCoords([0, 0], [10, 0], [5, 10]);
    // Perpendicular bisector of (0,0)-(10,0) is x=5
    // Perpendicular bisector of (0,0)-(5,10) has slope -0.5 through (2.5,5)
    // Center should be at (5, 3.75)
    expect(center[0]).toBeCloseTo(5, 5);
    expect(center[1]).toBeCloseTo(3.75, 5);
  });

  it('should return valid coordinates for non-collinear points', () => {
    const center = getCircleCenterOfThreeCoords([0, 0], [10, 0], [5, 10]);
    expect(typeof center[0]).toBe('number');
    expect(typeof center[1]).toBe('number');
  });
});

describe('getIntersectCoord', () => {
  it('should calculate intersection of two lines', () => {
    const result = getIntersectCoord([5, 0], [5, 10], [0, 5], [10, 5]);
    expect(result[0]).toBeCloseTo(5, 5);
    expect(result[1]).toBeCloseTo(5, 5);
  });

  it('should handle horizontal first line', () => {
    const result = getIntersectCoord([0, 5], [10, 5], [5, 0], [5, 10]);
    expect(result[0]).toBeCloseTo(5, 5);
    expect(result[1]).toBeCloseTo(5, 5);
  });

  it('should return correct intersection for diagonal lines', () => {
    const result = getIntersectCoord([0, 0], [10, 10], [0, 10], [10, 0]);
    expect(result[0]).toBeCloseTo(5, 5);
    expect(result[1]).toBeCloseTo(5, 5);
  });
});

describe('getAzimuth', () => {
  it('should return PI for [0,0] -> [10,0] (east direction)', () => {
    const angle = getAzimuth([0, 0], [10, 0]);
    expect(angle).toBeCloseTo(Math.PI, 5);
  });

  it('should return 3*PI/2 for [0,0] -> [0,10] (north direction)', () => {
    const angle = getAzimuth([0, 0], [0, 10]);
    expect(angle).toBeCloseTo(Math.PI * 3 / 2, 5);
  });

  it('should return PI/2 for [0,0] -> [0,-10] (south direction)', () => {
    const angle = getAzimuth([0, 0], [0, -10]);
    expect(angle).toBeCloseTo(Math.PI / 2, 5);
  });

  it('should return 2*PI for [0,0] -> [-10,0] (west direction)', () => {
    const angle = getAzimuth([0, 0], [-10, 0]);
    expect(angle).toBeCloseTo(Math.PI * 2, 5);
  });

  it('should handle identical points gracefully', () => {
    const angle = getAzimuth([0, 0], [0, 0]);
    expect(typeof angle).toBe('number');
  });
});

describe('getAngleOfThreeCoords', () => {
  it('should return PI/2 for right angle at (0,0) with (0,10) and (10,0)', () => {
    const angle = getAngleOfThreeCoords([0, 10], [0, 0], [10, 0]);
    expect(angle).toBeCloseTo(Math.PI / 2, 1);
  });

  it('should return PI for straight angle', () => {
    const angle = getAngleOfThreeCoords([0, 0], [5, 5], [10, 10]);
    expect(angle).toBeCloseTo(Math.PI, 1);
  });

  it('should return angle between 0 and 2*PI', () => {
    const angle = getAngleOfThreeCoords([0, 0], [5, 5], [10, 0]);
    expect(angle).toBeGreaterThanOrEqual(0);
    expect(angle).toBeLessThanOrEqual(Math.PI * 2);
  });
});

describe('isClockWise', () => {
  it('should return true for clockwise points (0,0)->(10,0)->(0,10)', () => {
    const result = isClockWise([0, 0], [10, 0], [0, 10]);
    expect(result).toBe(true);
  });

  it('should return false for counter-clockwise points (0,0)->(0,10)->(10,0)', () => {
    const result = isClockWise([0, 0], [0, 10], [10, 0]);
    expect(result).toBe(false);
  });

  it('should return consistent results (same input yields same output)', () => {
    const result1 = isClockWise([0, 0], [10, 0], [5, 5]);
    const result2 = isClockWise([0, 0], [10, 0], [5, 5]);
    expect(result1).toBe(result2);
  });
});

describe('getCoordOnLine', () => {
  it('should return start point when t=0', () => {
    const result = getCoordOnLine(0, [0, 0], [10, 10]);
    expect(result[0]).toBeCloseTo(0, 5);
    expect(result[1]).toBeCloseTo(0, 5);
  });

  it('should return end point when t=1', () => {
    const result = getCoordOnLine(1, [0, 0], [10, 10]);
    expect(result[0]).toBeCloseTo(10, 5);
    expect(result[1]).toBeCloseTo(10, 5);
  });

  it('should return midpoint when t=0.5', () => {
    const result = getCoordOnLine(0.5, [0, 0], [10, 10]);
    expect(result[0]).toBeCloseTo(5, 5);
    expect(result[1]).toBeCloseTo(5, 5);
  });
});

describe('getCubicValue', () => {
  it('should return start point when t=0', () => {
    const result = getCubicValue(0, [0, 0], [2, 5], [8, 5], [10, 10]);
    expect(result[0]).toBeCloseTo(0, 5);
    expect(result[1]).toBeCloseTo(0, 5);
  });

  it('should return end point when t=1', () => {
    const result = getCubicValue(1, [0, 0], [2, 5], [8, 5], [10, 10]);
    expect(result[0]).toBeCloseTo(10, 5);
    expect(result[1]).toBeCloseTo(10, 5);
  });

  it('should clamp t to [0, 1] range', () => {
    const resultNegative = getCubicValue(-1, [0, 0], [2, 5], [8, 5], [10, 10]);
    const resultOver = getCubicValue(2, [0, 0], [2, 5], [8, 5], [10, 10]);
    expect(resultNegative[0]).toBeCloseTo(0, 5);
    expect(resultOver[0]).toBeCloseTo(10, 5);
  });
});

describe('getThirdCoord', () => {
  it('should return point at correct distance from endCoord', () => {
    const start: CoordArray = [0, 0];
    const end: CoordArray = [10, 0];
    const result = getThirdCoord(start, end, 0, 10, true);
    const dist = mathDistance(end, result);
    expect(dist).toBeCloseTo(10, 5);
  });

  it('should return different results for clockwise vs counter-clockwise', () => {
    const cw = getThirdCoord([0, 0], [10, 10], Math.PI / 3, 10, true);
    const ccw = getThirdCoord([0, 0], [10, 10], Math.PI / 3, 10, false);
    const diff = Math.hypot(cw[0] - ccw[0], cw[1] - ccw[1]);
    expect(diff).toBeGreaterThan(1);
  });

  it('should return endpoint when distance is 0', () => {
    const end: CoordArray = [10, 0];
    const result = getThirdCoord([0, 0], end, Math.PI / 4, 0, true);
    expect(result[0]).toBeCloseTo(end[0], 5);
    expect(result[1]).toBeCloseTo(end[1], 5);
  });

  it('should handle negative distance (opposite direction)', () => {
    const end: CoordArray = [10, 0];
    const result = getThirdCoord([0, 0], end, 0, -10, true);
    const dist = mathDistance(end, result);
    expect(dist).toBeCloseTo(10, 5);
  });
});

describe('getArcCoords', () => {
  it('should return FITTING_COUNT + 1 points', () => {
    const result = getArcCoords([0, 0], 10, 0, Math.PI);
    expect(result.length).toBe(FITTING_COUNT + 1);
  });

  it('should return points on arc', () => {
    const radius = 10;
    const result = getArcCoords([0, 0], radius, 0, Math.PI / 2);
    expect(result[0][0]).toBeCloseTo(radius, 0);
    expect(result[0][1]).toBeCloseTo(0, 0);
  });

  it('should handle full circle (startAngle == endAngle)', () => {
    const result = getArcCoords([0, 0], 10, 0, 0);
    expect(result.length).toBe(FITTING_COUNT + 1);
  });

  it('should handle negative angle difference', () => {
    const result = getArcCoords([0, 0], 10, Math.PI, 0);
    expect(result.length).toBe(FITTING_COUNT + 1);
  });

  it('should handle radius 0 (all points at center)', () => {
    const result = getArcCoords([5, 5], 0, 0, Math.PI);
    expect(result.length).toBe(FITTING_COUNT + 1);
    result.forEach(([x, y]) => {
      expect(x).toBeCloseTo(5, 6);
      expect(y).toBeCloseTo(5, 6);
    });
  });
});

describe('getBisectorNormals', () => {
  it('should return two normal coordinates', () => {
    const result = getBisectorNormals(0.3, [0, 0], [5, 5], [10, 0]);
    expect(result.length).toBe(2);
    expect(result[0].length).toBe(2);
    expect(result[1].length).toBe(2);
  });

  it('should handle collinear points', () => {
    const result = getBisectorNormals(0.3, [0, 0], [5, 0], [10, 0]);
    expect(result.length).toBe(2);
    // Collinear: dist is 0 so goes to else branch
    // coord2 + t * (coord1 - coord2) = [5,0] + 0.3 * [-5,0] = [3.5, 0]
    // coord2 + t * (coord3 - coord2) = [5,0] + 0.3 * [5,0] = [6.5, 0]
    expect(result[0][0]).toBeCloseTo(3.5, 5);
    expect(result[0][1]).toBeCloseTo(0, 5);
    expect(result[1][0]).toBeCloseTo(6.5, 5);
    expect(result[1][1]).toBeCloseTo(0, 5);
  });

  it('should return different results for different t values', () => {
    const result1 = getBisectorNormals(0.1, [0, 0], [5, 5], [10, 0]);
    const result2 = getBisectorNormals(0.5, [0, 0], [5, 5], [10, 0]);
    expect(result1[0][0]).not.toBeCloseTo(result2[0][0], 5);
  });
});

describe('getNormal', () => {
  it('should return a normal vector for three points', () => {
    const result = getNormal([0, 0], [5, 5], [10, 0]);
    expect(result.length).toBe(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });

  it('should return a non-zero vector for non-collinear points', () => {
    const result = getNormal([0, 0], [5, 10], [10, 0]);
    const magnitude = Math.hypot(result[0], result[1]);
    expect(magnitude).toBeGreaterThan(0);
  });
});

describe('getCurveCoords', () => {
  it('should interpolate with endpoints preserved', () => {
    const controlCoords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = getCurveCoords(0.3, controlCoords);
    expect(result.length).toBeGreaterThan(controlCoords.length);
    expect(result[0]).toEqual([0, 0]);
    expect(result.at(-1)).toEqual([10, 0]);
  });
});

describe('getBezierCoords', () => {
  it('should return original array reference for 2 or fewer points', () => {
    const points: CoordArray[] = [[0, 0], [10, 10]];
    expect(getBezierCoords(points)).toBe(points);
  });

  it('should include the last point', () => {
    const points: CoordArray[] = [[0, 0], [5, 10], [10, 0]];
    const result = getBezierCoords(points);
    const last = result.at(-1)!;
    expect(last[0]).toBeCloseTo(points[2][0], 5);
    expect(last[1]).toBeCloseTo(points[2][1], 5);
  });
});

describe('getFactorial', () => {
  it.each([
    [0, 1],
    [1, 1],
    [2, 2],
    [3, 6],
    [4, 24],
    [5, 120],
    [6, 720],
    [7, 5040],
    [8, 40320],
    [10, 3628800],
  ])('should return %i for n=%i', (n, expected) => {
    expect(getFactorial(n)).toBe(expected);
  });

  it('should handle large n=24 via default loop', () => {
    const result = getFactorial(24);
    // 24! = 620448401733239439360000
    expect(result).toBeGreaterThan(0);
    expect(Number.isFinite(result)).toBe(true);
    // Verify by computing expected value
    let expected = 1;
    for (let i = 2; i <= 24; i++) {
      expected *= i;
    }
    expect(result).toBe(expected);
  });
});

describe('getBinomialFactor', () => {
  it.each([
    [0, 0, 1],
    [5, 0, 1],
    [5, 5, 1],
    [5, 1, 5],
    [5, 4, 5],
    [5, 2, 10],
    [5, 3, 10],
    [6, 0, 1],
    [6, 3, 20],
    [6, 6, 1],
    [7, 3, 35],
  ])('should return %i for n=%i, index=%i', (n, index, expected) => {
    expect(getBinomialFactor(n, index)).toBe(expected);
  });
});

describe('getQBSplineCoords', () => {
  it('should return original array for 2 or fewer', () => {
    const points: CoordArray[] = [[0, 0], [10, 10]];
    expect(getQBSplineCoords(points)).toEqual(points);
  });

  it('should include first and last points', () => {
    const points: CoordArray[] = [[0, 0], [5, 10], [10, 0]];
    const result = getQBSplineCoords(points);
    expect(result[0][0]).toBeCloseTo(0, 5);
    expect(result[0][1]).toBeCloseTo(0, 5);
    expect(result.at(-1)![0]).toBeCloseTo(10, 5);
    expect(result.at(-1)![1]).toBeCloseTo(0, 5);
  });
});

describe('getQuadricBSplineFactor', () => {
  it('should return 0 for k outside 0-2', () => {
    expect(getQuadricBSplineFactor(3, 0.5)).toBe(0);
    expect(getQuadricBSplineFactor(-1, 0.5)).toBe(0);
  });

  it('should sum to 1 for valid k values at any t', () => {
    const t = 0.3;
    const sum = getQuadricBSplineFactor(0, t) + getQuadricBSplineFactor(1, t) + getQuadricBSplineFactor(2, t);
    expect(sum).toBeCloseTo(1, 5);
  });
});

describe('getLeftMostControlCoord', () => {
  it('should return a valid control coordinate', () => {
    const controlCoords: CoordArray[] = [[0, 0], [5, 10], [10, 0]];
    const result = getLeftMostControlCoord(controlCoords, 0.3);
    expect(result.length).toBe(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
    expect(Number.isFinite(result[0])).toBe(true);
    expect(Number.isFinite(result[1])).toBe(true);
  });

  it('should handle collinear control points with different t', () => {
    const controlCoords: CoordArray[] = [[0, 0], [5, 0], [10, 0]];
    const r1 = getLeftMostControlCoord(controlCoords, 0.1);
    const r2 = getLeftMostControlCoord(controlCoords, 0.5);
    // collinear branch uses t: coord1 + t * (coord2 - coord1)
    expect(r1[0]).toBeCloseTo(0.5, 5);
    expect(r2[0]).toBeCloseTo(2.5, 5);
  });
});

describe('getRightMostControlCoord', () => {
  it('should return a valid control coordinate', () => {
    const controlCoords: CoordArray[] = [[0, 0], [5, 10], [10, 0]];
    const result = getRightMostControlCoord(controlCoords, 0.3);
    expect(result.length).toBe(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
    expect(Number.isFinite(result[0])).toBe(true);
    expect(Number.isFinite(result[1])).toBe(true);
  });

  it('should handle collinear control points with different t', () => {
    const controlCoords: CoordArray[] = [[0, 0], [5, 0], [10, 0]];
    const r1 = getRightMostControlCoord(controlCoords, 0.1);
    const r2 = getRightMostControlCoord(controlCoords, 0.5);
    // collinear branch uses t: coord3 + t * (coord2 - coord3)
    expect(r1[0]).toBeCloseTo(9.5, 5);
    expect(r2[0]).toBeCloseTo(7.5, 5);
  });
});
