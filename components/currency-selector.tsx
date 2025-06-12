"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const currencies = [
  { value: "inr", label: "INR - Indian Rupee", symbol: "₹" },
  { value: "usd", label: "USD - US Dollar", symbol: "$" },
  { value: "eur", label: "EUR - Euro", symbol: "€" },
  { value: "gbp", label: "GBP - British Pound", symbol: "£" },
  { value: "jpy", label: "JPY - Japanese Yen", symbol: "¥" },
  { value: "aud", label: "AUD - Australian Dollar", symbol: "A$" },
  { value: "cad", label: "CAD - Canadian Dollar", symbol: "C$" },
  { value: "sgd", label: "SGD - Singapore Dollar", symbol: "S$" },
  { value: "cny", label: "CNY - Chinese Yuan", symbol: "¥" },
  { value: "aed", label: "AED - UAE Dirham", symbol: "د.إ" },
]

export function CurrencySelector() {
  const [open, setOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[120px] justify-between rounded-full border-slate-200"
        >
          <span className="font-medium">{selectedCurrency.symbol}</span>
          <span className="ml-1 text-xs text-slate-500">{selectedCurrency.value.toUpperCase()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 rounded-xl">
        <Command>
          <CommandInput placeholder="Search currency..." className="h-9" />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.value}
                  value={currency.value}
                  onSelect={() => {
                    setSelectedCurrency(currency)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCurrency.value === currency.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="font-medium mr-1">{currency.symbol}</span>
                  <span className="text-xs text-slate-500">{currency.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
