// src/utils/avatarGenerator.js
/**
 * Generate a deterministic color from a string.
 * @param {string} name - Full name
 * @returns {string} Hex color code
 */
function getColorFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Use a palette of pleasant colors
  const colors = [
    "#E963C8",
    "#B388FF",
    "#1976D2",
    "#11D896",
    "#FFA000",
    "#F81313",
    "#886217",
    "#4CAF50",
    "#FF5722",
    "#9C27B0",
    "#00BCD4",
    "#FFEB3B",
  ];
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Get initials from a name.
 * @param {string} name - Full name
 * @returns {string} Two uppercase letters (e.g., "JD")
 */
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();
  return first + last;
}

/**
 * Generate a data URL for an avatar circle with initials.
 * @param {string} name - Full name
 * @param {number} size - Size in pixels (default 100)
 * @returns {string} Data URL (SVG)
 */
export function generateAvatarDataUrl(name, size = 100) {
  const initials = getInitials(name);
  const color = getColorFromName(name);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${color}" />
      <text
        x="${size / 2}"
        y="${size / 2 + size * 0.05}"
        font-family="Inter, sans-serif"
        font-size="${size * 0.45}"
        font-weight="600"
        fill="white"
        text-anchor="middle"
        dominant-baseline="central"
      >${initials}</text>
    </svg>
  `;

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}
