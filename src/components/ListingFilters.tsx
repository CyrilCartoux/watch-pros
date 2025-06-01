import { Badge } from "./ui/badge"

const filters = [
  { label: "Certified", value: "certified" },
  { label: "Used", value: "used" },
  { label: "New", value: "new" },
  { label: "Unworn", value: "unworn" },
  { label: "In Stock", value: "in-stock" },
  { label: "Datejust 36", value: "datejust-36" },
  { label: "Daytona", value: "daytona" },
  { label: "Lady-Datejust", value: "lady-datejust" },
]

interface ListingFiltersProps {
  selectedFilters: string[]
  onFilterChange: (filter: string) => void
}

export function ListingFilters({ selectedFilters, onFilterChange }: ListingFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <Badge
          key={filter.value}
          variant={selectedFilters.includes(filter.value) ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary/10"
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </Badge>
      ))}
    </div>
  )
} 