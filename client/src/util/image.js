import { SERVER_URL } from './axios.js';

/**
 * Resolves an image path to a full URL.
 * Supports both Cloudinary URLs (starting with http) and local assets folders.
 * 
 * @param {string} path - The raw database string containing the image source.
 * @returns {string} The fully resolved URL to render in <img> tags.
 */
export const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/150";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${SERVER_URL}/${path.replace(/\\/g, "/")}`;
};
