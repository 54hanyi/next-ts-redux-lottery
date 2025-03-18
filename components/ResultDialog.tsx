import { Typography, Box } from "@mui/material";
import Image from "next/image";
import LotteryDialog from "./LotteryDialog";

interface ResultDialogProps {
  open: boolean;
  onClose: () => void;
  rewards: { name: string; image: string }[];
}

export default function ResultDialog({ open, onClose, rewards }: ResultDialogProps) {
  return (
    <LotteryDialog
      open={open}
      onClose={onClose}
      title="恭喜"
      actions={[{ text: "確定", onClick: onClose, variantColor: "gold" }]}
    >
      <Typography variant="h6">您獲得了以下獎勵：</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {rewards.map((reward, index) => (
          <Box key={index} sx={{ textAlign: "center", mx: 1 }}>
            <Image src={reward.image} alt={reward.name} width={80} height={80} />
            <Typography>{reward.name}</Typography>
          </Box>
        ))}
      </Box>
    </LotteryDialog>
  );
}
