"use client"

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { ptBR } from "date-fns/locale/pt-BR"
import type { ReactNode } from "react"

interface DatePickerProviderProps {
  children: ReactNode
}

export function DatePickerProvider({ children }: DatePickerProviderProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      {children}
    </LocalizationProvider>
  )
}
