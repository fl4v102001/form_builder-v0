"use client"

import { Fab, Tooltip, useTheme as useMuiTheme } from "@mui/material"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import { useTheme } from "@/contexts/ThemeContext"

export default function ThemeToggle() {
  const { mode, toggleTheme } = useTheme()
  const muiTheme = useMuiTheme()

  return (
    <Tooltip title={mode === "light" ? "Mudar para tema escuro" : "Mudar para tema claro"}>
      <Fab
        onClick={toggleTheme}
        color="primary"
        aria-label="toggle theme"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: 'scale(1.1)',
          },
        }}
      >
        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </Fab>
    </Tooltip>
  )
}
