import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function extractVariables(input = "") {
  const content = stripUnlayerDesignMetadata(input);

  if (typeof content !== "string" || content.length === 0) {
    return [];
  }

  const matches = content.matchAll(/{{\s*([A-Za-z0-9_]+)\s*}}/g);

  return Array.from(new Set(Array.from(matches, (match) => match[1])));
}

const unlayerDesignMetadataRegex =
  /<!--\s*bulkmailer-unlayer-design:([\s\S]*?)\s*-->\s*/;

export function stripUnlayerDesignMetadata(input = "") {
  if (typeof input !== "string") {
    return "";
  }

  return input.replace(unlayerDesignMetadataRegex, "");
}

export function extractUnlayerDesignMetadata(input = "") {
  if (typeof input !== "string") {
    return null;
  }

  const match = input.match(unlayerDesignMetadataRegex);

  if (!match?.[1]) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(match[1].trim()));
  } catch {
    return null;
  }
}

export function attachUnlayerDesignMetadata(html = "", design = null) {
  const cleanHtml = stripUnlayerDesignMetadata(html);

  if (!design) {
    return cleanHtml;
  }

  return `<!-- bulkmailer-unlayer-design:${encodeURIComponent(
    JSON.stringify(design)
  )} -->\n${cleanHtml}`;
}
