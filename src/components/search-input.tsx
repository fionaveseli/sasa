import { useDebouncedCallback } from "use-debounce"
import { useState } from "react"
import type { ChangeEvent } from "react"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchProps {
  handleSearch: (value: string) => void
  defaultValue?: string
  placeholder: string
  className?: string
}

const SearchInput = ({ handleSearch, defaultValue = "", placeholder, className = "" }: SearchProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const debounced = useDebouncedCallback((value: string) => {
    const trimmedValue = value.trim()
    if (trimmedValue.length === 0) {
      handleSearch("")
      setLoading(false)
    } else if (trimmedValue.length > 2) {
      handleSearch(trimmedValue)
      setLoading(false)
    }
  }, 300)

  const search = (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    debounced(event.target.value)
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground">
        <Search className="h-5 w-5" />
      </div>
      <Input
        defaultValue={defaultValue}
        onChange={search}
        placeholder={placeholder}
        className={`w-80 pl-10 pr-10 ${className}`}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

export default SearchInput

