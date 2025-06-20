"use client"

import { useState, useEffect } from "react"
import { Alert, type AlertProps, Fade, Box } from "@mui/material"

interface CustomToastProps {
  open: boolean
  message: string
  severity?: AlertProps["severity"]
  onClose: () => void
  autoHideDuration?: number
}

export function CustomToast({
  open,
  message,
  severity = "success",
  onClose,
  autoHideDuration = 6000,
}: CustomToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for fade out animation before calling onClose
      }, autoHideDuration)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [open, autoHideDuration, onClose])

  if (!open && !isVisible) return null

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        maxWidth: "90%",
        width: "auto",
      }}
    >
      <Fade in={isVisible}>
        <Alert
          severity={severity}
          onClose={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          sx={{
            boxShadow: 3,
            minWidth: "200px",
          }}
        >
          {message}
        </Alert>
      </Fade>
    </Box>
  )
}
