"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, FormControl, Select, MenuItem, Typography, TextField } from "@mui/material"
import { ShortAnswerValidationType, type ShortAnswerValidation } from "@/types/form"

interface ShortAnswerValidationSelectorProps {
  validation: ShortAnswerValidation
  onChange: (validation: ShortAnswerValidation) => void
}

export default function ShortAnswerValidationSelector({ validation, onChange }: ShortAnswerValidationSelectorProps) {
  const [localValidation, setLocalValidation] = useState<ShortAnswerValidation>(validation)

  useEffect(() => {
    setLocalValidation(validation)
  }, [validation])

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newType = event.target.value as ShortAnswerValidationType

    // Initialize default values for the new validation type
    const newValidation: ShortAnswerValidation = { type: newType }

    if (newType === ShortAnswerValidationType.MAX_LENGTH) {
      newValidation.maxLength = 100 // Default max length
    }

    setLocalValidation(newValidation)
    onChange(newValidation)
  }

  const handleMaxLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10)
    if (!isNaN(value) && value > 0) {
      const newValidation = { ...localValidation, maxLength: value }
      setLocalValidation(newValidation)
      onChange(newValidation)
    }
  }

  const getValidationLabel = (type: ShortAnswerValidationType): string => {
    switch (type) {
      case ShortAnswerValidationType.NONE:
        return "Sem validação"
      case ShortAnswerValidationType.MAX_LENGTH:
        return "Tamanho máximo"
      default:
        return "Sem validação"
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Regra de Validação
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          value={localValidation.type}
          onChange={handleTypeChange as any}
          displayEmpty
          sx={{ borderRadius: 1, mb: 2 }}
        >
          <MenuItem value={ShortAnswerValidationType.NONE}>Sem validação</MenuItem>
          <MenuItem value={ShortAnswerValidationType.MAX_LENGTH}>Tamanho máximo</MenuItem>
        </Select>
      </FormControl>

      {localValidation.type === ShortAnswerValidationType.MAX_LENGTH && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Número máximo de caracteres:
          </Typography>
          <TextField
            type="number"
            size="small"
            value={localValidation.maxLength !== undefined ? localValidation.maxLength : ""}
            onChange={handleMaxLengthChange}
            fullWidth
            inputProps={{ min: 1 }}
          />
        </Box>
      )}
    </Box>
  )
}
