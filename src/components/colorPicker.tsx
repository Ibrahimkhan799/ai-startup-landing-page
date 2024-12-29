"use client";
import { _rgbToHsv as _toHsv, hsvToRgb as _toRgb, cn } from "@/lib/utils";
import React, { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { ColorPickerProvider, useColorPicker } from "./ColorPickerContext";

let HISTORY_LENGTH = 14;

interface ColorProps {
  historyLength?: number;
  color?: string;
  onChange?:(e: string) => void;
  onColorPick?:(e: string) => void;
  setColor?: Dispatch<SetStateAction<string>>;
  dir?: "horizontal" | "vertical";
  children : React.ReactNode;
}

const ColorPicker = (props: ColorProps) => {
  return (
    <ColorPickerProvider setColor={props.setColor} color={props.color}>
      <_ColorPicker {...props} />
    </ColorPickerProvider>
  );
};

const _ColorPicker = ({
  historyLength = HISTORY_LENGTH,
  onChange,
  onColorPick,
  children,
}: ColorProps) => {
  const {
    alpha,
    brightness,
    color,
    hue,
    saturation,
    setAlpha,
    setBrightness,
    setColor,
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
  } = useColorPicker();

  useEffect(() => {
    if (onChange) onChange(color);
  }, [color]);

  // Update color from HSV and alpha values
  const updateColor = useCallback(() => {
    const [r, g, b] = hsvToRgb(hue, saturation, brightness);
    const newColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    setColor(newColor);
    setRgbaValues({ r, g, b, a: alpha });
  }, [hue, saturation, brightness, alpha, hsvToRgb]);

  // Add color to history
  const addToHistory = useCallback((newColor: string) => {
    setColorHistory((prev) => {
      const filtered = prev.filter((c) => c !== newColor);
      return [newColor, ...filtered].slice(0, historyLength);
    });
  }, []);

  useEffect(() => {
    updateColor();
  }, [hue, saturation, brightness, alpha, updateColor]);

  // Handle saturation/brightness area interaction
  const handleSaturationChange = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!saturationRef.current) return;
      const rect = saturationRef.current.getBoundingClientRect();

      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

      setSaturation(x / rect.width);
      setBrightness(1 - y / rect.height);
    },
    []
  );

  // Handle hue slider interaction
  const handleHueChange = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!hueRef.current) return;
    let dir = hueRef.current.dataset.dir as "vertical" | "horizontal";
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    if (dir === "horizontal") setHue((x / rect.width) * 360);
    else setHue((y / rect.height) * 360);
  }, []);

  // Handle alpha slider interaction
  const handleAlphaChange = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!alphaRef.current) return;
    let dir = alphaRef.current.dataset.dir as "vertical" | "horizontal";
    const rect = alphaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    if (dir === "horizontal") setAlpha(Number((x / rect.width).toFixed(2)));
    else setAlpha(Number((y / rect.height).toFixed(2)));
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Save color to history when popover closes
  useEffect(() => {
    if (!showPopover) {
      addToHistory(color);
      if (onColorPick) onColorPick(color);
    }
  }, [showPopover, addToHistory]);

  // Mouse drag handling
  useEffect(() => {
    let isDragging = false;
    let currentTarget: "saturation" | "hue" | "alpha" | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      document.documentElement.style.setProperty("pointer-events","none");
      document.documentElement.style.setProperty("user-select","none");
      e.preventDefault();
      if (currentTarget === "saturation") handleSaturationChange(e);
      if (currentTarget === "hue") handleHueChange(e);
      if (currentTarget === "alpha") handleAlphaChange(e);
    };

    const handleMouseUp = () => {
      document.documentElement.style.setProperty("pointer-events",null);
      document.documentElement.style.setProperty("user-select", null);
      isDragging = false;
      currentTarget = null;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".saturation-area")) {
        isDragging = true;
        currentTarget = "saturation";
        handleSaturationChange(e);
      } else if (target.closest(".hue-slider")) {
        isDragging = true;
        currentTarget = "hue";
        handleHueChange(e);
      } else if (target.closest(".alpha-slider")) {
        isDragging = true;
        currentTarget = "alpha";
        handleAlphaChange(e);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleSaturationChange, handleHueChange, handleAlphaChange]);

  // Calculate popover position
  const updatePopoverPosition = useCallback(() => {
    if (!containerRef.current || !popoverRef.current) return;

    const triggerRect = containerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 12; // Space from viewport edges

    let left = 0;
    let top = triggerRect.height + padding;

    // Check horizontal position
    if (triggerRect.left + popoverRect.width > viewportWidth - padding) {
      // Align to right if not enough space on the right
      left = Math.min(
        0,
        viewportWidth - triggerRect.left - popoverRect.width - padding
      );
    }

    // Check vertical position
    if (triggerRect.bottom + popoverRect.height > viewportHeight - padding) {
      // Show above the trigger if not enough space below
      top = -popoverRect.height - padding;
    }

    setPopoverStyle({
      top: `${top}px`,
      left: `${left}px`,
    });
  }, []);

  // Update position on show and window resize
  useEffect(() => {
    if (showPopover) {
      updatePopoverPosition();
      window.addEventListener("resize", updatePopoverPosition);
      window.addEventListener("scroll", updatePopoverPosition);
    }
    return () => {
      window.removeEventListener("resize", updatePopoverPosition);
      window.removeEventListener("scroll", updatePopoverPosition);
    };
  }, [showPopover, updatePopoverPosition]);

  return (
    <div ref={containerRef} className={cn("relative")}>
      {children}
    </div>
  );
};

