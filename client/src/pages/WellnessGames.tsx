import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type GameType = "memory" | "breathe" | "color" | "sudoku";

const WellnessGames = () => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-semibold text-white mb-2">
          Wellness Games
        </h1>
        <p className="text-gray-400">
          Play cognitive games to relieve stress and improve mental clarity
        </p>
      </div>
      
      {activeGame ? (
        <div className="bg-surface rounded-xl p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">
              {activeGame === "memory" && "Memory Match"}
              {activeGame === "breathe" && "Breathing Pattern"}
              {activeGame === "color" && "Color Relaxation"}
              {activeGame === "sudoku" && "Mindful Sudoku"}
            </h2>
            <button 
              className="px-3 py-1 text-sm text-gray-400 border border-gray-600 rounded-lg hover:bg-surface-light"
              onClick={() => setActiveGame(null)}
            >
              Close Game
            </button>
          </div>
          
          {activeGame === "memory" && <MemoryGame />}
          {activeGame === "breathe" && <BreathingGame />}
          {activeGame === "color" && <ColorGame />}
          {activeGame === "sudoku" && <SudokuGame />}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GameCard 
            title="Memory Match"
            description="Test and improve your memory with this simple card matching game."
            icon="ri-brain-line"
            color="from-primary to-primary-light"
            onClick={() => setActiveGame("memory")}
          />
          
          <GameCard 
            title="Breathing Pattern"
            description="Follow the pattern to practice mindful breathing for relaxation."
            icon="ri-lungs-line"
            color="from-secondary to-secondary-light"
            onClick={() => setActiveGame("breathe")}
          />
          
          <GameCard 
            title="Color Relaxation"
            description="Play with colors in a digital coloring experience to calm your mind."
            icon="ri-palette-line"
            color="from-accent-blue to-secondary"
            onClick={() => setActiveGame("color")}
          />
          
          <GameCard 
            title="Mindful Sudoku"
            description="Focus your mind with a gentle Sudoku puzzle to ease anxiety."
            icon="ri-layout-grid-line"
            color="from-primary-dark to-secondary-dark"
            onClick={() => setActiveGame("sudoku")}
          />
        </div>
      )}
    </div>
  );
};

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
}

const GameCard = ({ title, description, icon, color, onClick }: GameCardProps) => {
  return (
    <div className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition">
      <div className={`bg-gradient-to-r ${color} p-4`}>
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">{title}</h3>
          <i className={`${icon} text-white text-xl`}></i>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-300 mb-4">{description}</p>
        <button 
          className="w-full py-2 bg-surface-light text-white rounded-lg hover:bg-surface-lighter transition"
          onClick={onClick}
        >
          Play Now
        </button>
      </div>
    </div>
  );
};

