"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Paper,
  TextField,
  Typography,
  IconButton,
  Box,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Button,
  Tooltip,
  InputAdornment,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { ptBR } from "date-fns/locale/pt-BR"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import { type Question, QuestionType, NumberValidationType, ShortAnswerValidationType } from "@/types/form"
import QuestionTypeSelector from "./QuestionTypeSelector"
import NumberValidationSelector from "./NumberValidationSelector"
import ShortAnswerValidationSelector from "./ShortAnswerValidationSelector"
import { v4 as uuidv4 } from "uuid"

interface QuestionBuilderProps {
  question: Question
  onChange: (question: Question) => void
  onDelete: (questionId: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isSelected?: boolean
  onSelect?: () => void
  onAddQuestion?: () => void
  isFirstQuestion?: boolean
  isLastQuestion?: boolean
}

export default function QuestionBuilder({
  question,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isSelected = false,
  onSelect,
  onAddQuestion,
  isFirstQuestion = false,
  isLastQuestion = false,
}: QuestionBuilderProps) {
  const [options, setOptions] = useState<{ id: string; value: string }[]>(question.options || [])
  const [newOption, setNewOption] = useState("")

  useEffect(() => {
    if (question.options) {
      setOptions(question.options)
    }
  }, [question.options])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...question,
      title: e.target.value,
    })
  }

  const handleTypeChange = (type: QuestionType) => {
    const updatedQuestion = {
      ...question,
      type,
    }

    // Initialize options for question types that need them
    if (
      (type === QuestionType.MULTIPLE_CHOICE || type === QuestionType.CHECKBOXES || type === QuestionType.DROPDOWN) &&
      (!question.options || question.options.length === 0)
    ) {
      updatedQuestion.options = [
        { id: uuidv4(), value: "Opção 1" },
        { id: uuidv4(), value: "Opção 2" },
      ]
      setOptions(updatedQuestion.options)
    }

    // Initialize number validation for NUMBER type
    if (type === QuestionType.NUMBER) {
      updatedQuestion.numberValidation = {
        type: NumberValidationType.NONE,
      }
    }

    // Initialize short answer validation for SHORT_ANSWER type
    if (type === QuestionType.SHORT_ANSWER) {
      updatedQuestion.shortAnswerValidation = {
        type: ShortAnswerValidationType.NONE,
      }
    }

    onChange(updatedQuestion)
  }

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...question,
      required: e.target.checked,
    })
  }

  const handleNumberValidationChange = (validation: any) => {
    onChange({
      ...question,
      numberValidation: validation,
    })
  }

  const handleShortAnswerValidationChange = (validation: any) => {
    onChange({
      ...question,
      shortAnswerValidation: validation,
    })
  }

  const handleOptionChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedOptions = options.map((opt) => (opt.id === id ? { ...opt, value: e.target.value } : opt))
    setOptions(updatedOptions)
    onChange({
      ...question,
      options: updatedOptions,
    })
  }

  const addOption = () => {
    if (newOption.trim()) {
      const updatedOptions = [...options, { id: uuidv4(), value: newOption.trim() }]
      setOptions(updatedOptions)
      onChange({
        ...question,
        options: updatedOptions,
      })
      setNewOption("")
    } else {
      const updatedOptions = [...options, { id: uuidv4(), value: `Opção ${options.length + 1}` }]
      setOptions(updatedOptions)
      onChange({
        ...question,
        options: updatedOptions,
      })
    }
  }

  const removeOption = (id: string) => {
    const updatedOptions = options.filter((opt) => opt.id !== id)
    setOptions(updatedOptions)
    onChange({
      ...question,
      options: updatedOptions,
    })
  }

  const renderAnswerSpace = () => {
    switch (question.type) {
      case QuestionType.SHORT_ANSWER:
        return (
          <Box sx={{ width: "100%" }}>
            <TextField fullWidth disabled placeholder="Resposta curta" variant="standard" sx={{ mt: 2 }} />
            {question.shortAnswerValidation && (
              <ShortAnswerValidationSelector
                validation={question.shortAnswerValidation}
                onChange={handleShortAnswerValidationChange}
              />
            )}
          </Box>
        )
      case QuestionType.PARAGRAPH:
        return (
          <TextField
            fullWidth
            disabled
            placeholder="Resposta longa"
            variant="standard"
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
        )
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <List sx={{ width: "100%" }}>
            {options.map((option) => (
              <ListItem
                key={option.id}
                sx={{ px: 0, py: 0.5 }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => removeOption(option.id)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Radio disabled />
                <TextField
                  fullWidth
                  value={option.value}
                  onChange={(e) => handleOptionChange(option.id, e as React.ChangeEvent<HTMLInputElement>)}
                  variant="standard"
                  sx={{ ml: 1 }}
                />
              </ListItem>
            ))}
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <Radio disabled />
              <TextField
                fullWidth
                placeholder="Adicionar opção"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                variant="standard"
                sx={{ ml: 1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addOption()
                  }
                }}
                onBlur={addOption}
              />
            </ListItem>
          </List>
        )
      case QuestionType.CHECKBOXES:
        return (
          <List sx={{ width: "100%" }}>
            {options.map((option) => (
              <ListItem
                key={option.id}
                sx={{ px: 0, py: 0.5 }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => removeOption(option.id)} size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Checkbox disabled />
                <TextField
                  fullWidth
                  value={option.value}
                  onChange={(e) => handleOptionChange(option.id, e as React.ChangeEvent<HTMLInputElement>)}
                  variant="standard"
                  sx={{ ml: 1 }}
                />
              </ListItem>
            ))}
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <Checkbox disabled />
              <TextField
                fullWidth
                placeholder="Adicionar opção"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                variant="standard"
                sx={{ ml: 1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addOption()
                  }
                }}
                onBlur={addOption}
              />
            </ListItem>
          </List>
        )
      case QuestionType.DROPDOWN:
        return (
          <Box sx={{ width: "100%" }}>
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <InputLabel id="dropdown-label">Selecione uma opção</InputLabel>
              <Select labelId="dropdown-label" id="dropdown-select" label="Selecione uma opção" disabled value="">
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Opções:
            </Typography>
            <List sx={{ width: "100%" }}>
              {options.map((option) => (
                <ListItem
                  key={option.id}
                  sx={{ px: 0, py: 0.5 }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => removeOption(option.id)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <TextField
                    fullWidth
                    value={option.value}
                    onChange={(e) => handleOptionChange(option.id, e as React.ChangeEvent<HTMLInputElement>)}
                    variant="standard"
                  />
                </ListItem>
              ))}
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <TextField
                  fullWidth
                  placeholder="Adicionar opção"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  variant="standard"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addOption()
                    }
                  }}
                  onBlur={addOption}
                />
              </ListItem>
            </List>
          </Box>
        )
      case QuestionType.DATE:
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              disabled
              sx={{ mt: 2, width: "100%" }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  fullWidth: true,
                  placeholder: "Selecione uma data",
                },
              }}
            />
          </LocalizationProvider>
        )
      case QuestionType.NUMBER:
        return (
          <Box sx={{ width: "100%" }}>
            <TextField
              fullWidth
              disabled
              type="number"
              placeholder="Digite um número"
              variant="outlined"
              sx={{ mt: 2 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
            />
            {question.numberValidation && (
              <NumberValidationSelector
                validation={question.numberValidation}
                onChange={handleNumberValidationChange}
              />
            )}
          </Box>
        )
      default:
        return <Typography sx={{ mt: 2, color: "text.secondary" }}>espaço para respostas</Typography>
    }
  }

  // Helper function to handle button clicks and select the question
  const handleButtonWithSelect = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onSelect) {
      onSelect()
    }
    action()
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: isSelected ? "2px solid" : "none",
        borderColor: isSelected ? "primary.main" : "transparent",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={onSelect}
    >
      {isSelected && (
        <Box
          sx={{
            position: "absolute",
            bottom: -16,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: 4,
            backgroundColor: "primary.main",
            zIndex: 1,
            borderRadius: 4,
          }}
        />
      )}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Escreva sua pergunta aqui"
            value={question.title}
            onChange={handleTitleChange}
            sx={{ mb: 2 }}
            onClick={(e) => e.stopPropagation()}
          />
          {renderAnswerSpace()}
        </Box>
        <Box sx={{ width: 220 }} onClick={(e) => e.stopPropagation()}>
          <QuestionTypeSelector selectedType={question.type} onChange={handleTypeChange} />
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={(e) => {
              e.stopPropagation()
              // First select this question, then add a new one after it
              if (onSelect) {
                onSelect()
              }
              if (onAddQuestion) {
                onAddQuestion()
              }
            }}
            sx={{
              borderRadius: 50,
              px: 2,
              py: 1,
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            }}
          >
            Nova pergunta
          </Button>

          <Tooltip title={isFirstQuestion ? "Esta é a primeira pergunta" : ""} placement="top">
            <span>
              <Button
                variant="outlined"
                startIcon={<ArrowUpwardIcon />}
                onClick={handleButtonWithSelect(onMoveUp)}
                disabled={isFirstQuestion}
                sx={{
                  borderRadius: 50,
                  px: 2,
                  py: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  opacity: isFirstQuestion ? 0.5 : 1,
                  cursor: isFirstQuestion ? "not-allowed" : "pointer",
                  minWidth: "100px",
                }}
              >
                Sobe
              </Button>
            </span>
          </Tooltip>

          <Tooltip title={isLastQuestion ? "Esta é a última pergunta" : ""} placement="top">
            <span>
              <Button
                variant="outlined"
                startIcon={<ArrowDownwardIcon />}
                onClick={handleButtonWithSelect(onMoveDown)}
                disabled={isLastQuestion}
                sx={{
                  borderRadius: 50,
                  px: 2,
                  py: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  opacity: isLastQuestion ? 0.5 : 1,
                  cursor: isLastQuestion ? "not-allowed" : "pointer",
                  minWidth: "100px",
                }}
              >
                Desce
              </Button>
            </span>
          </Tooltip>

          <Tooltip
            title={isLastQuestion && isFirstQuestion ? "Não é possível excluir a única pergunta do formulário" : ""}
            placement="top"
          >
            <span>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!(isLastQuestion && isFirstQuestion)) {
                    onDelete(question.id)
                  }
                }}
                sx={{
                  borderRadius: 50,
                  px: 2,
                  py: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  opacity: isLastQuestion && isFirstQuestion ? 0.5 : 1,
                  cursor: isLastQuestion && isFirstQuestion ? "not-allowed" : "pointer",
                }}
                disabled={isLastQuestion && isFirstQuestion}
              >
                Excluir pergunta
              </Button>
            </span>
          </Tooltip>
        </Box>

        <FormControlLabel
          control={<Switch checked={question.required || false} onChange={handleRequiredChange} color="primary" />}
          label="Obrigatória"
          labelPlacement="start"
        />
      </Box>
    </Paper>
  )
}
