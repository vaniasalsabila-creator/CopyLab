export function uid(): string {
  return crypto.randomUUID()
}

export function emptyCopy() {
  return {
    whatsapp: { en: '', id: '' },
    push: {
      title: { en: '', id: '' },
      subtitle: { en: '', id: '' },
    },
  }
}

export function cloneCopy<T>(value: T): T {
  return structuredClone(value)
}
