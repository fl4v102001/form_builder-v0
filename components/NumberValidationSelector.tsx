"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, FormControl, Select, MenuItem, Typography, TextField, Grid } from "@mui/material"
import { NumberValidationType, type NumberValidation } from "@/types/form"

interface NumberValidationSelectorProps {
  validation: NumberValidation
  onChange: (validation: NumberValidation) => void
}

export default function NumberValidationSelector({ validation, onChange }: NumberValidationSelectorProps) {
  const [localValidation, setLocalValidation] = useState<NumberValidation>(validation)

  useEffect(() => {
    setLocalValidation(validation)
  }, [validation])

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newType = event.target.value as NumberValidationType
    const newValidation: NumberValidation = { type: newType }

    if (newType === NumberValidationType.GREATER_THAN || newType === NumberValidationType.INTEGER_GREATER_THAN_ZERO) {
      newValidation.greaterThan = 0
    } else if (
      newType === NumberValidationType.BETWEEN ||
      newType === NumberValidationType.INTEGER_BETWEEN
    ) {
      newValidation.min = 0
      newValidation.max = 10
    }

    setLocalValidation(newValidation)
    onChange(newValidation)
  }

  const handleGreaterThanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(event.target.value)
    if (!isNaN(value)) {
      const newValidation = { ...localValidation, greaterThan: value }
      setLocalValidation(newValidation)
      onChange(newValidation)
    }
  }

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(event.target.value)
    if (!isNaN(value)) {
      const newValidation = { ...localValidation, min: value }
      setLocalValidation(newValidation)
      onChange(newValidation)
    }
  }

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(event.target.value)
    if (!isNaN(value)) {
      const newValidation = { ...localValidation, max: value }
      setLocalValidation(newValidation)
      onChange(newValidation)
    }
  }

  const getValidationLabel = (type: NumberValidationType): string => {
    switch (type) {
      case NumberValidationType.NONE:
        return "Sem validação"
      case NumberValidationType.INTEGER:
        return "Número inteiro"
      case NumberValidationType.GREATER_THAN_ZERO:
        return "Maior que zero"
      case NumberValidationType.LESS_THAN_ZERO:
        return "Menor que zero"
      case NumberValidationType.GREATER_THAN:
        return "Maior que"
      case NumberValidationType.BETWEEN:
        return "Entre dois números"
      case NumberValidationType.INTEGER_GREATER_THAN_ZERO:
        return "Inteiro maior que zero"
      case NumberValidationType.INTEGER_LESS_THAN_ZERO:
        return "Inteiro menor que zero"
      case NumberValidationType.INTEGER_BETWEEN:
        return "Inteiro entre dois números"
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
          <MenuItem value={NumberValidationType.NONE}>Sem validação</MenuItem>
          <MenuItem value={NumberValidationType.INTEGER}>Número inteiro</MenuItem>
          <MenuItem value={NumberValidationType.GREATER_THAN_ZERO}>Maior que zero</MenuItem>
          <MenuItem value={NumberValidationType.LESS_THAN_ZERO}>Menor que zero</MenuItem>
          <MenuItem value={NumberValidationType.GREATER_THAN}>Maior que</MenuItem>
          <MenuItem value={NumberValidationType.BETWEEN}>Entre dois números</MenuItem>
          <MenuItem value={NumberValidationType.INTEGER_GREATER_THAN_ZERO}>Inteiro maior que zero</MenuItem>
          <MenuItem value={NumberValidationType.INTEGER_LESS_THAN_ZERO}>Inteiro menor que zero</MenuItem>
          <MenuItem value={NumberValidationType.INTEGER_BETWEEN}>Inteiro entre dois números</MenuItem>
        </Select>
      </FormControl>

      {localValidation.type === NumberValidationType.GREATER_THAN && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            O valor deve ser maior que:
          </Typography>
          <TextField
            type="number"
            size="small"
            value={localValidation.greaterThan !== undefined ? localValidation.greaterThan : ""}
            onChange={handleGreaterThanChange}
            fullWidth
            inputProps={{ step: "any" }}
          />
        </Box>
      )}

      {localValidation.type === NumberValidationType.BETWEEN && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            O valor deve estar entre:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                type="number"
                size="small"
                label="Mínimo"
                value={localValidation.min !== undefined ? localValidation.min : ""}
                onChange={handleMinChange}
                fullWidth
                inputProps={{ step: "any" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                size="small"
                label="Máximo"
                value={localValidation.max !== undefined ? localValidation.max : ""}
                onChange={handleMaxChange}
                fullWidth
                inputProps={{ step: "any" }}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {localValidation.type === NumberValidationType.INTEGER_GREATER_THAN_ZERO && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          O valor deve ser um inteiro maior que zero.
        </Typography>
      )}

      {localValidation.type === NumberValidationType.INTEGER_LESS_THAN_ZERO && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          O valor deve ser um inteiro menor que zero.
        </Typography>
      )}

      {localValidation.type === NumberValidationType.INTEGER_BETWEEN && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            O valor deve ser um inteiro entre:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                type="number"
                size="small"
                label="Mínimo"
                value={localValidation.min !== undefined ? localValidation.min : ""}
                onChange={handleMinChange}
                fullWidth
                inputProps={{ step: 1 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                size="small"
                label="Máximo"
                value={localValidation.max !== undefined ? localValidation.max : ""}
                onChange={handleMaxChange}
                fullWidth
                inputProps={{ step: 1 }}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  )
}
