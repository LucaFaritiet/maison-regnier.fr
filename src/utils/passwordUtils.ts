// Encodage simple pour stocker le hash dans localStorage
export function encodePasswordData(hash: string): string {
  return btoa(hash);
}

export function decodePasswordData(encoded: string): string {
  try {
    return atob(encoded);
  } catch {
    return "";
  }
}
