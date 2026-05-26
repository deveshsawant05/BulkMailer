import crypto from "crypto";

const getEncryptionKey = () => process.env.ENCRYPTION_KEY || "0123456789abcdef0123456789abcdef"; // 32 chars
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  if (!text) return text;
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(getEncryptionKey()), iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString("hex")}:${encrypted}:${authTag.toString("hex")}`;
}

export function decrypt(text: string): string {
  if (!text) return text;
  
  try {
    const textParts = text.split(":");
    if (textParts.length !== 3) return text; // Not encrypted with our format
    
    const iv = Buffer.from(textParts[0], "hex");
    const encryptedText = Buffer.from(textParts[1], "hex");
    const authTag = Buffer.from(textParts[2], "hex");
    
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(getEncryptionKey()), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
}
