"use client"

import { useState } from "react"
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Divider,
} from "@mui/material"
import ShortTextIcon from "@mui/icons-material/ShortText"
import SubjectIcon from "@mui/icons-material/Subject"
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked"
import CheckBoxIcon from "@mui/icons-material/CheckBox"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import NumbersIcon from "@mui/icons-material/Numbers"
import { QuestionType } from "@/types/form"

interface QuestionTypeSelectorProps {
  selectedType: QuestionType
  onChange: (type: QuestionType) => void
}

export default function QuestionTypeSelector({ selectedType, onChange }: QuestionTypeSelectorProps) {
  const [open, setOpen] = useState(false)

  const handleToggle = () => {
    setOpen(!open)
  }

  const handleSelect = (type: QuestionType) => {
    onChange(type)
    setOpen(false)
  }

  const getTypeLabel = (type: QuestionType): string => {
    switch (type) {
      case QuestionType.SHORT_ANSWER:
        return "Resposta curta"
      case QuestionType.PARAGRAPH:
        return "Parágrafo"
      case QuestionType.MULTIPLE_CHOICE:
        return "Múltipla escolha"
      case QuestionType.CHECKBOXES:
        return "Caixas de seleção"
      case QuestionType.DROPDOWN:
        return "Lista suspensa"
      case QuestionType.DATE:
        return "Data"
      case QuestionType.NUMBER:
        return "Número"
      default:
        return "Resposta curta"
    }
  }

  const getTypeIcon = (type: QuestionType) => {
    switch (type) {
      case QuestionType.SHORT_ANSWER:
        return <ShortTextIcon />
      case QuestionType.PARAGRAPH:
        return <SubjectIcon />
      case QuestionType.MULTIPLE_CHOICE:
        return <RadioButtonCheckedIcon />
      case QuestionType.CHECKBOXES:
        return <CheckBoxIcon />
      case QuestionType.DROPDOWN:
        return <ArrowDropDownIcon />
      case QuestionType.DATE:
        return <CalendarTodayIcon />
      case QuestionType.NUMBER:
        return <NumbersIcon />
      default:
        return <ShortTextIcon />
    }
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Tipo de Pergunta
      </Typography>
      <Box
        onClick={handleToggle}
        sx={{
          cursor: "pointer",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: 1,
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ListItemIcon sx={{ minWidth: 36 }}>{getTypeIcon(selectedType)}</ListItemIcon>
          <ListItemText primary={getTypeLabel(selectedType)} />
        </Box>
        <ArrowDropDownIcon />
      </Box>

      {open && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            width: "100%",
            zIndex: 1,
            mt: 1,
            maxHeight: 380,
            overflow: "auto",
          }}
        >
          <List sx={{ p: 0 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSelect(QuestionType.SHORT_ANSWER)}
                selected={selectedType === QuestionType.SHORT_ANSWER}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ShortTextIcon />
                </ListItemIcon>
                <ListItemText primary="Resposta curta" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSelect(QuestionType.PARAGRAPH)}
                selected={selectedType === QuestionType.PARAGRAPH}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <SubjectIcon />
                </ListItemIcon>
                <ListItemText primary="Parágrafo" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSelect(QuestionType.MULTIPLE_CHOICE)}
                selected={selectedType === QuestionType.MULTIPLE_CHOICE}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <RadioButtonCheckedIcon />
                </ListItemIcon>
                <ListItemText primary="Múltipla escolha" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSelect(QuestionType.CHECKBOXES)}
                selected={selectedType === QuestionType.CHECKBOXES}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Caixas de seleção" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSelect(QuestionType.DROPDOWN)}
                selected={selectedType === QuestionType.DROPDOWN}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ArrowDropDownIcon />
                </ListItemIcon>
                <ListItemText primary="Lista suspensa" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSelect(QuestionType.DATE)}
                selected={selectedType === QuestionType.DATE}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText primary="Data" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleSelect(QuestionType.NUMBER)}
                selected={selectedType === QuestionType.NUMBER}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <NumbersIcon />
                </ListItemIcon>
                <ListItemText primary="Número" />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>
      )}
    </Box>
  )
}
