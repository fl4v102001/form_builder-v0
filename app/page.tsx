"use client"

import { useState } from "react"
import FormBuilder from "@/components/FormBuilder"
import type { FormData, QuestionType, ShortAnswerValidationType } from "@/types/form"
import { v4 as uuidv4 } from "uuid"
import { Box, Typography } from "@mui/material"
import ThemeToggle from "@/components/ThemeToggle"

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    id: `form-${uuidv4()}`, // Use a prefix to identify new forms
    title: "",
    description: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ownerUid: "user-temp-id", // This would be set when saving
    sections: [
      {
        id: uuidv4(),
        title: "",
        order: 0,
        questions: [
          {
            // Initialize with one default empty question
            id: uuidv4(),
            order: 0,
            title: "",
            type: "SHORT_ANSWER" as QuestionType,
            required: false,
            shortAnswerValidation: {
              type: "NONE" as ShortAnswerValidationType,
            },
          },
        ],
      },
    ],
  })

  const handleFormChange = (updatedForm: FormData) => {
    setFormData({
      ...updatedForm,
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <main className="container mx-auto p-4">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Form Builder
        </Typography>
        <ThemeToggle />
      </Box>
      <FormBuilder formData={formData} onChange={handleFormChange} />
    </main>
  )
}
