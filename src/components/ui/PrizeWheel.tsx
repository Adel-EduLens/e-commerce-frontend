import { useState, useMemo } from "react";
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

const createTextImage = (
  text: string,
  color: string,
  maxWidth = 130,
  fontSize = 16
): string => {
  const dpr = 3; // high DPI for crisp text
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const font = `bold ${fontSize * dpr}px "Segoe UI", Arial, sans-serif`;
  ctx.font = font;

  const scaledMaxWidth = maxWidth * dpr;

  // Split text into lines that fit maxWidth
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? currentLine + " " + word : word;
    if (ctx.measureText(testLine).width > scaledMaxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Cap at 2 lines max, truncate if needed
  if (lines.length > 2) {
    lines.length = 2;
    const last = lines[1];
    if (ctx.measureText(last).width > scaledMaxWidth) {
      let truncated = last;
      while (ctx.measureText(truncated + "…").width > scaledMaxWidth && truncated.length > 0) {
        truncated = truncated.slice(0, -1);
      }
      lines[1] = truncated + "…";
    }
  }

  const lineHeight = fontSize * dpr * 1.3;
  const totalHeight = lines.length * lineHeight;
  const maxLineWidth = Math.max(
    ...lines.map((l) => ctx.measureText(l).width),
    20 * dpr
  );

  canvas.width = maxLineWidth + 8 * dpr;
  canvas.height = totalHeight + 4 * dpr;

  // Re-set font after canvas resize (resets context)
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  lines.forEach((line, i) => {
    ctx.fillText(line, canvas.width / 2, i * lineHeight + 2 * dpr);
  });

  return canvas.toDataURL();
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

  const wheelData = useMemo(
    () =>
      prizes.map((prize, index) => {
        const bgColor = colors[index % colors.length];
        const textColor = getTextColor(bgColor);
        const imageUri = createTextImage(prize.name, textColor);
        return {
          option: "",
          image: {
            uri: imageUri,
            sizeMultiplier: 0.55,
            offsetY: 0,
            landscape: true,
          },
          style: {
            backgroundColor: bgColor,
            textColor: getTextColor(bgColor),
          },
        };
      }),
    [prizes, colors]
  );

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
      <div
        className="rounded-full p-1 shadow-lg"
        dir="ltr"
        style={{ direction: "ltr" }}
      >
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          outerBorderWidth={0}
          innerBorderColor={innerBorderColor}
          innerBorderWidth={8}
          innerRadius={12}
          radiusLineWidth={0}
          fontSize={14}
          fontWeight={700}
          textDistance={55}
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
