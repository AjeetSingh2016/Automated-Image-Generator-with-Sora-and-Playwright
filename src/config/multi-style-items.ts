export interface StyleConfig {
  name: string;
  description: string;
  prompt: string;
}

export interface MultiStyleItem {
  name: string;
  category: string;
  description: string;
  styles: StyleConfig[];
}

export const multiStyleItems: MultiStyleItem[] = [
  {
    name: "Warning Sign",
    category: "Basic Tools",
    description: "A standard warning sign with exclamation mark",
    styles: [
      {
        name: "Clay Style",
        description: "3D clay modeling style with soft textures",
        prompt: `
Generate a 1024 × 1024 px high-resolution, smooth, clay-style warning sign.
The icon must be handcrafted from modeling clay — using bright yellow and black colors that closely match real warning signs. Avoid using clay's default earthy tones.

🎨 Visual Style:
3D, soft, and slightly inflated — as if molded from real modeling clay
Rounded shapes with smooth, polished surfaces — no fingerprints, dents, or rough textures
Use soft, subtle shading to show depth — avoid outlines or harsh shadows

🧩 Design Guidelines:
Clearly depict a simplified and recognizable warning sign with exclamation mark
Use bright yellow for the main body and black for the exclamation mark
All parts must be connected and grounded — no floating elements
Avoid text or additional symbols

🌈 Color Palette:
Bright warning yellow for the main body
Deep black for the exclamation mark
Subtle shading to maintain the 3D effect

💡 Lighting & Shadow:
Top-left light source
Subtle drop shadow beneath the object
Smooth inner shading to emphasize the 3D form

📐 Output Specifications:
Centered layout
Transparent background
1024 × 1024 px resolution
PNG format with full alpha transparency
No labels or extra text`
      },
      {
        name: "Pixel Art",
        description: "Retro pixel art style with limited colors",
        prompt: `
Generate a 1024 × 1024 px high-resolution warning sign in pixel art style.
The design should be reminiscent of classic 8-bit and 16-bit era graphics.

🎨 Visual Style:
Clean, crisp pixels with no anti-aliasing
Limited color palette typical of retro games
Sharp edges and clear pixel boundaries
Isometric or top-down perspective

🧩 Design Guidelines:
Create a recognizable warning sign using pixel-perfect shapes
Use a limited color palette (maximum 16 colors)
Maintain clear pixel boundaries without blurring
Include a clear exclamation mark

🌈 Color Palette:
Bright yellow (#FFD700) for the main body
Black (#000000) for the exclamation mark
Dark yellow (#B8860B) for shading
Light yellow (#FFEB3B) for highlights

💡 Lighting & Shadow:
Simple directional lighting
Clear pixel-based shadows
No gradient effects

📐 Output Specifications:
Centered composition
Transparent background
1024 × 1024 px resolution
PNG format with full alpha transparency
No anti-aliasing or blur effects`
      },
      {
        name: "Minimalist",
        description: "Clean, modern minimalist style",
        prompt: `
Generate a 1024 × 1024 px high-resolution warning sign in minimalist style.
The design should be clean, modern, and stripped down to essential elements.

🎨 Visual Style:
Clean lines and simple shapes
Minimal use of colors
Plenty of white space
Modern, geometric design

🧩 Design Guidelines:
Create a simplified warning sign using basic geometric shapes
Use only essential elements
Maintain clear visual hierarchy
Include a minimal exclamation mark

🌈 Color Palette:
Pure yellow (#FFEB3B) for the main body
Deep black (#000000) for the exclamation mark
Optional subtle gray for depth
White space for balance

💡 Lighting & Shadow:
Minimal or no shadows
Flat design with subtle depth
Clean, even lighting

📐 Output Specifications:
Centered composition
Transparent background
1024 × 1024 px resolution
PNG format with full alpha transparency
No decorative elements or textures`
      }
    ]
  }
  // Add more items with their specific styles here
]; 