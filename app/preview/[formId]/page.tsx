"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  TextField,
  Radio,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  InputAdornment,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { ptBR } from "date-fns/locale/pt-BR"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import {
  type FormData,
  type Question,
  QuestionType,
  NumberValidationType,
  ShortAnswerValidationType,
} from "@/types/form"
import { getForm } from "@/services/formService"
import ThemeToggle from "@/components/ThemeToggle"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`section-tabpanel-${index}`}
      aria-labelledby={`section-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export default function FormPreview() {
  const params = useParams()
  const formId = params.formId as string

  const [form, setForm] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(0)
  const [formResponses, setFormResponses] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [charCounts, setCharCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const loadForm = async () => {
      try {
        // For preview, we'll get the form from localStorage
        const storedForm = localStorage.getItem(`preview_form_${formId}`)
        if (storedForm) {
          setForm(JSON.parse(storedForm))
        } else {
          // If not in localStorage, try to get from the database
          const fetchedForm = await getForm(formId)
          if (fetchedForm) {
            setForm(fetchedForm)
          }
        }
      } catch (error) {
        console.error("Error loading form:", error)
      } finally {
        setLoading(false)
      }
    }

    loadForm()
  }, [formId])

  const handleSectionChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveSection(newValue)
  }

  const handleNext = () => {
    if (form && activeSection < form.sections.length - 1) {
      setActiveSection(activeSection + 1)
    }
  }

  const handlePrevious = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1)
    }
  }

  const handleInputChange = (questionId: string, value: any) => {
    setFormResponses({
      ...formResponses,
      [questionId]: value,
    })

    // Clear error if field is filled
    if (errors[questionId] && value) {
      const newErrors = { ...errors }
      delete newErrors[questionId]
      setErrors(newErrors)
    }
  }

  const handleShortAnswerChange = (questionId: string, value: string) => {
    const question = form?.sections.flatMap((section) => section.questions).find((q) => q.id === questionId)

    if (!question) return

    // Store the raw input value
    handleInputChange(questionId, value)

    // Update character count
    setCharCounts({
      ...charCounts,
      [questionId]: value.length,
    })

    // Validate in real-time
    const errorMessage = validateShortAnswerInput(question, value)
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, [questionId]: errorMessage }))
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const validateSection = (sectionIndex: number): boolean => {
    if (!form) return true

    const section = form.sections[sectionIndex]
    const newErrors: Record<string, string> = {}
    let isValid = true

    for (const question of section.questions) {
      const response = formResponses[question.id]

      // Check required fields
      if (question.required && (response === undefined || response === null || response === "")) {
        newErrors[question.id] = "Este campo é obrigatório"
        isValid = false
      }
      // Validate number inputs
      else if (question.type === QuestionType.NUMBER && response !== undefined && response !== "") {
        const errorMessage = validateNumberInput(question, response)
        if (errorMessage) {
          newErrors[question.id] = errorMessage
          isValid = false
        }
      }
      // Validate short answer inputs
      else if (question.type === QuestionType.SHORT_ANSWER && response !== undefined && response !== "") {
        const errorMessage = validateShortAnswerInput(question, response)
        if (errorMessage) {
          newErrors[question.id] = errorMessage
          isValid = false
        }
      }
    }

    setErrors({ ...errors, ...newErrors })
    return isValid
  }

  const validateNumberInput = (question: Question, value: string): string | null => {
    if (!value && question.required) {
      return "Este campo é obrigatório"
    }

    if (value && question.numberValidation) {
      const numValue = Number(value)

      if (isNaN(numValue)) {
        return "Por favor, insira um número válido"
      }

      switch (question.numberValidation.type) {
        case NumberValidationType.INTEGER:
          if (!Number.isInteger(numValue)) {
            return "O valor deve ser um número inteiro"
          }
          break
        case NumberValidationType.GREATER_THAN_ZERO:
          if (numValue <= 0) {
            return "O valor deve ser maior que zero"
          }
          break
        case NumberValidationType.LESS_THAN_ZERO:
          if (numValue >= 0) {
            return "O valor deve ser menor que zero"
          }
          break
        case NumberValidationType.GREATER_THAN:
          if (
            question.numberValidation.greaterThan !== undefined &&
            numValue <= question.numberValidation.greaterThan
          ) {
            return `O valor deve ser maior que ${question.numberValidation.greaterThan}`
          }
          break
        case NumberValidationType.BETWEEN:
          if (question.numberValidation.min !== undefined && question.numberValidation.max !== undefined) {
            if (numValue < question.numberValidation.min || numValue > question.numberValidation.max) {
              return `O valor deve estar entre ${question.numberValidation.min} e ${question.numberValidation.max}`
            }
          }
          break
        case NumberValidationType.INTEGER_GREATER_THAN_ZERO:
          if (!Number.isInteger(numValue) || numValue <= 0) {
            return "O valor deve ser um inteiro maior que zero"
          }
          break
        case NumberValidationType.INTEGER_LESS_THAN_ZERO:
          if (!Number.isInteger(numValue) || numValue >= 0) {
            return "O valor deve ser um inteiro menor que zero"
          }
          break
        case NumberValidationType.INTEGER_BETWEEN:
          if (
            question.numberValidation.min !== undefined &&
            question.numberValidation.max !== undefined
          ) {
            if (
              !Number.isInteger(numValue) ||
              numValue < question.numberValidation.min ||
              numValue > question.numberValidation.max
            ) {
              return `O valor deve ser um inteiro entre ${question.numberValidation.min} e ${question.numberValidation.max}`
            }
          }
          break
      }
    }

    return null
  }

  const validateShortAnswerInput = (question: Question, value: string): string | null => {
    if (!value && question.required) {
      return "Este campo é obrigatório"
    }

    if (value && question.shortAnswerValidation) {
      switch (question.shortAnswerValidation.type) {
        case ShortAnswerValidationType.MAX_LENGTH:
          if (
            question.shortAnswerValidation.maxLength !== undefined &&
            value.length > question.shortAnswerValidation.maxLength
          ) {
            return `O texto não pode ter mais que ${question.shortAnswerValidation.maxLength} caracteres`
          }
          break
      }
    }

    return null
  }

  const handleNumberChange = (questionId: string, value: string) => {
    const question = form?.sections.flatMap((section) => section.questions).find((q) => q.id === questionId)

    if (!question) return

    // Store the raw input value
    handleInputChange(questionId, value)

    // Validate in real-time
    const errorMessage = validateNumberInput(question, value)
    if (errorMessage) {
      setErrors((prev) => ({ ...prev, [questionId]: errorMessage }))
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Formulário enviado com sucesso!")
    console.log("Form responses:", formResponses)
  }

  const renderQuestionInput = (question: Question) => {
    const isRequired = question.required
    const hasError = !!errors[question.id]

    switch (question.type) {
      case QuestionType.SHORT_ANSWER:
        const maxLength =
          question.shortAnswerValidation?.type === ShortAnswerValidationType.MAX_LENGTH
            ? question.shortAnswerValidation.maxLength
            : undefined
        const currentLength = charCounts[question.id] || 0

        return (
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={formResponses[question.id] || ""}
              onChange={(e) => handleShortAnswerChange(question.id, e.target.value)}
              error={hasError}
              helperText={hasError ? errors[question.id] : maxLength ? `${currentLength}/${maxLength} caracteres` : ""}
              required={isRequired}
              inputProps={{
                maxLength: maxLength ? maxLength + 10 : undefined, // Allow a bit over to show the error
              }}
            />
          </Box>
        )
      case QuestionType.PARAGRAPH:
        return (
          <TextField
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formResponses[question.id] || ""}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            error={hasError}
            helperText={hasError ? errors[question.id] : ""}
            required={isRequired}
            sx={{ mt: 1 }}
          />
        )
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <Box sx={{ mt: 1 }}>
            {question.options?.map((option) => (
              <FormControlLabel
                key={option.id}
                control={
                  <Radio
                    checked={formResponses[question.id] === option.id}
                    onChange={() => handleInputChange(question.id, option.id)}
                  />
                }
                label={option.value}
              />
            ))}
            {hasError && <FormHelperText error>{errors[question.id]}</FormHelperText>}
          </Box>
        )
      case QuestionType.CHECKBOXES:
        return (
          <Box sx={{ mt: 1 }}>
            {question.options?.map((option) => (
              <FormControlLabel
                key={option.id}
                control={
                  <Checkbox
                    checked={formResponses[question.id]?.includes(option.id) || false}
                    onChange={(e) => {
                      const currentValues = formResponses[question.id] || []
                      const newValues = e.target.checked
                        ? [...currentValues, option.id]
                        : currentValues.filter((id: string) => id !== option.id)
                      handleInputChange(question.id, newValues)
                    }}
                  />
                }
                label={option.value}
              />
            ))}
            {hasError && <FormHelperText error>{errors[question.id]}</FormHelperText>}
          </Box>
        )
      case QuestionType.DROPDOWN:
        return (
          <FormControl fullWidth sx={{ mt: 1 }} error={hasError} required={isRequired}>
            <InputLabel>Selecione uma opção</InputLabel>
            <Select
              value={formResponses[question.id] || ""}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              label="Selecione uma opção"
            >
              {question.options?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.value}
                </MenuItem>
              ))}
            </Select>
            {hasError && <FormHelperText>{errors[question.id]}</FormHelperText>}
          </FormControl>
        )
      case QuestionType.DATE:
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              value={formResponses[question.id] || null}
              onChange={(newValue) => handleInputChange(question.id, newValue)}
              sx={{ mt: 1, width: "100%" }}
              slotProps={{
                textField: {
                  variant: "outlined",
                  fullWidth: true,
                  error: hasError,
                  helperText: hasError ? errors[question.id] : "",
                  required: isRequired,
                },
              }}
            />
          </LocalizationProvider>
        )
      case QuestionType.NUMBER:
        return (
          <TextField
            fullWidth
            type="number"
            variant="outlined"
            value={formResponses[question.id] || ""}
            onChange={(e) => handleNumberChange(question.id, e.target.value)}
            error={hasError}
            helperText={hasError ? errors[question.id] : getValidationHint(question)}
            required={isRequired}
            sx={{ mt: 1 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">#</InputAdornment>,
            }}
          />
        )
      default:
        return null
    }
  }

  // Helper function to provide hints about validation rules
  const getValidationHint = (question: Question): string => {
    if (
      question.type === QuestionType.NUMBER &&
      question.numberValidation &&
      question.numberValidation.type !== NumberValidationType.NONE
    ) {
      switch (question.numberValidation.type) {
        case NumberValidationType.INTEGER:
          return "Digite um número inteiro"
        case NumberValidationType.GREATER_THAN_ZERO:
          return "Digite um número maior que zero"
        case NumberValidationType.LESS_THAN_ZERO:
          return "Digite um número menor que zero"
        case NumberValidationType.GREATER_THAN:
          return `Digite um número maior que ${question.numberValidation.greaterThan}`
        case NumberValidationType.BETWEEN:
          return `Digite um número entre ${question.numberValidation.min} e ${question.numberValidation.max}`
        default:
          return ""
      }
    } else if (
      question.type === QuestionType.SHORT_ANSWER &&
      question.shortAnswerValidation &&
      question.shortAnswerValidation.type !== ShortAnswerValidationType.NONE
    ) {
      switch (question.shortAnswerValidation.type) {
        case ShortAnswerValidationType.MAX_LENGTH:
          return `Máximo de ${question.shortAnswerValidation.maxLength} caracteres`
        default:
          return ""
      }
    }

    return ""
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Carregando formulário...</Typography>
      </Container>
    )
  }

  if (!form) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Formulário não encontrado
          </Typography>
          <Typography>O formulário solicitado não foi encontrado ou não está disponível para visualização.</Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <ThemeToggle />
      </Box>
      <form onSubmit={handleSubmit}>
        <Paper elevation={2} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {form.title}
          </Typography>
          {form.description && (
            <Typography variant="body1" color="text.secondary" paragraph>
              {form.description}
            </Typography>
          )}
        </Paper>

        {form.sections.length > 1 && (
          <Paper elevation={1} sx={{ borderRadius: 2 }}>
            <Tabs
              value={activeSection}
              onChange={handleSectionChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              {form.sections.map((section, index) => (
                <Tab
                  key={section.id}
                  label={section.title || `Seção ${index + 1}`}
                  id={`section-tab-${index}`}
                  aria-controls={`section-tabpanel-${index}`}
                />
              ))}
            </Tabs>
          </Paper>
        )}

        {form.sections.map((section, index) => (
          <TabPanel key={section.id} value={activeSection} index={index}>
            <Paper elevation={2} sx={{ p: 4, mb: 3, borderRadius: 2 }}>
              {/* Section title */}
              {section.title && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" component="h2">
                    {section.title}
                  </Typography>
                </Box>
              )}

              {/* Questions container */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {section.questions.map((question) => (
                  <Paper 
                    key={question.id} 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="h6" component="h3" sx={{ display: "flex", alignItems: "center" }}>
                      {question.title}
                      {question.required && (
                        <Box component="span" sx={{ color: "error.main", ml: 0.5 }}>
                          *
                        </Box>
                      )}
                    </Typography>
                    {renderQuestionInput(question)}
                  </Paper>
                ))}
              </Box>
            </Paper>
          </TabPanel>
        ))}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 5 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handlePrevious}
            disabled={activeSection === 0}
            sx={{ borderRadius: 50, px: 3 }}
          >
            Anterior
          </Button>

          {activeSection < form.sections.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => {
                if (validateSection(activeSection)) {
                  handleNext()
                }
              }}
              sx={{ borderRadius: 50, px: 3 }}
            >
              Próximo
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={(e) => {
                if (validateSection(activeSection)) {
                  handleSubmit(e)
                } else {
                  e.preventDefault()
                }
              }}
              sx={{ borderRadius: 50, px: 3 }}
            >
              Enviar
            </Button>
          )}
        </Box>
      </form>
    </Container>
  )
}
