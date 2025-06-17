interface ValidationResult {
  validParams: Record<string, string>
  errors: string[] | null
}

export function validateURLParams(params: URLSearchParams): ValidationResult {
  const validParams: Record<string, string> = {}
  const errors: string[] = []

  // Validation de la page
  const page = params.get("page")
  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    errors.push("Invalid page number")
  } else if (page) {
    validParams.page = page
  }

  // Validation du tri
  const sort = params.get("sort")
  const validSorts = ["relevance", "popular", "price-asc", "price-desc"]
  if (sort && !validSorts.includes(sort)) {
    errors.push("Invalid sort parameter")
  } else if (sort) {
    validParams.sort = sort
  }

  // Validation des prix
  const minPrice = params.get("minPrice")
  const maxPrice = params.get("maxPrice")
  if (minPrice && (isNaN(Number(minPrice)) || Number(minPrice) < 0)) {
    errors.push("Invalid minimum price")
  } else if (minPrice) {
    validParams.minPrice = minPrice
  }
  if (maxPrice && (isNaN(Number(maxPrice)) || Number(maxPrice) < 0)) {
    errors.push("Invalid maximum price")
  } else if (maxPrice) {
    validParams.maxPrice = maxPrice
  }
  if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
    errors.push("Minimum price cannot be greater than maximum price")
  }

  // Validation de l'année
  const year = params.get("year")
  if (year && (isNaN(Number(year)) || Number(year) < 1800 || Number(year) > new Date().getFullYear())) {
    errors.push("Invalid year")
  } else if (year) {
    validParams.year = year
  }

  return {
    validParams,
    errors: errors.length > 0 ? errors : null
  }
} 