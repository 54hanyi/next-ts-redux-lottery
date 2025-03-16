import { Button, styled } from "@mui/material";

interface FancyButtonProps {
  disabled?: boolean;
}

const FancyButton = styled(Button)<FancyButtonProps>(({ disabled }) => ({
  position: "relative",
  display: "inline-block !important",
  background: disabled
  ? "linear-gradient(to bottom, rgba(211, 211, 211, 1), rgba(169, 169, 169, 1))"
  : "linear-gradient(to bottom, rgba(238, 232, 170, 1), rgba(184, 134, 66, 0.8))",
  clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%) !important",
  color: "#4f2f00",
  padding: "20px 50px",
  fontWeight: "bold",
  fontSize: "24px",
  textTransform: "uppercase",
  cursor: disabled ? "not-allowed" : "pointer",
  border: disabled ? "2px solid #a9a9a9" : "none",
  transition: "0.3s",
  outline: "none",
  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",

  "&::before": {
    content: '""',
    position: "absolute",
    top: "-5px",
    left: "-5px",
    right: "-5px",
    bottom: "-5px",
    clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
    zIndex: -1,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255, 255, 255, 0.2)",
    clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
    opacity: 0,
    transition: "opacity 0.3s",
  },

  "&:hover::after": {
    opacity: disabled ? 0 : 1,
  },
}));

export default FancyButton;
