import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { usePrizes, useSpinPrize } from "../../hooks/queries/prizequery";
import { toast } from "sonner";
import { useTheme } from "../../store/useThemeStore";
import { useTranslation } from "react-i18next";

const lightColors = ["#a81324", "#f79009", "#1a1a1a", "#0ea5e9", "#12b76a"];
const darkColors = ["#bf1629", "#f79009", "#ffffff", "#0ea5e9", "#12b76a"];

const getTextColor = (bgColor: string) => {
  if (bgColor === "#ffffff" || bgColor === "#f79009") {
    return "#1a1a1a";
  }
  return "#ffffff";
};

const PrizeWheel = () => {
  const { t } = useTranslation("traderPrizes");
  const theme = useTheme();
  const colors = theme === "dark" ? darkColors : lightColors;
  const innerBorderColor = theme === "dark" ? "#1c1f24" : "#ffffff";

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const { data: prizes = [], isLoading } = usePrizes();
  const spinMutation = useSpinPrize();

  const wheelData = prizes.map((prize, index) => {
    const bgColor = colors[index % colors.length];
    return {
      option: prize.name,
      style: {
        backgroundColor: bgColor,
        textColor: getTextColor(bgColor),
      },
    };
  });

  const handleSpin = async () => {
    if (mustSpin) return;
    try {
      const winner = await spinMutation.mutateAsync();
      const winnerIndex = prizes.findIndex((prize) => prize.id === winner.id);
      if (winnerIndex === -1) return;
      setPrizeNumber(winnerIndex);
      setMustSpin(true);
    } catch (error) {
      console.error(error);
      toast.error(t("spinError"));
    }
  };
  if (isLoading) return <p className="p-6 text-gray-text">{t("loading")}</p>;
  if (prizes.length === 0 || prizes.length === 1) {
    return <p className="p-6 text-gray-text">{t("noPrizes")}</p>;
  }
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded-full p-1 shadow-lg" dir="ltr" style={{ direction: "ltr" }}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          outerBorderWidth={0}
          innerBorderColor={innerBorderColor}
          innerBorderWidth={8}
          innerRadius={12}
          radiusLineWidth={0}
          fontSize={20}
          fontWeight={700}
          textDistance={62}
          perpendicularText={false}
          onStopSpinning={() => {
            setMustSpin(false);
            toast.success(t("winnerMsg", { name: prizes[prizeNumber].name }));
          }}
        />
      </div>

      <button
        className="bg-primary text-white px-8 py-3 rounded-2xl cursor-pointer font-bold disabled:opacity-60 hover:opacity-90 transition-opacity shadow-md"
        onClick={handleSpin}
        disabled={mustSpin || spinMutation.isPending}
      >
        {spinMutation.isPending ? t("spinning") : t("spin")}
      </button>
    </div>
  );
};

export default PrizeWheel;
