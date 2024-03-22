export interface Decrypter {
  decrypt(payload: string): Promise<Record<string, unknown> | null>
}
