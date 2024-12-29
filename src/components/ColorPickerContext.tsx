import {
  tinycolor,
  _rgbToHsv as _toHsv,
  hsvToRgb as _toRgb,
} from "@/lib/utils";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

interface ColorPickerContextType {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  showPopover: boolean;
  setShowPopover: Dispatch<SetStateAction<boolean>>;
  hue: number;
  setHue: Dispatch<SetStateAction<number>>;
  saturation: number;
  setSaturation: Dispatch<SetStateAction<number>>;
  brightness: number;
  setBrightness: Dispatch<SetStateAction<number>>;
  alpha: number;
  setAlpha: Dispatch<SetStateAction<number>>;
  rgbaValues: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  setRgbaValues: Dispatch<
    SetStateAction<{
      r: number;
      g: number;
      b: number;
      a: number;
    }>
  >;
  colorHistory: string[];
  setColorHistory: Dispatch<SetStateAction<string[]>>;
  popoverStyle: {
    top: string;
    left: string;
  };
  setPopoverStyle: Dispatch<
    SetStateAction<{
      top: string;
      left: string;
    }>
  >;
  popoverRef: React.RefObject<HTMLDivElement>;
  saturationRef: React.RefObject<HTMLDivElement>;
  hueRef: React.RefObject<HTMLDivElement>;
  alphaRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  hsvToRgb: (h: number, s: number, v: number) => [number, number, number];
  rgbToHsv: (r: number, g: number, b: number) => [number, number, number];
}

const ColorPickerContext = createContext<ColorPickerContextType | undefined>(
  undefined
);

export const ColorPickerProvider: React.FC<{
  children: React.ReactNode;
  color?: string;
  setColor?: Dispatch<SetStateAction<string>>;
}> = ({ children, color,setColor }) => {
  let defColor = (tinycolor(color || "").isValid ? color : "rgba(255, 0, 0, 1)") as string;
  const [_color, _setColor] = useState(defColor);
  if (!tinycolor(color || "").isValid) typeof setColor === "function" && setColor("rgba(255,0,0,1)");
  const [showPopover, setShowPopover] = useState(false);
  const __set = typeof setColor === "function" && typeof color === "string" && tinycolor(color).isValid ? setColor : _setColor;
  const __get = typeof setColor === "function" && typeof color === "string" && tinycolor(color).isValid  ? color : _color;
  const [hsv, setHSV] = useState(tinycolor(defColor)?.hsv || { h: 0, s: 1, v: 1 });
  const [hue, setHue] = useState(hsv?.h);
  const [saturation, setSaturation] = useState(hsv?.s);
  const [brightness, setBrightness] = useState(hsv?.v);
  const [rgbaValues, setRgbaValues] = useState(
    tinycolor(defColor).rgba || { r: 255, g: 0, b: 0, a: 1 }
  );
  const [alpha, setAlpha] = useState(rgbaValues.a);
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [popoverStyle, setPopoverStyle] = useState({
    top: "3rem",
    left: "0",
  });

  const popoverRef = useRef<HTMLDivElement>(null);
  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hsvToRgb = useCallback(_toRgb, []);
  const rgbToHsv = useCallback(_toHsv, []);

  return (
    <ColorPickerContext.Provider
      value={{
        color : __get,
        setColor : __set,
        alpha,
        brightness,
        colorHistory,
        hue,
        popoverStyle,
        rgbaValues,
        saturation,
        setAlpha,
        setBrightness,
        setColorHistory,
        setHue,
        setPopoverStyle,
        setRgbaValues,
        setSaturation,
        setShowPopover,
        showPopover,
        alphaRef,
        containerRef,
        hueRef,
        popoverRef,
        saturationRef,
        hsvToRgb,
        rgbToHsv,
      }}
    >
      {children}
    </ColorPickerContext.Provider>
  );
};

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);
  if (!context) {
    throw new Error("useColorPicker must be used within a ColorPickerProvider");
  }
  return context;
};