"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Grid2 from "@mui/material/Grid2";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/store";
import { addCoupons, spendCoupons } from "@/store/userSlice";
import { removeRewards, addRewards } from "@/store/rewardHistorySlice";
import { incrementSeal } from "@/store/sealSlice";

import ConfirmDialog from "@/components/ConfirmDialog";
import ResultDialog from "@/components/ResultDialog";
import HistoryDialog from "@/components/HistoryDialog";
import FancyButton from "@/components/FancyButton";

// 獎勵
const rewards = [
  { name:"印記", probability: 0.0026, image: "/images/seal.png" },
  { name:"傳說對決的嘲笑-1天", probability: 0.266, image: "/images/rewardsA.png" },
  { name:"傳說對決的嘲笑-3天", probability: 0.1463, image: "/images/rewardsA.png" },
  { name:"傳說對決的嘲笑-7天", probability: 0.0864, image: "/images/rewardsA.png" },
  { name:"葛瑞納的擊殺-1天", probability: 0.266, image: "/images/rewardsB.png" },
  { name:"葛瑞納的擊殺-3天", probability: 0.1463, image: "/images/rewardsB.png" },
  { name:"葛瑞納的擊殺-7天", probability: 0.0864, image: "/images/rewardsB.png" },
];

// 印記獎勵
const sealRewards = [
  { level: 5, reward: "尊爵不凡酷造型", image: "/images/sealsRewards5.png" },
  { level: 4, reward: "尊爵不凡擊殺播報禮包", image: "/images/sealsRewards234.png" },
  { level: 3, reward: "只有尊爵不凡造型才會跳的舞蹈動作禮包", image: "/images/sealsRewards234.png" },
  { level: 2, reward: "很有個性的按鈕禮包", image: "/images/sealsRewards234.png" },
  { level: 1, reward: "魔法水晶x10", image: "/images/sealsRewards1.png" },
];

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { coupons } = useSelector((state: RootState) => state.user);
  const { sealsCollected } = useSelector((state: RootState) => state.seal);

  // === UI 狀態 ===
  const [openHistory, setOpenHistory] = useState(false);
  const [openResult, setOpenResult]   = useState(false);

  const [multiRewards, setMultiRewards] = useState<{ name: string; image: string }[]>([]);

  // 印記獎勵彈窗
  const [collectedSealReward, setCollectedSealReward] = useState<{ name: string; image: string } | null>(null);
  const [claimedSeals, setClaimedSeals] = useState<number[]>([]);

  // 付費抽獎
  const singleDrawCost = 50;
  const tenDrawCost    = 450;
  const [openPaidConfirm, setOpenPaidConfirm] = useState(false);
  const [drawCount, setDrawCount] = useState(1);
  const [drawCost,  setDrawCost]  = useState(50);
  const skipDrawConfirm = typeof window !== "undefined" && localStorage.getItem("skipDrawConfirm") === "true";

  // 免費重抽
  const [openRedrawConfirm, setOpenRedrawConfirm] = useState(false);
  const skipRedrawConfirm = typeof window !== "undefined" && localStorage.getItem("skipRedrawConfirm") === "true";
  
  /**
   * 關鍵：在「父層」儲存 selectedIds
   * Child (HistoryDialog) 只透過 props 顯示「勾選狀態」，並呼叫 toggleSelectId(id)
   */
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 重抽幾次
  const [redrawCount, setRedrawCount] = useState(0);

  useEffect(() => {
    // 如果你想每次都清除「不再提醒」：
    localStorage.removeItem("skipDrawConfirm");
    localStorage.removeItem("skipRedrawConfirm");
  }, []);

  // =====================================================================
  // ================ 付費抽獎流程：單抽 / 十抽 ============================
  // =====================================================================
  const openDrawConfirm = (count: number) => {
    setDrawCount(count);
    setDrawCost(count === 1 ? singleDrawCost : tenDrawCost);

    if (skipDrawConfirm) {
      doPaidDraw(count);
    } else {
      setOpenPaidConfirm(true);
    }
  };

  const doPaidDraw = (count: number) => {
    setOpenPaidConfirm(false);

    // 檢查點券
    const cost = count === 1 ? singleDrawCost : tenDrawCost;
    if (coupons < cost) {
      alert("點券不足，請先儲值！");
      return;
    }
    // 扣款
    dispatch(spendCoupons(cost));

    // 執行抽獎
    const results = doRandomDraw(count); // isPaid=true
    setMultiRewards(results);

    // 存到歷史
    addRewardsToHistory(results);

    // 顯示結果彈窗
    setOpenResult(true);
  };

  // =====================================================================
  // ================ 免費重抽流程：從子層得到 selectedIds ===============
  // =====================================================================
  // HistoryDialog 的「兌換抽獎」會呼叫此函式
  const handleRedeem = (ids: string[]) => {
    const count = ids.length / 3;
    // 父層更新 state
    setSelectedIds(ids);
    setRedrawCount(count);

    if (skipRedrawConfirm) {
      doRedraw(ids, count);
    } else {
      setOpenRedrawConfirm(true);
    }
  };

  // 真正重抽
  const doRedraw = (ids: string[], count: number) => {
    setOpenRedrawConfirm(false);

    // 移除獎勵
    dispatch(removeRewards(ids));

    // 抽獎 (不扣點)
    const results = doRandomDraw(count); // isPaid=false
    setMultiRewards(results);

    addRewardsToHistory(results);
    setOpenResult(true);

    // 清空 selectedIds，避免重複再抽
    setSelectedIds([]);
  };

  // =====================================================================
  // ======================== 抽獎通用邏輯 ================================
  // =====================================================================
  /**
   * isPaid = true → 付費抽獎；false → 免費重抽
   * 如果你日後想做「付費抽獎機率提高」等差異化，就能根據 isPaid 去改邏輯
   */
  const doRandomDraw = (count: number) => {
    const results: { name: string; image: string }[] = [];
    for (let i = 0; i < count; i++) {
      const random = Math.random();
      let cumulativeProbability = 0;
      for (const item of rewards) {
        cumulativeProbability += item.probability;
        if (random < cumulativeProbability) {
          results.push({ name: item.name, image: item.image });
          if (item.name === "印記") {
            dispatch(incrementSeal());
          }
          break;
        }
      }
    }
    return results;
  };

  const addRewardsToHistory = (items: { name: string; image: string }[]) => {
    const mapped = items.map((x) => ({
      id: crypto.randomUUID(),
      name: x.name,
      image: x.image,
    }));
    dispatch(addRewards(mapped));
  };

  // =====================================================================
  // ================== 父層管理「勾選的獎勵」============================
  // =====================================================================

  /**
   * 跟子層互動：切換某個獎勵 id 的選取狀態
   */
  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // =====================================================================
  // ===================== 印記獎勵領取邏輯 ==============================
  // =====================================================================
  const handleSealRewardClick = (level: number) => {
    if (claimedSeals.includes(level)) return;
    const reward = sealRewards.find((r) => r.level === level);
    if (reward) {
      setCollectedSealReward({ name: reward.reward, image: reward.image });
      setClaimedSeals((prev) => [...prev, level]);
    }
  };

  // ===================== 儲值 ==============================
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
          color: "white",
        }}
      >
        {/* 右上：餘額 & 新增按鈕 */}
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
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", mx: 1 }}>
            擁有：
            <Box
              component="img"
              src="/images/coupon.png"
              alt="點券"
              sx={{ width: 28, height: 28, mr: 1 }}
            />
            {coupons}
          </Typography>
          <IconButton
            color="primary"
            onClick={handleAddCoupons}
            sx={{ padding: 0, color: "white", "&:hover": { color: "lightgray" } }}
          >
            <AddIcon sx={{ width: 24, height: 24 }} />
          </IconButton>
        </Box>

        {/* 印記獎勵 */}
        <Box
          sx={{
            position: "absolute",
            left: 80,
            top: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            width: 200,
          }}
        >
          <Typography>已收集印記：{sealsCollected} / 5</Typography>
          <Grid2 container direction="column" spacing={2} alignItems="center" sx={{ mt: 2 }}>
            {sealRewards.map(({ level, image }) => {
              const isClaimed = claimedSeals.includes(level);
              return (
                <Box
                  key={level}
                  sx={{
                    position: "relative",
                    width: 200,
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    textAlign: "center",
                    opacity: sealsCollected >= level ? 1 : 0.4,
                    cursor: isClaimed ? "not-allowed" : sealsCollected >= level ? "pointer" : "not-allowed",
                  }}
                  onClick={() => {
                    if (!isClaimed && sealsCollected >= level) {
                      handleSealRewardClick(level);
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={`第${level}個印記獎勵`}
                    sx={{ width: "5.5rem", height: "5.5rem", mx: "auto" }}
                  />
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

        {/* 付費抽獎按鈕 */}
        <Stack direction="row" sx={{ position: "absolute", bottom: 80, left: 340 }}>
          <FancyButton
            onClick={() => openDrawConfirm(1)}
            disabled={coupons < 50}
            sx={{ mx: 4 }}
          >
            抽1次 50點券
          </FancyButton>
          <FancyButton
            onClick={() => openDrawConfirm(10)}
            disabled={coupons < 450}
            sx={{ mx: 4 }}
          >
            抽10次 450點券
          </FancyButton>
          <FancyButton
            onClick={() => setOpenHistory(true)}
            sx={{
              color: "#fff",
              background: "linear-gradient(to bottom, rgba(0, 31, 65, 1), rgba(0, 31, 65, 0.6))",
              ml: 8,
            }}
          >
            抽獎歷史
          </FancyButton>
        </Stack>

        {/* 抽獎結果視窗 */}
        <ResultDialog
          open={openResult}
          onClose={() => setOpenResult(false)}
          rewards={multiRewards}
        />

        {/* 領取印記獎勵彈窗 */}
        {collectedSealReward && (
          <ResultDialog
            open={!!collectedSealReward}
            onClose={() => setCollectedSealReward(null)}
            rewards={[collectedSealReward]}
          />
        )}

        {/* 歷史視窗：只顯示資料＆呼叫父層 callback */}
        <HistoryDialog
          open={openHistory}
          onClose={() => setOpenHistory(false)}
          selectedIds={selectedIds}            // 父層把目前選到的獎勵 id 傳進去
          toggleSelectId={toggleSelectId}      // 父層的 callback => 更改 selectedIds
          onRedeem={handleRedeem}              // 最後按「兌換」呼叫此函式
        />
      </Box>

      {/* 付費抽獎 ConfirmDialog */}
      {openPaidConfirm && (
        <ConfirmDialog
          open={openPaidConfirm}
          onClose={() => setOpenPaidConfirm(false)}
          onConfirm={() => doPaidDraw(drawCount)}
          storageKey="skipDrawConfirm"
          description={`確認花費 ${drawCost} 點券抽 ${drawCount} 次嗎？`}
        />
      )}

      {/* 免費重抽 ConfirmDialog */}
      {openRedrawConfirm && (
        <ConfirmDialog
          open={openRedrawConfirm}
          onClose={() => setOpenRedrawConfirm(false)}
          onConfirm={() => doRedraw(selectedIds, redrawCount)}
          storageKey="skipRedrawConfirm"
          description={`是否使用 ${selectedIds.length} 個獎勵兌換 ${redrawCount} 次重抽機會？`}
        />
      )}
    </>
  );
}