interface ColorPickerComponentsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  markerClass?: string;
}

export const ColorPickerInputs = ({
  className,
  style,
  ...props
}: ColorPickerComponentsProps) => {
  const {
    rgbaValues,
    setRgbaValues,
    setAlpha,
    rgbToHsv,
    setHue,
    setSaturation,
    setBrightness,
  } = useColorPicker();
  // Handle direct RGB input
  const handleRgbaInput = useCallback(
    (value: number, channel: "r" | "g" | "b" | "a") => {
      const newValues = { ...rgbaValues, [channel]: value };
      setRgbaValues(newValues);

      if (channel === "a") {
        setAlpha(value);
      } else {
        const [h, s, v] = rgbToHsv(newValues.r, newValues.g, newValues.b);
        setHue(h);
        setSaturation(s);
        setBrightness(v);
      }
    },
    [rgbaValues, rgbToHsv]
  );
  return (
    <div className={cn("mt-2 grid grid-cols-4 gap-2", className)} {...props}>
      {["r","g","b"].map((v,i)=>(
          <div className="space-y-1" key={v + i}>
          <label className="block text-xs text-gray-500">{v.toUpperCase()}</label>
          <input
            type="number"
            min="0"
            max="255"
            value={rgbaValues[v as keyof typeof rgbaValues]}
            onChange={(e) =>
              handleRgbaInput(
                Math.min(255, Math.max(0, Number(e.target.value))),
                v as keyof typeof rgbaValues
              )
            }
            className="w-full rounded border px-2 py-1 text-sm"
          />
       </div>
      ))}
      <div className="space-y-1">
        <label className="block text-xs text-gray-500">A</label>
        <input
          type="number"
          min="0"
          max="1"
          step="0.01"
          value={rgbaValues.a}
          onChange={(e) =>
            handleRgbaInput(
              Math.min(1, Math.max(0, Number(e.target.value))),
              "a"
            )
          }
          className="w-full rounded border px-2 py-1 text-sm"
        />
      </div>
    </div>
  );
};

