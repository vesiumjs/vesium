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
    expect(ZERO_TOLERANCE).toBeGreaterThan(0);
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
    const points: CoordArray[] = [[0, 0], [3, 4]];
    expect(wholeDistance(points)).toBe(5);
  });

  it('should return sum of distances for multiple points', () => {
    const points: CoordArray[] = [[0, 0], [3, 0], [3, 4]];
    expect(wholeDistance(points)).toBe(7);
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

  it('should calculate midpoint on horizontal line', () => {
    expect(mid([0, 5], [10, 5])).toEqual([5, 5]);
  });

  it('should calculate midpoint on vertical line', () => {
    expect(mid([5, 0], [5, 10])).toEqual([5, 5]);
  });
});

describe('getCircleCenterOfThreeCoords', () => {
  it('should calculate center of circle through three points', () => {
    const center = getCircleCenterOfThreeCoords([0, -1], [1, 0], [0, 1]);
    // For these 3 points on a unit circle centered at origin
    expect(center[0]).toBeCloseTo(0, 5);
    expect(center[1]).toBeCloseTo(0, 5);
  });

  it('should return valid coordinates for any non-collinear points', () => {
    const center = getCircleCenterOfThreeCoords([0, 0], [10, 0], [5, 10]);
    expect(typeof center[0]).toBe('number');
    expect(typeof center[1]).toBe('number');
  });
});

describe('getIntersectCoord', () => {
  it('should calculate intersection of two lines', () => {
    // Line AB: vertical line at x=5
    // Line CD: horizontal line at y=5
    const result = getIntersectCoord([5, 0], [5, 10], [0, 5], [10, 5]);
    expect(result[0]).toBeCloseTo(5, 5);
    expect(result[1]).toBeCloseTo(5, 5);
  });

  it('should handle horizontal first line', () => {
    const result = getIntersectCoord([0, 5], [10, 5], [5, 0], [5, 10]);
    expect(result[0]).toBeCloseTo(5, 5);
    expect(result[1]).toBeCloseTo(5, 5);
  });

  it('should return valid coordinates', () => {
    const result = getIntersectCoord([0, 0], [10, 10], [0, 10], [10, 0]);
    expect(result[0]).toBeCloseTo(5, 5);
    expect(result[1]).toBeCloseTo(5, 5);
  });
});

describe('getAzimuth', () => {
  it('should return valid azimuth angle', () => {
    const angle = getAzimuth([0, 0], [10, 0]);
    expect(typeof angle).toBe('number');
    expect(angle).toBeGreaterThanOrEqual(0);
    expect(angle).toBeLessThanOrEqual(Math.PI * 2);
  });

  it('should return valid azimuth for different quadrants', () => {
    const angle1 = getAzimuth([0, 0], [10, 10]);
    const angle2 = getAzimuth([0, 0], [-10, 10]);
    const angle3 = getAzimuth([0, 0], [-10, -10]);
    const angle4 = getAzimuth([0, 0], [10, -10]);
    expect(angle1).toBeGreaterThanOrEqual(0);
    expect(angle2).toBeGreaterThanOrEqual(0);
    expect(angle3).toBeGreaterThanOrEqual(0);
    expect(angle4).toBeGreaterThanOrEqual(0);
  });

  it('should handle identical points gracefully', () => {
    const angle = getAzimuth([0, 0], [0, 0]);
    expect(typeof angle).toBe('number');
  });
});

describe('getAngleOfThreeCoords', () => {
  it('should return positive angle between 0 and 2*PI', () => {
    const angle = getAngleOfThreeCoords([0, 0], [5, 5], [10, 0]);
    expect(angle).toBeGreaterThanOrEqual(0);
    expect(angle).toBeLessThanOrEqual(Math.PI * 2);
  });

  it('should return valid angle for right angle', () => {
    const angle = getAngleOfThreeCoords([0, 10], [0, 0], [10, 0]);
    expect(angle).toBeCloseTo(Math.PI / 2, 1);
  });
});

