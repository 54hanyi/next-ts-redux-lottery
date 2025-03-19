import { useState } from "react";
import { Typography, Checkbox, Stack } from "@mui/material";
import LotteryDialog from "./LotteryDialog";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  storageKey: string; // "skipDrawConfirm" or "skipRedrawConfirm"
  description?: string;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  storageKey,
  description,
}: ConfirmDialogProps) {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const handleConfirm = () => {
    if (dontAskAgain) {
      localStorage.setItem(storageKey, "true");
    }
    onConfirm();
    onClose();
  };

  return (
    <LotteryDialog
      open={open}
      onClose={onClose}
      title="確認"
      actions={[
        { text: "取消", onClick: onClose, variantColor: "blue" },
        { text: "確定", onClick: handleConfirm, variantColor: "gold" },
      ]}
    >
      {description && (
        <Typography sx={{ my: 16, fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          {description}
        </Typography>
      )}

      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
        <Checkbox
          checked={dontAskAgain}
          onChange={() => setDontAskAgain((prev) => !prev)}
        />
        <Typography sx={{ fontWeight: "bold" }}>不再提醒</Typography>
      </Stack>
    </LotteryDialog>
  );
}
