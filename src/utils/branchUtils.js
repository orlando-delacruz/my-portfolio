// src/utils/branchUtils.js

// Centralized color map for specific branches
const BRANCH_COLOR_MAP = {
  "san juan": "#E963C8", // Pink
  rosario: "#B388FF", // Violet
  // Add more if needed
};

/**
 * Get a consistent color for a branch.
 * Uses a predefined map for specific branches, otherwise falls back to a hash-based color.
 * @param {string} branchId - The UUID of the branch.
 * @param {string} branchName - The name of the branch (optional, used for exact match).
 * @returns {string} - A hex color code.
 */
export function getBranchColor(branchId, branchName = null) {
  // If branchName is provided, try to match it in the color map
  if (branchName) {
    const lowerName = branchName.toLowerCase().trim();
    if (BRANCH_COLOR_MAP[lowerName]) {
      return BRANCH_COLOR_MAP[lowerName];
    }
  }
  // Fallback: hash-based color from branchId
  if (!branchId) return "#888888";
  const colors = [
    "#E963C8",
    "#B388FF",
    "#1976D2",
    "#11D896",
    "#FFA000",
    "#F81313",
    "#886217",
  ];
  let hash = 0;
  for (let i = 0; i < branchId.length; i++) {
    hash = branchId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Get the initial letter of a branch name (first character, uppercase).
 * @param {string} branchName - The branch name.
 * @returns {string} - The first letter, uppercase, or '•' if invalid.
 */
export function getBranchInitial(branchName) {
  if (!branchName || typeof branchName !== "string") return "•";
  const firstChar = branchName.trim().charAt(0);
  return firstChar.toUpperCase() || "•";
}
