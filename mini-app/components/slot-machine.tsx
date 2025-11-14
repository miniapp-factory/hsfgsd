import { useState, useEffect } from "react";
import { url } from "@/lib/metadata";
import { Share } from "@/components/share";
import { Button } from "@/components/ui/button";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"];
const fruitImages: Record<string, string> = {
  Apple: "/apple.png",
  Banana: "/banana.png",
  Cherry: "/cherry.png",
  Lemon: "/lemon.png",
};

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [spinning, setSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  const randomFruit = () => fruits[Math.floor(Math.random() * fruits.length)];

  const generateGrid = () => {
    const newGrid: string[][] = [];
    for (let i = 0; i < 3; i++) {
      const row: string[] = [];
      for (let j = 0; j < 3; j++) {
        row.push(randomFruit());
      }
      newGrid.push(row);
    }
    return newGrid;
  };

  useEffect(() => {
    setGrid(generateGrid());
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinMessage(null);
    const spinDuration = 2000;
    const interval = 100;
    let elapsed = 0;
    const spinInterval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => row.map(() => randomFruit()));
        return newGrid;
      });
      elapsed += interval;
      if (elapsed >= spinDuration) {
        clearInterval(spinInterval);
        setSpinning(false);
        checkWin();
      }
    }, interval);
  };

  const checkWin = () => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) {
        setWinMessage(`You won with ${grid[i][0]}s!`);
        return;
      }
    }
    // Check columns
    for (let j = 0; j < 3; j++) {
      if (grid[0][j] === grid[1][j] && grid[1][j] === grid[2][j]) {
        setWinMessage(`You won with ${grid[0][j]}s!`);
        return;
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={fruitImages[fruit]}
            alt={fruit}
            className="w-16 h-16 object-contain"
          />
        ))}
      </div>
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {winMessage && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-semibold">{winMessage}</span>
          <Share text={`I just won on the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
