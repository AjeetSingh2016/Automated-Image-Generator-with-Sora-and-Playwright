const promptTemplate = `Generate a 1024 × 1024 px high-resolution, smooth, clay-style icon of a {itemName}.
The icon must be handcrafted from modeling clay — using colors that closely match the real-world appearance of a {itemName}. Avoid using clay's default earthy tones like muddy browns or unnatural solid colors.

🎨 Visual Style:

3D, soft, and slightly inflated — as if molded from real modeling clay
Rounded shapes with smooth, polished surfaces — no fingerprints, dents, or rough textures
Use soft, subtle shading to show depth — avoid outlines or harsh shadows

🧩 {itemName} Design Guidelines:

Clearly depict a simplified and recognizable version of a {itemName}
Model each part using colors that reflect how the object looks in real life (e.g., paper should be white or light grey, leaves green, screens dark or bluish, metal parts grey or silver-like)
All parts must be connected and grounded — no floating or detached elements
Avoid symbols, icons, or text — rely solely on iconic visual structure

🌈 Color Palette:

Use accurate, object-based colors — avoid artificial, neon, or overly stylized hues
Avoid generic brown or monotone clay color unless brown is the actual color of the item
Colors should feel familiar, clean, and visually distinct without being overly saturated or dull

💡 Lighting & Shadow:

Top-left light source
Subtle drop shadow beneath the object to lift it from the background
Smooth inner shading to emphasize the 3D handcrafted clay form

📐 Output Specifications:

Centered layout
Transparent background (no gradients, patterns, or props behind)
1024 × 1024 px resolution
PNG format with full alpha transparency
No labels, numbers, or extra text

🧠 Tone & Feel:

Realistic yet playful — a handcrafted, clay-style visual of a {itemName} that captures its authentic appearance using soft 3D clay modeling and natural real-world colors.`;

const items = [
  {
    name: "warning sign",
    description: "A standard warning sign with exclamation mark"
  },
  {
    name: "stop sign",
    description: "A red octagonal stop sign"
  },
  {
    name: "speed limit sign",
    description: "A circular speed limit sign with numbers"
  }
];

const generatePrompt = (item) => {
  // Replace {itemName} with the actual item name
  const basePrompt = promptTemplate.replace('{itemName}', item.name);
  return basePrompt;
};

const generateMultiPrompt = (items) => {
  const itemsList = items.map(item => item.name).join(', ');
  const basePrompt = promptTemplate.replace('{itemName}', itemsList);
  
  return `${basePrompt}\n\nPlease generate separate images for each of the following items:\n${items.map(item => `- ${item.name}: ${item.description}`).join('\n')}`;
};

module.exports = {
  promptTemplate,
  items,
  generatePrompt,
  generateMultiPrompt
}; 