// Memory Match Game
const MemoryGame = () => {
  const { toast } = useToast();
  const [cards, setCards] = useState<{id: number; emoji: string; flipped: boolean; matched: boolean}[]>(() => {
    const emojis = ["🌱", "🌿", "🌺", "🌻", "🌸", "🍀"];
    const deck = [...emojis, ...emojis].map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false
    }));
    
    // Shuffle
    return deck.sort(() => Math.random() - 0.5);
  });
  
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  
  const handleCardClick = (index: number) => {
    // Ignore if already flipped or if two cards are already flipped
    if (cards[index].flipped || flippedIndices.length >= 2) return;
    
    // Flip the card
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    
    // Add to flipped indices
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);
    
    // If two cards are flipped, check for match
    if (newFlippedIndices.length === 2) {
      setMoves(moves + 1);
      
      const [first, second] = newFlippedIndices;
      
      // Check if emojis match
      if (newCards[first].emoji === newCards[second].emoji) {
        // Match found
        newCards[first].matched = true;
        newCards[second].matched = true;
        setMatches(matches + 1);
        setFlippedIndices([]);
        
        // Check if game is complete
        if (matches + 1 === cards.length / 2) {
          toast({
            title: "Congratulations!",
            description: `You've completed the game in ${moves + 1} moves!`,
          });
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };
  
  const resetGame = () => {
    const emojis = ["🌱", "🌿", "🌺", "🌻", "🌸", "🍀"];
    const deck = [...emojis, ...emojis].map((emoji, index) => ({
      id: index,
      emoji,
      flipped: false,
      matched: false
    }));
    
    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">Moves: {moves}</div>
        <div className="text-sm text-gray-400">Matches: {matches}/{cards.length/2}</div>
        <button 
          className="px-3 py-1 text-sm bg-primary rounded-lg text-white"
          onClick={resetGame}
        >
          Reset
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mb-4">
        {cards.map((card, index) => (
          <div 
            key={card.id} 
            className={`aspect-square rounded-lg flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 ${
              card.flipped 
                ? "bg-primary-light transform-gpu rotate-y-180" 
                : "bg-surface-light hover:bg-surface-lighter"
            }`}
            onClick={() => handleCardClick(index)}
          >
            {card.flipped && card.emoji}
          </div>
        ))}
      </div>
      
      <p className="text-sm text-gray-300 text-center">
        Flip cards to find matching pairs. Exercise your memory while relaxing your mind.
      </p>
    </div>
  );
};

// Breathing Pattern Game
const BreathingGame = () => {
  const [isActive, setIsActive] = useState(false);
  const [breathingStep, setBreathingStep] = useState("inhale"); // inhale, hold, exhale
  const [cycle, setCycle] = useState(0);
  const [secondsInStep, setSecondsInStep] = useState(0);
  
  const startBreathing = () => {
    if (isActive) return;
    
    setIsActive(true);
    setBreathingStep("inhale");
    setCycle(0);
    setSecondsInStep(0);
    
    // Start breathing cycle
    const intervalId = setInterval(() => {
      setSecondsInStep(prev => {
        const newSeconds = prev + 1;
        
        if (breathingStep === "inhale" && newSeconds >= 4) {
          setBreathingStep("hold");
          return 0;
        } else if (breathingStep === "hold" && newSeconds >= 4) {
          setBreathingStep("exhale");
          return 0;
        } else if (breathingStep === "exhale" && newSeconds >= 6) {
          setBreathingStep("inhale");
          setCycle(prevCycle => {
            const newCycle = prevCycle + 1;
            if (newCycle >= 5) {
              clearInterval(intervalId);
              setIsActive(false);
            }
            return newCycle;
          });
          return 0;
        }
        
        return newSeconds;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-60 w-60 flex items-center justify-center mb-6">
        <div className={`absolute w-32 h-32 rounded-full bg-primary opacity-20 transition-transform duration-4000 ${
          breathingStep === "inhale" ? "scale-150" : 
          breathingStep === "hold" ? "scale-150" : 
          "scale-100"
        }`}></div>
        <div className={`absolute w-24 h-24 rounded-full bg-primary opacity-30 transition-transform duration-4000 ${
          breathingStep === "inhale" ? "scale-150" : 
          breathingStep === "hold" ? "scale-150" : 
          "scale-100"
        }`}></div>
        <div className={`absolute w-16 h-16 rounded-full bg-primary opacity-40 transition-transform duration-4000 ${
          breathingStep === "inhale" ? "scale-150" : 
          breathingStep === "hold" ? "scale-150" : 
          "scale-100"
        }`}></div>
        
        <div className="z-10 text-lg font-medium text-white">
          {!isActive ? "Press Start" : (
            breathingStep === "inhale" ? "Breathe In" : 
            breathingStep === "hold" ? "Hold" : 
            "Breathe Out"
          )}
        </div>
      </div>
      
      {isActive && (
        <div className="mb-6 text-center">
          <p className="text-gray-300 mb-2">
            Cycle {cycle + 1} of 5
          </p>
          <div className="w-48 h-2 bg-surface-lighter rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(cycle / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <button
        className={`px-6 py-3 rounded-lg text-white ${
          isActive ? "bg-gray-600" : "bg-primary hover:bg-primary-dark"
        } transition`}
        onClick={startBreathing}
        disabled={isActive}
      >
        {isActive ? "In Progress..." : "Start Breathing Exercise"}
      </button>
      
      <p className="text-sm text-gray-300 text-center mt-4 max-w-md">
        Follow the breathing pattern: inhale for 4 seconds, hold for 4 seconds, 
        exhale for 6 seconds. Complete 5 cycles for optimal relaxation.
      </p>
    </div>
  );
};

// Color Relaxation Game
const ColorGame = () => {
  const colors = [
    { name: "Ocean Blue", value: "#1E88E5" },
    { name: "Forest Green", value: "#43A047" },
    { name: "Lavender", value: "#9575CD" },
    { name: "Sunset Orange", value: "#FB8C00" },
    { name: "Rose Pink", value: "#EC407A" },
    { name: "Teal", value: "#00897B" },
    { name: "Sage", value: "#7CB342" },
    { name: "Sky", value: "#29B6F6" }
  ];
  
  const [selectedColor, setSelectedColor] = useState(colors[0].value);
  const [filledCells, setFilledCells] = useState<{[key: string]: string}>({});
  
  const handleCellClick = (cellId: string) => {
    setFilledCells({
      ...filledCells,
      [cellId]: selectedColor
    });
  };
  
  const resetCanvas = () => {
    setFilledCells({});
  };
  
  // Generate a simple mandala pattern
  const cells = [];
  const gridSize = 8;
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cellId = `${i}-${j}`;
      cells.push(
        <div 
          key={cellId}
          className={`aspect-square border border-surface-lighter cursor-pointer hover:opacity-80 transition`}
          style={{ backgroundColor: filledCells[cellId] || "#2D2D2D" }}
          onClick={() => handleCellClick(cellId)}
        ></div>
      );
    }
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">Select a color:</div>
        <button 
          className="px-3 py-1 text-sm bg-primary rounded-lg text-white"
          onClick={resetCanvas}
        >
          Reset Canvas
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {colors.map(color => (
          <button
            key={color.name}
            className={`w-8 h-8 rounded-full border-2 ${
              selectedColor === color.value ? "border-white" : "border-transparent"
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => setSelectedColor(color.value)}
            title={color.name}
          ></button>
        ))}
      </div>
      
      <div className="grid grid-cols-8 max-w-md mx-auto mb-4">
        {cells}
      </div>
      
      <p className="text-sm text-gray-300 text-center">
        Click on the grid to color cells. Creative expression helps reduce stress and anxiety.
      </p>
    </div>
  );
};

// Sudoku Game
const SudokuGame = () => {
  // Simplified 4x4 Sudoku for ease of implementation
  const [board, setBoard] = useState<(number | null)[][]>([
    [1, null, 3, null],
    [null, 4, null, 2],
    [null, 2, null, 1],
    [3, null, 4, null]
  ]);
  
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isValid, setIsValid] = useState(true);
  
  const handleCellClick = (row: number, col: number) => {
    // Only allow selecting empty cells
    if (board[row][col] === null) {
      setSelectedCell([row, col]);
    }
  };
  
  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    
    const [row, col] = selectedCell;
    const newBoard = [...board.map(r => [...r])];
    newBoard[row][col] = num;
    
    setBoard(newBoard);
    
    // Check if the board is valid
    setIsValid(isBoardValid(newBoard, row, col, num));
  };
  
  const isBoardValid = (board: (number | null)[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let i = 0; i < 4; i++) {
      if (i !== col && board[row][i] === num) {
        return false;
      }
    }
    
    // Check column
    for (let i = 0; i < 4; i++) {
      if (i !== row && board[i][col] === num) {
        return false;
      }
    }
    
    // Check 2x2 box
    const boxRow = Math.floor(row / 2) * 2;
    const boxCol = Math.floor(col / 2) * 2;
    
    for (let i = boxRow; i < boxRow + 2; i++) {
      for (let j = boxCol; j < boxCol + 2; j++) {
        if (i !== row && j !== col && board[i][j] === num) {
          return false;
        }
      }
    }
    
    return true;
  };
  
  const resetGame = () => {
    setBoard([
      [1, null, 3, null],
      [null, 4, null, 2],
      [null, 2, null, 1],
      [3, null, 4, null]
    ]);
    setSelectedCell(null);
    setIsValid(true);
  };
  
  const isBoardComplete = (): boolean => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === null) {
          return false;
        }
      }
    }
    return isValid;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-400">Fill in the missing numbers</div>
        <button 
          className="px-3 py-1 text-sm bg-primary rounded-lg text-white"
          onClick={resetGame}
        >
          New Game
        </button>
      </div>
      
      <div className="max-w-xs mx-auto mb-4">
        <div className="grid grid-cols-4 gap-1 border-2 border-gray-600 p-1 bg-surface-light">
          {board.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square flex items-center justify-center text-lg font-medium cursor-pointer border ${
                  selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
                    ? "border-primary bg-primary bg-opacity-20"
                    : "border-gray-600"
                } ${
                  (rowIndex % 2 === 0 && colIndex % 2 === 0) || 
                  (rowIndex % 2 === 1 && colIndex % 2 === 1)
                    ? "bg-surface-lighter"
                    : ""
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))
          ))}
        </div>
        
        {!isValid && (
          <p className="text-error text-sm mt-2 text-center">
            Invalid placement. Try a different number.
          </p>
        )}
        
        {isBoardComplete() && (
          <p className="text-success text-sm mt-2 text-center">
            Congratulations! You've completed the puzzle!
          </p>
        )}
      </div>
      
      <div className="flex justify-center space-x-4 mb-4">
        {[1, 2, 3, 4].map(num => (
          <button
            key={num}
            className="w-10 h-10 bg-surface-light hover:bg-surface-lighter rounded-lg flex items-center justify-center text-lg font-medium"
            onClick={() => handleNumberInput(num)}
            disabled={!selectedCell}
          >
            {num}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-gray-300 text-center">
        Each row, column, and 2x2 box must contain the numbers 1-4 without repeats. 
        Sudoku helps improve concentration and mindfulness.
      </p>
    </div>
  );
};

export default WellnessGames;
