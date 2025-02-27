import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useState } from "react";

interface ConfirmDialogProps {
  open: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
}: ConfirmDialogProps) {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const handleConfirm = () => {
    if (dontAskAgain) {
      localStorage.setItem("skipConfirm", "true")
    }

    onConfirm(); //抽獎
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>通知</DialogTitle>
        <DialogContent>
          確認要抽獎嗎？
          <FormControlLabel
            control={<Checkbox checked={dontAskAgain} onChange={() => setDontAskAgain(!dontAskAgain)} />}
            label="不再提醒"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">取消</Button>
          <Button onClick={handleConfirm} color="primary">確定</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}