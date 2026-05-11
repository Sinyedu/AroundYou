type TextOptions = {
  field: string
  min?: number
  max?: number
  required?: boolean
}

function fail(message: string): never {
  throw new Error(message)
}

export function normalizeText(value: unknown, options: TextOptions): string {
  const text = typeof value === 'string' ? value.trim() : ''
  const min = options.min ?? 0
  const max = options.max ?? 2048

  if (options.required && !text) {
    fail(`${options.field} skal udfyldes.`)
  }

  if (text && text.length < min) {
    fail(`${options.field} skal være mindst ${min} tegn.`)
  }

  if (text.length > max) {
    fail(`${options.field} må højst være ${max} tegn.`)
  }

  return text
}

export function normalizeNonNegativeNumber(
  value: unknown,
  field: string,
  max = 1_000_000,
): number {
  const numberValue = typeof value === 'number' ? value : Number(value)

  if (!Number.isFinite(numberValue) || numberValue < 0 || numberValue > max) {
    fail(`${field} skal være et gyldigt tal.`)
  }

  return numberValue
}

export function normalizeRating(value: unknown): number {
  const rating = normalizeNonNegativeNumber(value, 'Rating', 5)

  if (!Number.isInteger(rating) || rating < 1) {
    fail('Rating skal være mellem 1 og 5.')
  }

  return rating
}

export function normalizeStringArray(values: unknown, maxItems = 30): string[] {
  if (!Array.isArray(values)) return []

  return values
    .map((value) => normalizeText(value, { field: 'Værdi', max: 120 }))
    .filter(Boolean)
    .slice(0, maxItems)
}

export function normalizeDateRange(startDate: string, endDate: string): {
  startDate: string
  endDate: string
} {
  const start = normalizeText(startDate, { field: 'Startdato', required: true, max: 64 })
  const end = normalizeText(endDate, { field: 'Slutdato', required: true, max: 64 })

  const startTime = new Date(start).getTime()
  const endTime = new Date(end).getTime()

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) {
    fail('Datoerne skal være gyldige.')
  }

  if (endTime < startTime) {
    fail('Slutdatoen skal være efter startdatoen.')
  }

  return { startDate: start, endDate: end }
}
