import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { usePrizes, useSpinPrize } from "../../hooks/queries/prizequery";
import { toast } from "sonner";

const colors = ["#e0343f", "#f2994a", "#2f80ed"];
const PrizeWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const { data: prizes = [], isLoading } = usePrizes();
  const spinMutation = useSpinPrize();

  const wheelData = prizes.map((prize, index) => ({
    option: prize.name,
    style: {
      backgroundColor: colors[index % colors.length],
      textColor: "#ededed",
    },
  }));

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
      toast.error("Failed to spin the wheel. Please try again.");
    }
  };
  if (isLoading) return <p>Loading...</p>;
  if (prizes.length === 0 || prizes.length === 1) {
    return <p>No prizes available.</p>;
  }
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="rounded-full p-1 bg-primary">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          outerBorderWidth={0}
          innerBorderColor="#150a2e"
          innerBorderWidth={8}
          innerRadius={12}
          radiusLineWidth={0}
          fontSize={20}
          fontWeight={700}
          textDistance={62}
          perpendicularText={false}
          onStopSpinning={() => {
            setMustSpin(false);
            toast.success(`Winner: ${prizes[prizeNumber].name}`);
          }}
        />
      </div>

      <button
        className="bg-primary text-foreground px-8 py-3 rounded-2xl cursor-pointer font-bold disabled:opacity-60"
        onClick={handleSpin}
        disabled={mustSpin || spinMutation.isPending}
      >
        {spinMutation.isPending ? "Spinning..." : "Spin"}
      </button>
    </div>
  );
};

export default PrizeWheel;

// Each prize has a "weight".
// Higher weight = higher chance of being selected.
// const prizes = [
//   {
//     option: "100 pounds",
//     style: { backgroundColor: "#e0343f", textColor: "#ededed" },
//     weight: 5, // 5% chance
//   },
//   {
//     option: "prize",
//     style: { backgroundColor: "#f2994a", textColor: "#ededed" },
//     weight: 25, // 25% chance
//   },
//   {
//     option: "500 point",
//     style: { backgroundColor: "#2f80ed", textColor: "#ededed" },
//     weight: 70, // 70% chance
//   },
// ];

/**
 * Returns the index of the winning prize
 * based on the weight of each prize.
 */
// function weightedRandom() {
//   const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
//   let random = Math.random() * totalWeight;

//   for (let i = 0; i < prizes.length; i++) {
//     if (random < prizes[i].weight) {
//       return i;
//     }
//     random -= prizes[i].weight;
//   }
//   return 0;
// }

// const handleSpin = () => {
//   if (mustSpin) return;

//   const winner = weightedRandom();


//   setPrizeNumber(winner);
//   setMustSpin(true);
// };
