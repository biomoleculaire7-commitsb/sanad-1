import LZString from "lz-string";
import QRCode from "qrcode";
import { PedagogicalFiche } from "../types";

/**
 * Serializes and compresses a PedagogicalFiche into a compact, URL-safe string.
 */
export function serializeFiche(fiche: PedagogicalFiche): string {
  // Create a clean payload, trimming any excessively huge base64 images if needed to keep the URL concise
  const sanitizedFiche: PedagogicalFiche = {
    ...fiche,
    images: fiche.images?.map((img) => ({
      ...img,
      // If it's a huge data URL (>20KB), keep caption and description but avoid bloating the share URL
      url: img.url.length > 20000 && img.url.startsWith("data:") ? "" : img.url,
    })),
  };

  const jsonStr = JSON.stringify(sanitizedFiche);
  return LZString.compressToEncodedURIComponent(jsonStr);
}

/**
 * Decompresses and parses a serialized string back into a PedagogicalFiche.
 */
export function deserializeFiche(serialized: string): PedagogicalFiche | null {
  try {
    if (!serialized || typeof serialized !== "string") return null;
    const decompressed = LZString.decompressFromEncodedURIComponent(serialized);
    if (!decompressed) return null;
    const parsed = JSON.parse(decompressed);
    if (parsed && parsed.header && Array.isArray(parsed.steps)) {
      return parsed as PedagogicalFiche;
    }
    return null;
  } catch (err) {
    console.error("Error deserializing fiche:", err);
    return null;
  }
}

/**
 * Builds the complete shareable link for a given PedagogicalFiche.
 */
export function generateShareableLink(fiche: PedagogicalFiche): string {
  const serialized = serializeFiche(fiche);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#share=${serialized}`;
}

/**
 * Generates a high-quality QR code data URL (PNG) from a URL or text string.
 */
export async function generateQrCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "M",
      margin: 2,
      scale: 8,
      color: {
        dark: "#0f172a", // Slate 900
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("QR generation error:", err);
    throw err;
  }
}

/**
 * Helper to copy text to clipboard with fallback.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback using textarea
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    textArea.remove();
    return successful;
  } catch (err) {
    console.warn("Clipboard copy error:", err);
    return false;
  }
}
