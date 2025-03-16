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
  { name:"印記", probability: 0.0026 },
  { name:"傳說對決的嘲笑-1天", probability: 0.266 },
  { name:"傳說對決的嘲笑-3天", probability: 0.1463 },
  { name:"傳說對決的嘲笑-7天", probability: 0.0864 },
  { name:"葛瑞納的擊殺-1天", probability: 0.266 },
  { name:"葛瑞納的擊殺-3天", probability: 0.1463 },
  { name:"葛瑞納的擊殺-7天", probability: 0.0864 },
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
  
  const [multiRewards, setMultiRewards] = useState<string[]>([]);
  const [drawCount, setDrawCount] = useState(1);
  const [selectedSealReward, setSelectedSealReward] = useState<string | null>(null); // 用於顯示印記獎勵彈窗

  const skipConfirm = typeof window !== "undefined" && localStorage.getItem("skipConfirm") === "true";
  
  useEffect(() => {
    localStorage.removeItem("skipConfirm");
  }, []);


  const singleDrawCost = 50;
  const tenDrawCost = 450;

  //抽獎
  const handleDraw = (count:number) => {
    if(!skipConfirm && !openConfirm) {
      setDrawCount(count);
      setOpenConfirm(true);
      return;
    };

    const cost = count === 1 ? singleDrawCost : tenDrawCost;

    if(coupons < cost) {
      alert("點券不足，請先儲值！");
      return;
    }
    
    dispatch(spendCoupons(cost));

    const results:string[] = [];

    for(let i = 0; i < count; i++) {
      const random = Math.random();
      let cumulativeProbability = 0;
      // 判斷random落在哪個獎項的機率區間，來判定抽到哪個獎項
      // 若random = 0.15，0.15 > 0.0026(所以不是抽到這個獎項，就繼續遍歷)，0.15 < 0.2686 (0.0026 + 0.266) ，因此是抽到這個獎項
      for(const reward of rewards) {
        cumulativeProbability += reward.probability;
        if(random < cumulativeProbability) {
          results.push(reward.name);

          if(reward.name === "印記") {
            dispatch(incrementSeal());
          }
          break;
        }
      }
    }
    setMultiRewards(results); // 更新當前抽獎結果
    setOpenConfirm(false);

    // 抽到的獎項存入Redux
    const rewardItems  = results.map((rewardName) => ({
      id: crypto.randomUUID(),
      name: rewardName,
    }));

    // 存入歷史紀錄
    dispatch(addRewards(rewardItems));
    setTimeout(() => setOpenResult(true), 487);
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
          <Grid2 container direction="column" spacing={2} alignItems="center"  sx={{ mt: 2, }}>
            {sealRewards.map(({level, image}) => (
              <Box
                key={level}
                sx={{
                  width: 200,
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  textAlign: "center",
                  opacity: sealsCollected >= level ? 1 : 0.4,
                  cursor: sealsCollected >= level ? "pointer" : "not-allowed",
                }}
              >
                <Box
                  component="img"
                  src={image}
                  alt={`第${level}個印記獎勵`}
                  sx={{ width: "50%", mb: 1 , mx: "auto"}}
                />
                  <Typography variant="caption">搜集{level}個印記</Typography>
              </Box>
            ))}
          </Grid2>
        </Box>

        {/* 抽獎按鈕 */}
        <Stack direction="row" sx={{ position: "absolute", bottom: 80, left: 340 }}>
          <FancyButton
            onClick={() => handleDraw(1)}
            disabled={coupons < singleDrawCost}
            sx={{ mx: 4}}
          >
            抽1次 {singleDrawCost} 點券
          </FancyButton>
          <FancyButton
            onClick={() => handleDraw(10)}
            disabled={coupons < tenDrawCost}
            sx={{ mx: 4}}
          >
            抽10次 {tenDrawCost} 點券
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
        {selectedSealReward && (
          <ResultDialog 
            open={!!selectedSealReward}
            onClose={() => setSelectedSealReward(null)}
            rewards={[selectedSealReward]}
          />
        )}
      </Box>
    </>
  );
}
