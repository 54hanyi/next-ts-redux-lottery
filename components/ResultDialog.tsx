import { Typography, Box } from "@mui/material";
import Image from "next/image";
import Grid2 from "@mui/material/Grid2";
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
      <Typography variant="h6" sx={{ textAlign: "center", my: 3, fontWeight: "bold" }}>
        您獲得了以下獎勵：
      </Typography>

      {/* 判斷獎勵數量 */}
      {rewards.length === 1 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          <Image src={rewards[0].image} alt={rewards[0].name} width={100} height={100} />
          <Typography sx={{ mt: 0.4, maxWidth: "98px", fontSize: 16 }}>
            {rewards[0].name}
          </Typography>
        </Box>
      ) : (
        <Grid2 container spacing={1} justifyContent="center">
          {rewards.map((reward, index) => (
            <Grid2
              key={index}
              component="div"
              sx={{
                width: "18%", // 每行最多 5 個獎勵
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: 100, height: 100, position: "relative" }}>
                <Image src={reward.image} alt={reward.name} width={100} height={100} />
              </Box>
              <Typography
                sx={{
                  mt: 0.4,
                  maxWidth: "98px",
                  fontSize: 16,
                }}
              >
                {reward.name}
              </Typography>
            </Grid2>
          ))}
        </Grid2>
      )}
    </LotteryDialog>
  );
}
