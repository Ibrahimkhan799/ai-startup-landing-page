import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const colorRegex = /#([0-9a-fA-F]{3}){1,2}([0-9a-fA-F]{2})?|rgb(a?)\((\d{1,3}\s*,\s*){2}\d{1,3}(\s*,\s*(0(\.\d+)?|\.\d+|1(\.0+)?|\d+(\.\d+)?%))?\)|hsla?\(\s*(\d{1,3})\s*\,\s*(\d{1,3})%\s*\,\s*\s*(\d{1,3})%\s*\,?\s*(\d{1,3}\.?\d+|\d{1,3}\s*)?\)|hwb\((\d+(\.\d+)?(deg|rad|turn)?\s+){2}(\d+(\.\d+)?%)\s*(\/\s*(0(\.\d+)?|\.\d+|1(\.0+)?|\d+(\.\d+)?%))?\)/i;
const hslRegex = /^hsla?\(\s*(\d{1,3})\s*\,\s*(\d{1,3})%\s*\,\s*\s*(\d{1,3})%\s*\,?\s*(\d{1,3}\.?\d+|\d{1,3}\s*)?\)/i

export function tinycolor(color: string) {
  if (
    !colorRegex.test(color)
  )
    return { isValid: false };
  if (hslRegex.test(color)){
    let [,h,s,l,a = 1] = color.match(hslRegex) as RegExpMatchArray;
    let {r,g,b} = hslToRgb(parseInt(h),parseInt(s),parseInt(l));
    color = `rgba(${r},${g},${b},${a})`;
  }
  let [r, g, b, a = 1] = color.match(/\d+(\.\d+)?/g) as RegExpMatchArray;
  let hsv = _rgbToHsv(parseFloat(r), parseFloat(g), parseFloat(b));
  return {
    hsv: {
      h: hsv[0],
      s: hsv[1],
      v: hsv[2],
    },
    rgba: {
      r: parseFloat(r),
      g: parseFloat(g),
      b: parseFloat(b),
      a: parseFloat(a as string),
    },
    isValid: true,
  };
}

export const hsvToRgb = (
  h: number,
  s: number,
  v: number
): [number, number, number] => {
  // Ensure hue is between 0 and 360
  h = h % 360;
  if (h < 0) h += 360;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;
  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
};

export const _rgbToHsv = (
  r: number,
  g: number,
  b: number
): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff === 0) h = 0;
  else if (max === r) h = 60 * (((g - b) / diff) % 6);
  else if (max === g) h = 60 * ((b - r) / diff + 2);
  else if (max === b) h = 60 * ((r - g) / diff + 4);
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : diff / max;
  const v = max;

  return [h, s, v];
};

function hslToRgb(h : number, s : number, l : number) {
  // Convert H, S, L to the range of 0-1
  s /= 100;
  l /= 100;

  // Chroma is the intensity of the color
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  // Add the m to match the lightness level
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}