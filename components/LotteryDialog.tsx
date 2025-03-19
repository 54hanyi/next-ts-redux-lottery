import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { styled } from "@mui/system";
import Grid2 from "@mui/material/Grid2";

// 定義 LotteryDialog Props
interface LotteryDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: { 
    text: string; 
    onClick: () => void; 
    variantColor?: "gold" | "blue"; 
    disabled?: boolean;
  }[];
}

// **標題樣式**
const StyledDialogTitle = styled(DialogTitle)({
  background: "linear-gradient(to bottom, #4e3d28, #2f2214)",
  color: "#ffd782",
  textAlign: "center",
  fontSize: "28px",
  fontWeight: "bold",
  padding: "16px 0",
  borderBottom: "2px solid #c89b56",
});

// **主要內容樣式**
const StyledDialogContent = styled(DialogContent)({
  background: "linear-gradient(to bottom, #fffaf0, #f5e3c9)",
  minHeight: "360px",
  maxHeight: "500px",
  textAlign: "center",
});

// **按鈕樣式 (過濾 variantColor 屬性)**
const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "variantColor",
})<{ variantColor?: "gold" | "blue" }>(({ variantColor }) => ({
  padding: "16px 64px",
  margin: "16px",
  fontSize: "20px",
  fontWeight: "bold",
  textTransform: "none",
  transition: "all 0.3s ease",
  background:
    variantColor === "gold"
      ? "linear-gradient(to bottom, #e6c083, #c89b56)"
      : "linear-gradient(to bottom, #78c0e0, #4e89b7)",
  color: variantColor === "gold" ? "#4f2f00" : "#fff",
  "&:hover": {
    background:
      variantColor === "gold"
        ? "linear-gradient(to bottom, #ffe9b5, #e6b749)"
        : "linear-gradient(to bottom, #a0d8ef, #4e89b7)",
  },
}));

export default function LotteryDialog({ open, onClose, title, children, actions }: LotteryDialogProps) {
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <StyledDialogTitle>{title}</StyledDialogTitle>
        <StyledDialogContent>{children}</StyledDialogContent>
        <DialogActions sx={{ justifyContent: "center", background: "#f5e3c9" }}>
          <Grid2 container spacing={2} justifyContent="center">
            {actions?.map((action, index) => (
              <Grid2 key={index}>
                <StyledButton variantColor={action.variantColor} onClick={action.onClick} disabled={action.disabled}>
                  {action.text}
                </StyledButton>
              </Grid2>
            ))}
          </Grid2>
        </DialogActions>
      </Dialog>
    </>
  );
}
