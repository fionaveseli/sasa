import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import type { ChangeEvent } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchProps {
  handleSearch: (value: string) => void;
  defaultValue?: string;
  placeholder: string;
  className?: string;
}

const SearchInput = ({
  handleSearch,
  defaultValue = "",
  placeholder,
  className = "",
}: SearchProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const debounced = useDebouncedCallback((value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      handleSearch("");
      setLoading(false);
    } else if (trimmedValue.length > 2) {
      handleSearch(trimmedValue);
      setLoading(false);
    }
  }, 300);

  const search = (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    debounced(event.target.value);
  };

  return (
    <div className="relative cursor-pointer">
      <Input
        defaultValue={defaultValue}
        startContent={<Search className="text-foreground h-5 w-5 p-0 m-0" />}
        onChange={search}
        placeholder={placeholder}
        className={`w-80 opacity-50 text-foreground ${className}`}
        endContent={
          loading && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )
        }
      />
    </div>
  );
};

export default SearchInput;
