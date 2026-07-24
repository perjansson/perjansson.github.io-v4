export const formatYear = (date?: string | null) =>
  date ? new Date(date).getFullYear().toString() : undefined

export const formatPeriod = (
  startdate?: string | null,
  enddate?: string | null
) => {
  const start = formatYear(startdate)
  const end = formatYear(enddate) ?? 'present'

  if (!start) {
    return undefined
  }

  return start === end ? start : `${start} – ${end}`
}

const MONTH_FORMATTER = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
})

export const formatPeriodDetailed = (
  startdate?: string | null,
  enddate?: string | null
) => {
  if (!startdate) {
    return undefined
  }

  const start = MONTH_FORMATTER.format(new Date(startdate))
  const end = enddate ? MONTH_FORMATTER.format(new Date(enddate)) : 'present'

  return `${start} – ${end}`
}