export const ColorPickerHistory = ({
  className,
  style,
  label,
  ...props
}: ColorPickerComponentsProps & { label?: React.ReactNode }) => {
  const {
    colorHistory,
    setHue,
    rgbToHsv,
    setSaturation,
    setBrightness,
    setAlpha,
  } = useColorPicker();
  return (
    <div className={cn("mt-4", className)} {...props}>
      <label className="mb-2 block text-xs text-neutral-200">
        {label || "History"}
      </label>
      <div className="flex flex-wrap gap-2">
        {colorHistory.map((historicColor, index) => (
          <button
            key={index}
            className="relative h-6 w-6 rounded-md border shadow-sm transition-transform hover:scale-110"
            onClick={() => {
              const match = historicColor.match(
                /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
              );
              if (match) {
                const [r, g, b, a = "1"] = match.slice(1).map(Number);
                const [h, s, v] = rgbToHsv(r, g, b);
                setHue(h);
                setSaturation(s);
                setBrightness(v);
                setAlpha(Number(a));
              }
            }}
          >
            <div
              className="absolute inset-0 rounded-md"
              style={{ backgroundColor: historicColor }}
            />
            <div
              className="absolute inset-0 rounded-md"
              style={{
                backgroundImage:
                  'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")',
                backgroundPosition: "left center",
                opacity: 0.3,
                zIndex: -1,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export const ColorPickerColorSpectrum = ({
  className,
  style,
  markerClass,
  ...props
}: ColorPickerComponentsProps) => {
  const { saturationRef, hue, saturation, brightness, color } =
    useColorPicker();
  return (
    <div
      ref={saturationRef}
      className={cn(
        "mb-2 h-40 w-56 cursor-crosshair rounded-lg",
        className,
        "saturation-area relative"
      )}
      style={{
        background: `
        linear-gradient(to right, #fff 0%, hsl(${hue}, 100%, 50%) 100%),
        linear-gradient(to bottom, transparent 0%, #000 100%)
      `,
        backgroundBlendMode: "multiply",
      }}
      {...props}
    >
      <div
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 transform border-2 border-white shadow-sm",
          markerClass,
          "h-3 w-3 rounded-full"
        )}
        style={{
          left: `${saturation * 100}%`,
          top: `${(1 - brightness) * 100}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};

export const ColorPickerHueSlider = ({
  className,
  style,
  markerClass,
  dir,
  ...props
}: ColorPickerComponentsProps & { dir?: "vertical" | "horizontal" }) => {
  const { hueRef, hue } = useColorPicker();

  return (
    <div
      ref={hueRef}
      className={cn(
        "cursor-pointer rounded-lg mb-2",
        dir === "vertical" ? "w-3 h-40" : "h-4 w-56",
        className,
        "hue-slider relative"
      )}
      data-dir={dir || "horizontal"}
      style={{
        background: `linear-gradient(to ${
          dir === "vertical" ? "bottom" : "right"
        }, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)`,
      }}
      {...props}
    >
      <div
        className={cn(
          "rounded border border-gray-200 bg-white shadow-sm",
          dir === "vertical"
            ? "w-full h-1 -translate-y-1/2 transform"
            : "h-full w-1 -translate-x-1/2 transform",
          markerClass,
          "absolute"
        )}
        style={{
          left: dir === "vertical" ? undefined : `${(hue / 360) * 100}%`,
          top: dir === "vertical" ? `${(hue / 360) * 100}%` : undefined,
        }}
      />
    </div>
  );
};

export const ColorPickerAlphaSlider = ({
  className,
  style,
  dir,
  markerClass,
  ...props
}: ColorPickerComponentsProps & { dir?: "vertical" | "horizontal" }) => {
  const { alphaRef, hsvToRgb, hue, saturation, brightness, alpha } =
    useColorPicker();
  return (
    <div
      ref={alphaRef}
      className={cn(
        "cursor-pointer rounded-lg",
        dir === "vertical" ? "w-3 h-40" : "h-4 w-56",
        className,
        "alpha-slider relative"
      )}
      data-dir={dir || "horizontal"}
    >
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundImage:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")',
          backgroundPosition: "left center",
        }}
      />
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(to ${
            dir === "vertical" ? "bottom" : "right"
          }, rgba(${hsvToRgb(hue, saturation, brightness).join(
            ", "
          )}, 0) 0%, rgba(${hsvToRgb(hue, saturation, brightness).join(
            ", "
          )}, 1) 100%)`,
        }}
      />
      <div
        className={cn(
          "rounded border border-gray-200 bg-white shadow-sm",
          dir === "vertical" ? "w-full h-1 -translate-y-1/2 transform" : "h-full w-1 -translate-x-1/2 transform",
          markerClass,
          "absolute"
        )}
        style={{
          left: dir === "vertical" ? undefined : `${alpha * 100}%`,
          top: dir === "vertical" ? `${alpha * 100}%` : undefined,
        }}
      />
    </div>
  );
};

export const ColorPickerTrigger = ({
  className,
  children,
  render,
  ...props
}: ColorPickerComponentsProps & { render?: ((color: string) => React.ReactNode)}) => {
  const { setShowPopover, showPopover, color } = useColorPicker();
  return (
    <div
      className={cn(
        "relative p-3 cursor-pointer rounded-md border border-border",
        className
      )}
      onClick={() => setShowPopover(!showPopover)}
      {...props}
    >
      {typeof render === "function" ? render(color) : children}
    </div>
  );
};

export const ColorPickerColorShower = ({
  className,
  ...props
}: ColorPickerComponentsProps) => {
  const { color } = useColorPicker();
  return (
    <div
      className={cn("mt-2 w-full text-center text-primary", className)}
      {...props}
    >
      <span className="text-xs">{color}</span>
    </div>
  );
};

export const ColorPickerPopover = ({
  className,
  children,
  style,
  ...props
}: ColorPickerComponentsProps) => {
  const { showPopover, popoverRef, popoverStyle } = useColorPicker();
  return (
    <>
      {showPopover && (
        <div
          ref={popoverRef}
          className={cn(
            "left-0 top-8 z-50 rounded-lg border bg-white p-2 shadow-xl",
            className,
            "absolute"
          )}
          style={popoverStyle}
          {...props}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default ColorPicker;
