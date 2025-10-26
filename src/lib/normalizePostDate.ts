const EXPLICIT_OFFSET_PATTERN = /([+-]\d{2}:?\d{2}|Z)$/i
const TRAILING_Z_PATTERN = /Z$/i

const getTimezoneOffsetMinutes = (instant: Date, timeZone: string) => {
  const localeTime = new Date(
    instant.toLocaleString('en-US', { timeZone, hour12: false }),
  )
  const utcTime = new Date(
    instant.toLocaleString('en-US', { timeZone: 'UTC', hour12: false }),
  )

  return (localeTime.getTime() - utcTime.getTime()) / 60_000
}

const formatOffset = (minutes: number) => {
  const sign = minutes >= 0 ? '+' : '-'
  const absoluteMinutes = Math.abs(Math.round(minutes))
  const hoursPortion = String(Math.trunc(absoluteMinutes / 60)).padStart(2, '0')
  const minutesPortion = String(absoluteMinutes % 60).padStart(2, '0')

  return `${sign}${hoursPortion}:${minutesPortion}`
}

const ensureColonInOffset = (value: string) =>
  value.replace(
    /([+-]\d{2})(\d{2})$/,
    (_, hours: string, minutes: string) => `${hours}:${minutes}`,
  )

const sanitiseInput = (input: string) => input.trim().replace(/\s+/, 'T')

const appendTimezone = (value: string, timeZone: string) => {
  const isoCandidate = TRAILING_Z_PATTERN.test(value) ? value : `${value}Z`
  const instant = new Date(isoCandidate)

  if (Number.isNaN(instant.getTime())) {
    return value
  }

  const offsetMinutes = getTimezoneOffsetMinutes(instant, timeZone)

  if (!Number.isFinite(offsetMinutes)) {
    return value
  }

  const base = TRAILING_Z_PATTERN.test(value) ? value.slice(0, -1) : value

  return `${base}${formatOffset(offsetMinutes)}`
}

export const normalizePostDateInput = (input: string, timeZone?: string) => {
  if (!timeZone) {
    return input
  }

  const cleaned = sanitiseInput(input)

  if (EXPLICIT_OFFSET_PATTERN.test(cleaned)) {
    if (TRAILING_Z_PATTERN.test(cleaned)) {
      return appendTimezone(cleaned, timeZone)
    }

    return ensureColonInOffset(cleaned)
  }

  return appendTimezone(cleaned, timeZone)
}

export const parsePostDate = (input: string | Date, timeZone?: string) => {
  if (input instanceof Date) {
    return new Date(normalizePostDateInput(input.toISOString(), timeZone))
  }

  return new Date(normalizePostDateInput(input, timeZone))
}
