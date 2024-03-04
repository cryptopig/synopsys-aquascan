"use client"

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"



export function UnitPicker({units, values, setValues}) {
  const [open, setOpen] = useState(false)


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {(() => {
            for (let i = 0; i < units.length; i++) {
              if (values[i]) {
                return true;
              }
            }
            return false;
          })()
            ? units.map((f, i) => {
              if (values[i]) {
                return f.label;
              } else {
                return null;
              }
            }).filter(v => v !== null).join(', ')
            : "Select units..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search units..." className="h-9" />
          <CommandEmpty>No units found.</CommandEmpty>
          <CommandGroup>
            {units.map((unit, index) => (
              <CommandItem
                key={unit.value}
                value={unit.value}
                onSelect={(currentValue) => {
                  let newValues = structuredClone(values);
                  newValues[index] = !newValues[index];
                  // newValues[-1] = true;
                  setValues(newValues);

                  // setOpen(false)
                }}
              >
                {unit.label}
                {/* <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === unit.value ? "opacity-100" : "opacity-0"
                  )}
                /> */}
                {
                  values[index] ? <CheckIcon className="ml-auto h-4 w-4" /> : <></>
                }
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
