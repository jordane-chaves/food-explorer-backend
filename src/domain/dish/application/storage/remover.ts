export interface Remover {
  remove(fileName: string): Promise<void>
}
