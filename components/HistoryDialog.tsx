import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { removeRewards } from "@/store/rewardHistorySlice";


interface HistoryDialogProps {
  open: boolean;
  onClose: () => void;
  onRedraw: (count: number) => void;
}

/**
 * 在這個視窗中顯示「歷史獎勵」，可勾選後：
 * 1. 再抽獎 (需要每 3 個獎勵才換一次)
 * 2. 兌換 (刪除)
*/

export default function HistoryDialog({ open, onClose, onRedraw }: HistoryDialogProps) {
  const dispatch = useDispatch<AppDispatch>();

  // 從 Redux 取得歷史獎勵
  const { history } = useSelector((state: RootState) => state.rewardHistory);
  // 勾選的獎勵 ID 清單
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // 視窗關閉時重置勾選
  useEffect(() => {
    if(!open) {
      setSelectedIds([]);
    };
  }, [open]);

  const handleToggle = (id: string) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id) 
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const canSelectMore = selectedIds.length < 30;

  //3抽換1抽
  const handleRedeemForRedraw = () => {
    if(selectedIds.length === 0 || selectedIds.length % 3 !== 0) {
      alert("請選擇 3 的倍數個獎勵再抽獎！");
      return;
    }
    const times = selectedIds.length / 3;
    alert(`你選取了 ${selectedIds.length} 個獎勵，兌換 ${times} 次重抽機會！`);
    // 這邊可以呼叫 Home 裡的抽獎函式 or 其他邏輯
    onRedraw(times);
    dispatch(removeRewards(selectedIds));
    setSelectedIds([]);
  };

  // 兌換(暫時為刪除)
  const handleRedeem = () => {
    if(selectedIds.length === 0) {
      alert("請先選取要兌換的獎勵");
      return;
    }
    dispatch(removeRewards(selectedIds));
    setSelectedIds([]);
  };

  //快速選取
  const handleQuickSelect = () => {
    if(history.length < 3) {
      alert("目前沒有足夠的獎勵可選擇（至少需要 3 個）！");
      return;
    }

    const maxSelectable = Math.min(30, history.length);
    const adjustedCount = Math.floor(maxSelectable / 3) * 3;

    const newSelectedIds = history.slice(0, adjustedCount).map((reward) => reward.id)
    setSelectedIds(newSelectedIds);
    
    alert(`已自動選取 ${adjustedCount} 個獎勵！`);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>抽獎歷史</DialogTitle>
        <DialogContent dividers>
          {history.length === 0 ? (
            <Typography>目前未有任何抽獎歷史</Typography>
          ) : (
            <List>
              {history.map((rewardItem) => (
                <div key={rewardItem.id}>
                  <ListItem
                    secondaryAction = {
                      <Checkbox
                        edge="end"
                        onChange={() => handleToggle(rewardItem.id)}
                        checked={selectedIds.includes(rewardItem.id)}
                        disabled={
                          // 已達 30 個上限且尚未選取的，就不能再勾
                          !selectedIds.includes(rewardItem.id) && !canSelectMore
                        }
                      />
                    }
                  >
                    <ListItemText primary={rewardItem.name}/>
                  </ListItem>
                </div>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleQuickSelect} color="info">
            快速選擇
          </Button>
          <Button onClick={handleRedeemForRedraw} color="secondary">
            再抽獎
          </Button>
          <Button onClick={handleRedeem} color="error">
            兌換
          </Button>
          <Button onClick={onClose} color="primary">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

