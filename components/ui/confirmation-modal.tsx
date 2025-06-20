"use client"
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

interface ConfirmationModalProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({ open, title, message, onConfirm, onCancel }: ConfirmationModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: "400px",
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" sx={{ pr: 6 }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onCancel} variant="outlined" sx={{ borderRadius: 50, px: 3 }}>
          Não
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" sx={{ borderRadius: 50, px: 3 }} autoFocus>
          Sim
        </Button>
      </DialogActions>
    </Dialog>
  )
}
