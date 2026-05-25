export function formatDate(date) {
  if (!date) return "N/A"
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function truncate(str, length = 100) {
  if (!str) return ""
  return str.length > length ? str.slice(0, length) + "..." : str
}

export function formatPrice(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}