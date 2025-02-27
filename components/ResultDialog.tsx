import { Dialog, DialogContent, DialogActions, DialogTitle, Button, Typography, Box } from "@mui/material";


interface ResultDialogProps {
  open: boolean;
  onClose: () => void;
  rewards: string[];
}

export default function ResultDialog({
  open,
  onClose,
  rewards,
}: ResultDialogProps) {
  return(
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>🎉 恭喜 🎉</DialogTitle>
        <DialogContent>
        {/* Typography為文字排版元件 */}
          <Typography variant="h6">您獲得了以下獎勵：</Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              mt: 2,
            }}
          >
            {rewards.map((item, index) => (
              <Typography key={index}>🎁 {item}</Typography> 
            ))}
          </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">確定</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
