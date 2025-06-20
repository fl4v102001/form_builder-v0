"use client"

import type React from "react"

import { useState } from "react"
import { Paper, TextField, Button, Container, Tabs, Tab, Box } from "@mui/material"
import SplitscreenIcon from "@mui/icons-material/Splitscreen"
import DeleteIcon from "@mui/icons-material/Delete"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { type FormData, type Section, type Question, QuestionType } from "@/types/form"
import QuestionBuilder from "./QuestionBuilder"
import { v4 as uuidv4 } from "uuid"
import SaveIcon from "@mui/icons-material/Save"
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { saveForm, updateForm } from "@/services/formService"
import { CustomToast } from "@/components/ui/custom-toast"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"

interface FormBuilderProps {
  formData: FormData
  onChange: (formData: FormData) => void
}

export default function FormBuilder({ formData, onChange }: FormBuilderProps) {
  const [activeSection, setActiveSection] = useState<string>(formData.sections[0]?.id || "")
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  })
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...formData,
      title: e.target.value,
    })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...formData,
      description: e.target.value,
    })
  }

  const addNewQuestion = () => {
    const section = formData.sections.find((s) => s.id === activeSection)
    if (!section) return

    const newQuestion: Question = {
      id: uuidv4(),
      order: 0, // Temporary order, will be updated below
      title: "",
      type: QuestionType.SHORT_ANSWER,
    }

    // If a question is selected, insert after it
    // Otherwise, add to the end of the section
    let updatedQuestions
    if (selectedQuestionId) {
      const selectedQuestionIndex = section.questions.findIndex((q) => q.id === selectedQuestionId)
      if (selectedQuestionIndex !== -1) {
        // Insert after the selected question
        updatedQuestions = [
          ...section.questions.slice(0, selectedQuestionIndex + 1),
          newQuestion,
          ...section.questions.slice(selectedQuestionIndex + 1),
        ]
      } else {
        // Fallback: add to the end
        updatedQuestions = [...section.questions, newQuestion]
      }
    } else {
      // No question selected, add to the end
      updatedQuestions = [...section.questions, newQuestion]
    }

    // Update the order of all questions
    const reorderedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      order: index,
    }))

    const updatedSections = formData.sections.map((s) => {
      if (s.id === activeSection) {
        return {
          ...s,
          questions: reorderedQuestions,
        }
      }
      return s
    })

    onChange({
      ...formData,
      sections: updatedSections,
    })

    // Set the new question as selected
    setSelectedQuestionId(newQuestion.id)
  }

  const addNewSection = () => {
    const newSection: Section = {
      id: uuidv4(),
      title: `Nova Seção ${formData.sections.length + 1}`,
      order: formData.sections.length,
      questions: [
        // Initialize new sections with one default question
        {
          id: uuidv4(),
          order: 0,
          title: "",
          type: QuestionType.SHORT_ANSWER,
        },
      ],
    }

    onChange({
      ...formData,
      sections: [...formData.sections, newSection],
    })

    setActiveSection(newSection.id)
    setSelectedQuestionId(null)
  }

  const updateQuestion = (sectionId: string, updatedQuestion: Question) => {
    const updatedSections = formData.sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)),
        }
      }
      return section
    })

    onChange({
      ...formData,
      sections: updatedSections,
    })
  }

  const deleteQuestion = (sectionId: string, questionId: string) => {
    const section = formData.sections.find((s) => s.id === sectionId)

    // Check if this is the last question in the section
    if (section && section.questions.length <= 1) {
      // Show warning toast
      setToast({
        open: true,
        message: "Não é possível excluir a única pergunta do formulário.",
        severity: "warning",
      })
      return
    }

    const updatedSections = formData.sections.map((section) => {
      if (section.id === sectionId) {
        // Remove the question and reorder remaining questions
        const filteredQuestions = section.questions.filter((q) => q.id !== questionId)
        const reorderedQuestions = filteredQuestions.map((q, index) => ({
          ...q,
          order: index,
        }))

        return {
          ...section,
          questions: reorderedQuestions,
        }
      }
      return section
    })

    onChange({
      ...formData,
      sections: updatedSections,
    })

    // If the deleted question was selected, clear the selection
    if (selectedQuestionId === questionId) {
      setSelectedQuestionId(null)
    }
  }

  // New function to move a question up
  const moveQuestionUp = (sectionId: string, questionId: string) => {
    const section = formData.sections.find((s) => s.id === sectionId)
    if (!section) return

    const questions = [...section.questions].sort((a, b) => a.order - b.order)
    const questionIndex = questions.findIndex((q) => q.id === questionId)

    // Check if question is already at the top
    if (questionIndex <= 0) return

    // Swap with the question above it
    const updatedQuestions = [...questions]
    const temp = updatedQuestions[questionIndex]
    updatedQuestions[questionIndex] = updatedQuestions[questionIndex - 1]
    updatedQuestions[questionIndex - 1] = temp

    // Update order property for all questions
    const reorderedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      order: index,
    }))

    const updatedSections = formData.sections.map((s) => {
      if (s.id === sectionId) {
        return {
          ...s,
          questions: reorderedQuestions,
        }
      }
      return s
    })

    onChange({
      ...formData,
      sections: updatedSections,
    })
  }

  // New function to move a question down
  const moveQuestionDown = (sectionId: string, questionId: string) => {
    const section = formData.sections.find((s) => s.id === sectionId)
    if (!section) return

    const questions = [...section.questions].sort((a, b) => a.order - b.order)
    const questionIndex = questions.findIndex((q) => q.id === questionId)

    // Check if question is already at the bottom
    if (questionIndex >= questions.length - 1 || questionIndex === -1) return

    // Swap with the question below it
    const updatedQuestions = [...questions]
    const temp = updatedQuestions[questionIndex]
    updatedQuestions[questionIndex] = updatedQuestions[questionIndex + 1]
    updatedQuestions[questionIndex + 1] = temp

    // Update order property for all questions
    const reorderedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      order: index,
    }))

    const updatedSections = formData.sections.map((s) => {
      if (s.id === sectionId) {
        return {
          ...s,
          questions: reorderedQuestions,
        }
      }
      return s
    })

    onChange({
      ...formData,
      sections: updatedSections,
    })
  }

  const getQuestionsInSection = (sectionId: string): Question[] => {
    const section = formData.sections.find((s) => s.id === sectionId)
    return section ? [...section.questions].sort((a, b) => a.order - b.order) : []
  }

  const handleSectionChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveSection(newValue)
    setSelectedQuestionId(null)
  }

  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    const updatedSections = formData.sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          title: newTitle,
        }
      }
      return section
    })

    onChange({
      ...formData,
      sections: updatedSections,
    })
  }

  const handleDeleteSectionClick = () => {
    setDeleteConfirmOpen(true)
  }

  const handleDeleteSectionConfirm = () => {
    if (formData.sections.length <= 1) {
      // If this is the only section, reset it instead of deleting
      const resetSection = {
        ...formData.sections[0],
        title: "",
        questions: [
          // Ensure there's at least one question
          {
            id: uuidv4(),
            order: 0,
            title: "",
            type: QuestionType.SHORT_ANSWER,
          },
        ],
      }

      onChange({
        ...formData,
        sections: [resetSection],
      })
    } else {
      // Find the index of the active section
      const activeSectionIndex = formData.sections.findIndex((s) => s.id === activeSection)

      // Create a new array without the active section
      const updatedSections = formData.sections.filter((s) => s.id !== activeSection)

      // Reorder the remaining sections
      const reorderedSections = updatedSections.map((section, index) => ({
        ...section,
        order: index,
      }))

      // Determine the new active section (previous section or first section)
      const newActiveSectionIndex = Math.max(0, Math.min(activeSectionIndex - 1, reorderedSections.length - 1))
      const newActiveSection = reorderedSections[newActiveSectionIndex].id

      onChange({
        ...formData,
        sections: reorderedSections,
      })

      setActiveSection(newActiveSection)
    }

    setDeleteConfirmOpen(false)
    setSelectedQuestionId(null)

    setToast({
      open: true,
      message: "Seção excluída com sucesso!",
      severity: "success",
    })
  }

  const handleDeleteSectionCancel = () => {
    setDeleteConfirmOpen(false)
  }

  const handlePreviewClick = () => {
    // Store the current form data in localStorage for the preview
    localStorage.setItem(`preview_form_${formData.id}`, JSON.stringify(formData))

    // Open the preview in a new tab
    window.open(`/preview/${formData.id}`, "_blank")
  }

  const handleSaveForm = async () => {
    if (!formData.title.trim()) {
      setToast({
        open: true,
        message: "Por favor, adicione um título ao formulário",
        severity: "warning",
      })
      return
    }

    try {
      setIsSaving(true)

      // Update the timestamps
      const updatedForm = {
        ...formData,
        updatedAt: new Date().toISOString(),
      }

      if (updatedForm.id.startsWith("form-")) {
        // This is a new form, save it
        const formId = await saveForm(updatedForm)
        onChange({
          ...updatedForm,
          id: formId,
        })
      } else {
        // This is an existing form, update it
        await updateForm(updatedForm.id, updatedForm)
      }

      setToast({
        open: true,
        message: "Formulário salvo com sucesso!",
        severity: "success",
      })
    } catch (error) {
      console.error("Error saving form:", error)
      setToast({
        open: true,
        message: "Erro ao salvar formulário. Por favor, tente novamente.",
        severity: "error",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCloseToast = () => {
    setToast({ ...toast, open: false })
  }

  const handleQuestionSelect = (questionId: string) => {
    // Always set the selected question ID (don't toggle it off)
    setSelectedQuestionId(questionId)
  }

  const questionsInActiveSection = getQuestionsInSection(activeSection)

  // Add section tabs for better navigation between sections
  const renderSectionTabs = () => {
    return (
      <Tabs
        value={activeSection}
        onChange={handleSectionChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {formData.sections.map((section) => (
          <Tab key={section.id} label={section.title || `Seção ${section.order + 1}`} value={section.id} />
        ))}
      </Tabs>
    )
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Título do Formulário"
          value={formData.title}
          onChange={handleTitleChange}
          sx={{ mb: 2 }}
          InputProps={{
            sx: { fontSize: "1.2rem" },
          }}
        />
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Descrição do formulário"
          value={formData.description}
          onChange={handleDescriptionChange}
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={handlePreviewClick}
            sx={{
              borderRadius: 50,
              px: 3,
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            }}
          >
            Preview
          </Button>

          <Button
            variant="outlined"
            startIcon={<SaveAltIcon />}
            onClick={handleSaveForm}
            disabled={isSaving}
            sx={{
              borderRadius: 50,
              px: 3,
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            }}
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </Box>
      </Paper>

      {formData.sections.length > 1 && renderSectionTabs()}

      {formData.sections.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Título da Seção"
            value={formData.sections.find((s) => s.id === activeSection)?.title || ""}
            onChange={(e) => handleSectionTitleChange(activeSection, e.target.value)}
            InputProps={{
              sx: { fontSize: "1.1rem" },
            }}
          />
        </Paper>
      )}

      {questionsInActiveSection.map((question, index) => (
        <QuestionBuilder
          key={question.id}
          question={question}
          onChange={(updatedQuestion) => updateQuestion(activeSection, updatedQuestion)}
          onDelete={(questionId) => deleteQuestion(activeSection, questionId)}
          isSelected={question.id === selectedQuestionId}
          onSelect={() => handleQuestionSelect(question.id)}
          onAddQuestion={addNewQuestion}
          onMoveUp={() => moveQuestionUp(activeSection, question.id)}
          onMoveDown={() => moveQuestionDown(activeSection, question.id)}
          isFirstQuestion={index === 0}
          isLastQuestion={index === questionsInActiveSection.length - 1}
        />
      ))}

      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<SplitscreenIcon />}
              onClick={addNewSection}
              sx={{
                borderRadius: 50,
                px: 3,
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              }}
            >
              Nova Seção
            </Button>

            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSectionClick}
              sx={{
                borderRadius: 50,
                px: 3,
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                color: "error.main",
              }}
            >
              Excluir Seção
            </Button>
          </Box>
        </Box>
      </Paper>

      <ConfirmationModal
        open={deleteConfirmOpen}
        title="Excluir Seção"
        message="Tem certeza que deseja excluir esta seção e todo o seu conteúdo? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteSectionConfirm}
        onCancel={handleDeleteSectionCancel}
      />

      <CustomToast open={toast.open} message={toast.message} severity={toast.severity} onClose={handleCloseToast} />
    </Container>
  )
}