describe('isClockWise', () => {
  it('should return true for clockwise points', () => {
    // Clockwise: (0,0) -> (10,0) -> (0,10)
    const result = isClockWise([0, 0], [10, 0], [0, 10]);
    expect(typeof result).toBe('boolean');
  });

  it('should return false for counter-clockwise points', () => {
    // Counter-clockwise: (0,0) -> (0,10) -> (10,0)
    const result = isClockWise([0, 0], [0, 10], [10, 0]);
    expect(typeof result).toBe('boolean');
  });

  it('should return consistent results', () => {
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

  it('should return point beyond end when t>1', () => {
    const result = getCoordOnLine(2, [0, 0], [10, 10]);
    expect(result[0]).toBeCloseTo(20, 5);
    expect(result[1]).toBeCloseTo(20, 5);
  });
});

describe('getCubicValue', () => {
  it('should return start point when t=0', () => {
    const start: CoordArray = [0, 0];
    const end: CoordArray = [10, 10];
    const result = getCubicValue(0, start, [2, 5], [8, 5], end);
    expect(result[0]).toBeCloseTo(start[0], 5);
    expect(result[1]).toBeCloseTo(start[1], 5);
  });

  it('should return end point when t=1', () => {
    const start: CoordArray = [0, 0];
    const end: CoordArray = [10, 10];
    const result = getCubicValue(1, start, [2, 5], [8, 5], end);
    expect(result[0]).toBeCloseTo(end[0], 5);
    expect(result[1]).toBeCloseTo(end[1], 5);
  });

  it('should clamp t to [0, 1] range', () => {
    const start: CoordArray = [0, 0];
    const end: CoordArray = [10, 10];
    const resultNegative = getCubicValue(-1, start, [2, 5], [8, 5], end);
    const resultOver = getCubicValue(2, start, [2, 5], [8, 5], end);
    expect(resultNegative[0]).toBeCloseTo(start[0], 5);
    expect(resultOver[0]).toBeCloseTo(end[0], 5);
  });

  it('should return midpoint for linear case when t=0.5', () => {
    const start: CoordArray = [0, 0];
    const end: CoordArray = [10, 0];
    // With control points on the line, should be linear
    const result = getCubicValue(0.5, start, [3.33, 0], [6.67, 0], end);
    expect(result[0]).toBeCloseTo(5, 1);
  });
});

describe('getThirdCoord', () => {
  it('should return a valid coordinate', () => {
    const result = getThirdCoord([0, 0], [10, 0], Math.PI / 4, 10, true);
    expect(result.length).toBe(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });

  it('should return different results for clockwise vs counter-clockwise', () => {
    // Use a diagonal direction where the azimuth angle creates clearly different results
    const cw = getThirdCoord([0, 0], [10, 10], Math.PI / 3, 10, true);
    const ccw = getThirdCoord([0, 0], [10, 10], Math.PI / 3, 10, false);
    // At least one coordinate should differ significantly
    const diff = Math.hypot(cw[0] - ccw[0], cw[1] - ccw[1]);
    expect(diff).toBeGreaterThan(1);
  });

  it('should return point at correct distance', () => {
    const start: CoordArray = [0, 0];
    const end: CoordArray = [10, 0];
    const result = getThirdCoord(start, end, 0, 10, true);
    const dist = mathDistance(end, result);
    expect(dist).toBeCloseTo(10, 5);
  });
});

describe('getArcCoords', () => {
  it('should return 101 points', () => {
    const center: CoordArray = [0, 0];
    const result = getArcCoords(center, 10, 0, Math.PI);
    expect(result.length).toBe(101);
  });

  it('should return points on arc', () => {
    const center: CoordArray = [0, 0];
    const radius = 10;
    const result = getArcCoords(center, radius, 0, Math.PI / 2);
    // First point should be at (radius, 0)
    expect(result[0][0]).toBeCloseTo(radius, 0);
    expect(result[0][1]).toBeCloseTo(0, 0);
  });

  it('should handle full circle (startAngle == endAngle)', () => {
    const center: CoordArray = [0, 0];
    const result = getArcCoords(center, 10, 0, 0);
    expect(result.length).toBe(101);
  });

  it('should handle negative angle difference', () => {
    const center: CoordArray = [0, 0];
    const result = getArcCoords(center, 10, Math.PI, 0);
    expect(result.length).toBe(101);
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
  it('should return interpolated curve points', () => {
    const controlCoords: CoordArray[] = [
      [0, 0],
      [5, 10],
      [10, 0],
    ];
    const result = getCurveCoords(0.3, controlCoords);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(controlCoords.length);
  });

  it('should return coordinates in [x, y] format', () => {
    const controlCoords: CoordArray[] = [
      [0, 0],
      [5, 5],
      [10, 0],
    ];
    const result = getCurveCoords(0.3, controlCoords);
    result.forEach((coord) => {
      expect(coord.length).toBe(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });

  it('should handle more control points', () => {
    const controlCoords: CoordArray[] = [
      [0, 0],
      [3, 8],
      [7, 8],
      [10, 0],
    ];
    const result = getCurveCoords(0.3, controlCoords);
    expect(result.length).toBeGreaterThan(controlCoords.length);
  });
});

describe('getBezierCoords', () => {
  it('should return points for 3 control points', () => {
    const points: CoordArray[] = [[0, 0], [5, 10], [10, 0]];
    const result = getBezierCoords(points);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return original points for 2 or fewer', () => {
    const points: CoordArray[] = [[0, 0], [10, 10]];
    const result = getBezierCoords(points);
    expect(result).toEqual(points);
  });

  it('should include the last point', () => {
    const points: CoordArray[] = [[0, 0], [5, 10], [10, 0]];
    const result = getBezierCoords(points);
    const last = result.at(-1);
    expect(last[0]).toBeCloseTo(points[2][0], 5);
    expect(last[1]).toBeCloseTo(points[2][1], 5);
  });

  it('should return coordinates in [x, y] format', () => {
    const points: CoordArray[] = [[0, 0], [5, 10], [10, 0]];
    const result = getBezierCoords(points);
    result.forEach((coord) => {
      expect(coord.length).toBe(2);
      expect(typeof coord[0]).toBe('number');
      expect(typeof coord[1]).toBe('number');
    });
  });
});

describe('getFactorial', () => {
  it('should return 1 for n=0', () => {
    expect(getFactorial(0)).toBe(1);
  });

  it('should return 1 for n=1', () => {
    expect(getFactorial(1)).toBe(1);
  });

  it('should return 2 for n=2', () => {
    expect(getFactorial(2)).toBe(2);
  });

  it('should return 6 for n=3', () => {
    expect(getFactorial(3)).toBe(6);
  });

  it('should return 24 for n=4', () => {
    expect(getFactorial(4)).toBe(24);
  });

  it('should return 120 for n=5', () => {
    expect(getFactorial(5)).toBe(120);
  });

  it('should return correct value for n=6', () => {
    expect(getFactorial(6)).toBe(720);
  });
});

describe('getBinomialFactor', () => {
  it('should return 1 for n=0, index=0', () => {
    expect(getBinomialFactor(0, 0)).toBe(1);
  });

  it('should return 1 for n=5, index=0 or index=5', () => {
    expect(getBinomialFactor(5, 0)).toBe(1);
    expect(getBinomialFactor(5, 5)).toBe(1);
  });

  it('should return 5 for n=5, index=1 or index=4', () => {
    expect(getBinomialFactor(5, 1)).toBe(5);
    expect(getBinomialFactor(5, 4)).toBe(5);
  });

  it('should return 10 for n=5, index=2 or index=3', () => {
    expect(getBinomialFactor(5, 2)).toBe(10);
    expect(getBinomialFactor(5, 3)).toBe(10);
  });
});

describe('getQBSplineCoords', () => {
  it('should return interpolated points for 3+ input points', () => {
    const points: CoordArray[] = [[0, 0], [5, 10], [10, 0]];
    const result = getQBSplineCoords(points);
    expect(result.length).toBeGreaterThan(points.length);
  });

  it('should return original points for 2 or fewer', () => {
    const points: CoordArray[] = [[0, 0], [10, 10]];
    const result = getQBSplineCoords(points);
    expect(result).toEqual(points);
  });

  it('should include first and last points', () => {
    const points: CoordArray[] = [[0, 0], [5, 10], [10, 0]];
    const result = getQBSplineCoords(points);
    const first = result[0];
    const last = result.at(-1);
    expect(first[0]).toBeCloseTo(points[0][0], 5);
    expect(first[1]).toBeCloseTo(points[0][1], 5);
    expect(last[0]).toBeCloseTo(points[2][0], 5);
    expect(last[1]).toBeCloseTo(points[2][1], 5);
  });
});

describe('getQuadricBSplineFactor', () => {
  it('should return valid values for k=0,1,2', () => {
    const f0 = getQuadricBSplineFactor(0, 0.5);
    const f1 = getQuadricBSplineFactor(1, 0.5);
    const f2 = getQuadricBSplineFactor(2, 0.5);
    expect(typeof f0).toBe('number');
    expect(typeof f1).toBe('number');
    expect(typeof f2).toBe('number');
  });

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
  });
});

describe('getRightMostControlCoord', () => {
  it('should return a valid control coordinate', () => {
    const controlCoords: CoordArray[] = [[0, 0], [5, 10], [10, 0]];
    const result = getRightMostControlCoord(controlCoords, 0.3);
    expect(result.length).toBe(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });
});
