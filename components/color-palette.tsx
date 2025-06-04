import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ColorPalette() {
  const colorGroups = [
    {
      name: "Primary (Pink)",
      description: "Used for primary actions, buttons, and important UI elements",
      colors: [
        { name: "movie-pink-50", hex: "#fdf2fa" },
        { name: "movie-pink-100", hex: "#fbe6f6" },
        { name: "movie-pink-200", hex: "#f9cced" },
        { name: "movie-pink-300", hex: "#f5a3df" },
        { name: "movie-pink-400", hex: "#f06dcb" },
        { name: "movie-pink-500", hex: "#E83FB8", main: true },
        { name: "movie-pink-600", hex: "#d71d9e" },
        { name: "movie-pink-700", hex: "#b91380" },
        { name: "movie-pink-800", hex: "#991368" },
        { name: "movie-pink-900", hex: "#801457" },
      ],
    },
    {
      name: "Secondary (Purple)",
      description: "Used for secondary actions, highlights, and accents",
      colors: [
        { name: "movie-purple-50", hex: "#f3effb" },
        { name: "movie-purple-100", hex: "#e9e0f8" },
        { name: "movie-purple-200", hex: "#d4c1f1" },
        { name: "movie-purple-300", hex: "#b89ae6" },
        { name: "movie-purple-400", hex: "#9c6dd9" },
        { name: "movie-purple-500", hex: "#8548cc" },
        { name: "movie-purple-600", hex: "#6B46C1", main: true },
        { name: "movie-purple-700", hex: "#5a2ea6" },
        { name: "movie-purple-800", hex: "#4a2889" },
        { name: "movie-purple-900", hex: "#3d2370" },
      ],
    },
    {
      name: "Dark Shades",
      description: "Used for backgrounds, text, and UI elements in dark mode",
      colors: [
        { name: "movie-dark-500", hex: "#5f6672" },
        { name: "movie-dark-600", hex: "#4a505c" },
        { name: "movie-dark-700", hex: "#3d424b" },
        { name: "movie-dark-800", hex: "#2D2A3F", main: true },
        { name: "movie-dark-900", hex: "#1E1A2C", main: true },
        { name: "movie-dark-950", hex: "#121118" },
      ],
    },
  ]

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">MovieStream Color Palette</h2>
        <p className="text-muted-foreground">
          A comprehensive color system based on the MovieStream logo, featuring vibrant purples and pinks.
        </p>
      </div>

      <div className="grid gap-6">
        {colorGroups.map((group) => (
          <Card key={group.name}>
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {group.colors.map((color) => (
                  <div key={color.name} className="space-y-1.5">
                    <div
                      className={`h-16 rounded-md ${color.main ? "ring-2 ring-offset-2 ring-black/10" : ""}`}
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="px-1">
                      <div className="text-sm font-medium">{color.name}</div>
                      <div className="text-xs text-muted-foreground">{color.hex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>How to use the color palette in your application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#E83FB8] text-white px-4 py-2 rounded-md">Primary Button</button>
                <button className="bg-[#6B46C1] text-white px-4 py-2 rounded-md">Secondary Button</button>
                <button className="bg-white border border-[#E83FB8] text-[#E83FB8] px-4 py-2 rounded-md">
                  Outline Button
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Text Colors</h3>
              <div className="space-y-2">
                <p className="text-[#E83FB8] font-bold">Primary Text</p>
                <p className="text-[#6B46C1] font-bold">Secondary Text</p>
                <p className="text-[#2D2A3F]">Dark Text</p>
                <p className="bg-[#1E1A2C] text-white p-2 rounded-md">Light Text on Dark Background</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cards & Containers</h3>
              <div className="bg-gradient-to-br from-[#6B46C1] to-[#E83FB8] text-white p-4 rounded-md">
                Gradient Background
              </div>
              <div className="bg-[#f3effb] border border-[#d4c1f1] p-4 rounded-md">Light Container</div>
              <div className="bg-[#2D2A3F] text-white p-4 rounded-md">Dark Container</div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Accents & Highlights</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#E83FB8]"></div>
                  <span>Primary Accent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#6B46C1]"></div>
                  <span>Secondary Accent</span>
                </div>
                <div className="border-l-4 border-[#E83FB8] pl-2">Highlighted Content</div>
                <div className="bg-[#f9cced] text-[#991368] p-2 rounded-md">Subtle Highlight</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
