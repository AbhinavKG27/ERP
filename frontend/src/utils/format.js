export const formatPercent = (value) => `${Number(value ?? 0).toFixed(1)}%`

export const formatDateTime = (date) => {
  if (!date) return '--'
  return new Date(date).toLocaleString()
}

export const normalizeApiData = (response) => response?.data?.data ?? response?.data ?? null