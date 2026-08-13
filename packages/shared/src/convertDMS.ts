import type { CommonCoord, CoordArray_ALT } from './types';
import { toCoord } from './toCoord';

export type DMSCoord = [longitude: string, latitude: string, height?: number];

/**
 * Convert degrees to DMS (Degrees Minutes Seconds) format string
 *
 * @param degrees The angle value
 * @param precision The number of decimal places to retain for the seconds, defaults to 3
 * @returns A DMS formatted string in the format: degrees° minutes′ seconds″
 */
export function dmsEncode(degrees: number, precision = 3): string {
  // Round the total seconds once so float errors (e.g. 0.5125 producing 44.999″) and
  // carry-over into minutes/degrees are handled in a single step
  const totalSeconds = Number((Math.abs(degrees) * 3600).toFixed(precision));
  const d = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Number((totalSeconds % 60).toFixed(precision));
  return `${d}°${m}′${s}″`;
}

/**
 * Decode a DMS (Degrees Minutes Seconds) formatted string to a decimal angle value
 *
 * @param dmsCode DMS formatted string, e.g. "120°30′45″N"
 * @returns The decoded decimal angle value, or 0 if decoding fails
 */
export function dmsDecode(dmsCode: string) {
  const [dd, msStr] = dmsCode.split('°') ?? [];
  const [mm, sStr] = msStr?.split('′') ?? [];
  const ss = sStr?.split('″')[0];

  const d = Number(dd) || 0;
  const m = (Number(mm) || 0) / 60;
  const s = (Number(ss) || 0) / 60 / 60;
  const degrees = d + m + s;
  if (degrees === 0) {
    return 0;
  }
  else {
    let res = degrees;
    // South, West are negative numbers
    if (['W', 'w', 'S', 's'].includes(dmsCode.at(-1)!)) {
      res = -res;
    }
    return res;
  }
}

/**
 * Convert latitude and longitude coordinates to degrees-minutes-seconds format
 *
 * @param position The latitude and longitude coordinates
 * @param precision The number of decimal places to retain for 'seconds', default is 3
 * @returns Returns the coordinates in degrees-minutes-seconds format, or undefined if the conversion fails
 */
export function degreesToDms(position: CommonCoord, precision = 3): DMSCoord | undefined {
  const coord = toCoord(position, { alt: true });
  if (!coord) {
    return;
  }
  const [longitude, latitude, height] = coord;
  const x = dmsEncode(longitude, precision);
  const y = dmsEncode(latitude, precision);
  return [`${x}${longitude > 0 ? 'E' : 'W'}`, `${y}${latitude > 0 ? 'N' : 'S'}`, height];
}

/**
 * Convert DMS (Degrees Minutes Seconds) format to decimal degrees for latitude and longitude coordinates
 *
 * @param dms The latitude or longitude coordinate in DMS format
 * @returns Returns the coordinate in decimal degrees format, or undefined if the conversion fails
 */
export function dmsToDegrees(dms: DMSCoord): CoordArray_ALT | undefined {
  const [x, y, height] = dms;
  const longitude = dmsDecode(x);
  const latitude = dmsDecode(y);
  return [longitude, latitude, (Number(height)) || 0];
}
