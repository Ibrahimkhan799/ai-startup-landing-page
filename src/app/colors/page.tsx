"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ColorPicker, {
  ColorPickerAlphaSlider,
  ColorPickerColorSpectrum,
  ColorPickerHistory,
  ColorPickerHueSlider,
  ColorPickerPopover,
  ColorPickerTrigger,
} from "@/components/colorPicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getColors } from "@/lib/api";
import { IoColorPaletteOutline } from "react-icons/io5";

interface ColorGroup {
  title: string;
  colors: string[];
}

const colorGroups: ColorGroup[] = [
  {
    title: "Primary Colors",
    colors: ["lightPrimary", "semiLightPrimary", "darkPrimary"],
  },
  {
    title: "Shadow Colors",
    colors: [
      "shadowPrimary",
      "shadowPrimaryHalf",
      "shadowPrimaryHalfQuarter",
      "shadowPrimaryQuarter",
    ],
  },
  {
    title: "Secondary Colors",
    colors: ["lightSecondaryHalf", "lightSecondary", "darkSecondary"],
  },
  {
    title: "Base Colors",
    colors: ["primary", "secondary"],
  },
];

export default function ColorSettings() {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getColors();
      setColors(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleColorChange = (key: string, value: string) => {
    setColors({ ...colors, [key]: value });
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/update-colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(colors),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error updating colors.");
      }

      toast.success("Colors updated successfully");
    } catch (error) {
      console.error("Error saving colors:", error);
      toast.error("Failed to update colors");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-2 text-muted-foreground">
          <IoColorPaletteOutline className="h-5 w-5" />
          <span>Loading color settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Color Settings</h1>
        <p className="text-muted-foreground">
          Customize the color scheme of your application
        </p>
      </div>

      <div className="space-y-6">
        {colorGroups.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className="text-lg">{group.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {group.colors.map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{key}</span>
                    <ColorPicker color={colors[key]} onChange={(color)=> handleColorChange(key,color)}>
                      <ColorPickerTrigger
                        className="border-none p-0 w-fit"
                        render={(color) => (
                          <div
                            className="h-6 w-6 rounded-md"
                            style={{ background: color }}
                          ></div>
                        )}
                      />
                      <ColorPickerPopover className="bg-stone-800 border-border">
                        <div className="w-full flex flex-row gap-1.5">
                          <ColorPickerColorSpectrum markerClass="border-[3px]" />
                          <ColorPickerHueSlider
                            dir="vertical"
                            markerClass="bg-transparent border-2 border-stone-50"
                          />
                          <ColorPickerAlphaSlider className="border border-border" dir="vertical" />
                        </div>
                        <ColorPickerHistory />
                      </ColorPickerPopover>
                    </ColorPicker>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={saveChanges} disabled={saving}>
          {saving ? "Saving changes..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
