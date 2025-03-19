"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Grid2 from "@mui/material/Grid2"; 


import type { AppDispatch, RootState } from "@/store";
import { spendCoupons, addCoupons } from "@/store/userSlice";
import { addRewards } from "@/store/rewardHistorySlice";
import { incrementSeal } from "@/store/sealSlice";

import ConfirmDialog from "@/components/ConfirmDialog"; 
import ResultDialog from "@/components/ResultDialog";
import HistoryDialog from "@/components/HistoryDialog";
import FancyButton from "@/components/FancyButton";


const rewards = [
  { name:"印記", probability: 0.0026, image: "/images/seal.png" },
  { name:"傳說對決的嘲笑-1天", probability: 0.266, image: "/images/rewardsA.png" },
  { name:"傳說對決的嘲笑-3天", probability: 0.1463, image: "/images/rewardsA.png" },
  { name:"傳說對決的嘲笑-7天", probability: 0.0864, image: "/images/rewardsA.png" },
  { name:"葛瑞納的擊殺-1天", probability: 0.266, image: "/images/rewardsB.png" },
  { name:"葛瑞納的擊殺-3天", probability: 0.1463, image: "/images/rewardsB.png" },
  { name:"葛瑞納的擊殺-7天", probability: 0.0864, image: "/images/rewardsB.png" },
];

const sealRewards = [
  {level: 5, reward: "尊爵不凡酷造型", image: "/images/sealsRewards5.png"},
  {level: 4, reward: "尊爵不凡擊殺播報禮包", image: "/images/sealsRewards234.png"},
  {level: 3, reward: "只有尊爵不凡造型才會跳的舞蹈動作禮包", image: "/images/sealsRewards234.png"},
  {level: 2, reward: "很有個性的按鈕禮包", image: "/images/sealsRewards234.png"},
  {level: 1, reward: "魔法水晶x10", image: "/images/sealsRewards1.png"},
];

