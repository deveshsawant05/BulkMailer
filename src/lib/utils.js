import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function extractVariables(input = "") {
  if (typeof input !== "string" || input.length === 0) {
    return [];
  }

  const design = extractUnlayerDesignMetadata(input);
  const designString = design ? JSON.stringify(design) : "";
  const htmlContent = stripUnlayerDesignMetadata(input);
  
  const contentToSearch = `${htmlContent}\n${designString}`;
  
  const matches = contentToSearch.matchAll(/{{\s*([A-Za-z0-9_]+)\s*}}/g);

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

const unlayerVariablesMetadataRegex =
  /<!--\s*bulkmailer-variables:([\s\S]*?)\s*-->\s*/;

export function stripUnlayerVariablesMetadata(input = "") {
  if (typeof input !== "string") return "";
  return input.replace(unlayerVariablesMetadataRegex, "");
}

export function extractUnlayerVariablesMetadata(input = "") {
  if (typeof input !== "string") return [];
  const match = input.match(unlayerVariablesMetadataRegex);
  if (!match?.[1]) return [];
  try {
    return JSON.parse(decodeURIComponent(match[1].trim()));
  } catch {
    return [];
  }
}

export function attachUnlayerVariablesMetadata(html = "", variables = []) {
  const cleanHtml = stripUnlayerVariablesMetadata(html);
  if (!variables || variables.length === 0) return cleanHtml;
  return `<!-- bulkmailer-variables:${encodeURIComponent(
    JSON.stringify(variables)
  )} -->\n${cleanHtml}`;
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
