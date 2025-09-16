"use client"

import * as React from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState(value || new Date())

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i)

  const handleMonthChange = (monthIndex: number) => {
    const newMonth = new Date(month)
    newMonth.setMonth(monthIndex)
    setMonth(newMonth)
  }

  const handleYearChange = (year: number) => {
    const newMonth = new Date(month)
    newMonth.setFullYear(year)
    setMonth(newMonth)
  }

  const goToPreviousMonth = () => {
    const newMonth = new Date(month)
    newMonth.setMonth(newMonth.getMonth() - 1)
    setMonth(newMonth)
  }

  const goToNextMonth = () => {
    const newMonth = new Date(month)
    newMonth.setMonth(newMonth.getMonth() + 1)
    setMonth(newMonth)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white border-gray-300 text-gray-900 hover:bg-gray-50",
            !value && "text-gray-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-lg" align="start">
        <div className="p-3">
          {/* Custom Header */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-transparent border-0 opacity-50 hover:opacity-100"
              onClick={goToPreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2">
              <select
                value={month.getMonth()}
                onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                className="text-sm font-medium bg-transparent border-0 focus:outline-none cursor-pointer"
              >
                {months.map((monthName, index) => (
                  <option key={index} value={index}>
                    {monthName}
                  </option>
                ))}
              </select>

              <select
                value={month.getFullYear()}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="text-sm font-medium bg-transparent border-0 focus:outline-none cursor-pointer"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-transparent border-0 opacity-50 hover:opacity-100"
              onClick={goToNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar */}
          <DayPicker
            mode="single"
            selected={value}
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              onChange?.(date)
              setOpen(false)
            }}
            showOutsideDays={false}
            classNames={{
              day_selected: "bg-blue-600 text-white hover:bg-blue-700",
              day_today: "bg-gray-100 text-gray-900",
              day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 rounded-md",
              head_cell: "text-gray-500 font-normal text-sm w-9",
              cell: "text-center text-sm p-0 relative",
              row: "flex w-full mt-1",
              head_row: "flex w-full mb-2",
              table: "w-full",
              caption: "hidden",
              caption_label: "hidden",
              nav: "hidden",
              nav_button: "hidden",
              nav_button_previous: "hidden",
              nav_button_next: "hidden",
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}