export default function Home() {
  // Redux dispatch，用來呼叫 reducer actions
  const dispatch = useDispatch<AppDispatch>();
  const { coupons } = useSelector((state: RootState) => state.user);
  const { sealsCollected } = useSelector((state: RootState) => state.seal);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openResult, setOpenResult] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  
  const [multiRewards, setMultiRewards] = useState<{ name: string; image: string }[]>([]);
  const [drawCount, setDrawCount] = useState(1);
  const [drawCost, setDrawCost] = useState(50);

  const [collectedSealReward, setCollectedSealReward] = useState<{ name: string; image: string } | null>(null); 
  const [claimedSeals, setClaimedSeals] = useState<number[]>([]);

  const skipConfirm = typeof window !== "undefined" && localStorage.getItem("skipConfirm") === "true";
  
  useEffect(() => {
    localStorage.removeItem("skipConfirm");
  }, []);


  const singleDrawCost = 50;
  const tenDrawCost = 450;

  // 打開確認視窗（根據是單抽還是十抽）
  const openDrawConfirm = (count: number) => {
    setDrawCount(count);
    setDrawCost(count === 1 ? singleDrawCost : tenDrawCost); // ✅ 設定 drawCost

    if (skipConfirm) {
      handleDraw(count);
    } else {
      setOpenConfirm(true);
    }
  };

  //抽獎
  const handleDraw = (count: number, isRedraw = false) => {
    if (!skipConfirm && !openConfirm) {
      setDrawCount(count);
      setOpenConfirm(true);
      return;
    }
  
    if (!isRedraw) {
      const drawCost = count === 1 ? singleDrawCost : tenDrawCost;
      if (coupons < drawCost) {
        alert("點券不足，請先儲值！");
        return;
      }
      dispatch(spendCoupons(drawCost));
    }
  
    const results: { name: string; image: string }[] = [];
  
    for (let i = 0; i < count; i++) {
      const random = Math.random();
      let cumulativeProbability = 0;
  
      for (const reward of rewards) {
        cumulativeProbability += reward.probability;
        if (random < cumulativeProbability) {
          results.push({ name: reward.name, image: reward.image });
  
          if (reward.name === "印記") {
            dispatch(incrementSeal());
          }
          break;
        }
      }
    }
  
    setMultiRewards(results);
    setOpenConfirm(false);
  
    const rewardItems = results.map((reward) => ({
      id: crypto.randomUUID(),
      name: reward.name,
      image: reward.image,
    }));
  
    dispatch(addRewards(rewardItems));
    setTimeout(() => setOpenResult(true), 487);
  };  

  const handleSealRewardClick = (level: number) => {
    if (claimedSeals.includes(level)) return;
    const reward = sealRewards.find((r) => r.level === level);
    if (reward) {
      setCollectedSealReward({ name: reward.reward, image: reward.image });
      setClaimedSeals((prev) => [...prev, level]);
    }
  };  

  const handleAddCoupons = () => {
    dispatch(addCoupons(4110));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundImage: "url('/images/backgroundImg.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        {/* 右上角顯示點券和增加按鈕 */}
        <Box
          sx={{
            position: "absolute",
            top: 28,
            right: 56,
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            padding: 0.2,
            borderRadius: "6px",
          }}
        >
          <Typography variant="h6" sx={{display: "flex", alignItems: "center" ,mx: 1 }}>
            擁有：
            <Box 
              component="img"
              src="/images/coupon.png"
              alt="點券："
              sx={{ width: 28, height: 28, mr: 1 }}
            />
            {coupons}
          </Typography>
          <IconButton
            color="primary"
            onClick={handleAddCoupons}
            sx={{padding: 0, color: "white", "&:hover": { color: "lightgray" }}}
          >
            <AddIcon sx={{ width: 24, height: 24,  }}/>
          </IconButton>
        </Box>

        {/* 印記獎勵進度 */}  
        <Box
          sx={{
            position: "absolute",
            left: 80,
            top: 50, 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            width: 200
          }}
        >
          <Typography>已收集印記：{sealsCollected} / 5</Typography>
          <Grid2 container direction="column" spacing={2} alignItems="center" sx={{ mt: 2 }}>
            {sealRewards.map(({ level, image }) => {
              const isClaimed = claimedSeals.includes(level); // ✅ 檢查是否已領取
              return (
                <Box
                  key={level}
                  sx={{
                    position: "relative", // ✅ 讓覆蓋層相對於這個 Box
                    width: 200,
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    textAlign: "center",
                    opacity: sealsCollected >= level ? 1 : 0.4, // 透明度
                    cursor: isClaimed ? "not-allowed" : sealsCollected >= level ? "pointer" : "not-allowed", // ✅ 領取後禁止點擊
                  }}
                  onClick={() => {
                    if (!isClaimed && sealsCollected >= level) {
                      handleSealRewardClick(level);
                    }
                  }}
                >
                  {/* 原始圖片 */}
                  <Box
                    component="img"
                    src={image}
                    alt={`第${level}個印記獎勵`}
                    sx={{
                      width: "5.5rem",  
                      height: "5.5rem",
                      display: "block",
                      mx: "auto",
                    }}
                  />
                  
                  {/* 覆蓋層，當獎勵被領取後才顯示 */}
                  {isClaimed && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 45,
                        width: "5.5rem",  
                        height: "5.5rem",
                        backgroundColor: "rgba(0, 0, 0, 0.6)", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      已領取
                    </Box>
                  )}
                  <Typography variant="caption">收集 {level} 個印記</Typography>
                </Box>
              );
            })}
          </Grid2>
        </Box>

        {/* 抽獎按鈕 */}
        <Stack direction="row" sx={{ position: "absolute", bottom: 80, left: 340 }}>
          <FancyButton
            onClick={() => openDrawConfirm(1)} // ✅ 使用 openDrawConfirm
            disabled={coupons < 50}
            sx={{ mx: 4 }}
          >
            抽1次 50點券
          </FancyButton>
          <FancyButton
            onClick={() => openDrawConfirm(10)} // ✅ 使用 openDrawConfirm
            disabled={coupons < 450}
            sx={{ mx: 4 }}
          >
            抽10次 450點券
          </FancyButton>
          <FancyButton
            onClick={() => setOpenHistory(true)}
            sx={{
              color: "#fff",
              background: "linear-gradient(to bottom, rgba(0, 31, 65, 1), rgba(0, 31, 65, 0.6))", //透明背景
              ml: 8,
            }}            
          >
            抽獎歷史
          </FancyButton>
        </Stack>

        <ConfirmDialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={() => handleDraw(drawCount)}
          description={`確認花費 ${drawCost} 點券抽 ${drawCount} 次嗎？`}
        />

        <ResultDialog 
          open={openResult}
          onClose={() => setOpenResult(false)}
          rewards={multiRewards}
        />

        <HistoryDialog
          open={openHistory}
          onClose={() => setOpenHistory(false)}
          onRedraw={handleDraw}
        />

        {/* 獲得印記獎勵彈窗 */}
        {collectedSealReward && (
          <ResultDialog 
            open={!!collectedSealReward}
            onClose={() => setCollectedSealReward(null)}
            rewards={[collectedSealReward]}
          />
        )}
      </Box>
    </>
  );
}
