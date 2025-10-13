const EXPLICIT_OFFSET_PATTERN = /([+-]\d{2}:\d{2}|[+-]\d{4})$/;

const getTimezoneOffsetMinutes = (instant: Date, timeZone: string) => {
  const localeTime = new Date(
    instant.toLocaleString("en-US", { timeZone, hour12: false })
  );
  const utcTime = new Date(
    instant.toLocaleString("en-US", { timeZone: "UTC", hour12: false })
  );

  return (localeTime.getTime() - utcTime.getTime()) / 60_000;
};

const formatOffset = (minutes: number) => {
  const sign = minutes >= 0 ? "+" : "-";
  const absoluteMinutes = Math.abs(Math.round(minutes));
  const hoursPortion = String(Math.trunc(absoluteMinutes / 60)).padStart(
    2,
    "0"
  );
  const minutesPortion = String(absoluteMinutes % 60).padStart(2, "0");

  return `${sign}${hoursPortion}:${minutesPortion}`;
};

export const normalizePostDateInput = (input: string, timeZone?: string) => {
  if (!timeZone || EXPLICIT_OFFSET_PATTERN.test(input)) {
    return input;
  }

  if (!input.endsWith("Z")) {
    return input;
  }

  const instant = new Date(input);

  if (Number.isNaN(instant.getTime())) {
    return input;
  }

  const offsetMinutes = getTimezoneOffsetMinutes(instant, timeZone);

  if (!Number.isFinite(offsetMinutes) || offsetMinutes === 0) {
    return input;
  }

  return `${input.slice(0, -1)}${formatOffset(offsetMinutes)}`;
};

export const parsePostDate = (input: string | Date, timeZone?: string) => {
  const raw = input instanceof Date ? input.toISOString() : input;

  return new Date(normalizePostDateInput(raw, timeZone));
};
