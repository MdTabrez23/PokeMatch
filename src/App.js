import { useEffect, useState } from "react";
import "./App.css";
import { SingleCard } from "./components/SingleCard";

const cardImages = [
  { src: "/img/1.png", matched: false },
  { src: "/img/2.png", matched: false },
  { src: "/img/3.png", matched: false },
  { src: "/img/4.png", matched: false },
  { src: "/img/5.png", matched: false },
  { src: "/img/6.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  useEffect(() => {
    shuffleCards();
  }, []);
  // Shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .map((card) => ({ ...card, id: Math.random() }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setTurns(0);
    setDisabled(false); // Ensure the game starts enabled
    setPlayer1Score(0); // Reset Player 1's score
    setPlayer2Score(0); // Reset Player 2's score
    setCurrentPlayer(1); // Player 1 starts
  };

  const handleChoice = (card) => {
    if (!disabled) {
      first ? setSecond(card) : setFirst(card);
    }
  };

  // Compare 2 choices
  useEffect(() => {
    if (first && second) {
      setDisabled(true); // Disable clicks while comparing

      if (first.src === second.src) {
        setCards((prevcards) => {
          return prevcards.map((card) => {
            if (card.src === first.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });

        // Update score of current player
        if (currentPlayer === 1) {
          setPlayer1Score((prevScore) => prevScore + 1);
        } else {
          setPlayer2Score((prevScore) => prevScore + 1);
        }

        resetTurn(true); // Keep the current player if they get a match
      } else {
        setTimeout(() => {
          resetTurn(false); // Switch player if no match
        }, 1000);
      }
    }
  }, [first, second]);

  // Reset choices & switch turns if no match
  const resetTurn = (isMatch) => {
    setFirst(null);
    setSecond(null);
    setTurns((prev) => prev + 1);
    setDisabled(false);

    // Switch to the other player if no match
    if (!isMatch) {
      setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
    }
  };
  return (
    <div className="App">
      <h1>PokeMatch</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="scoreboard">
        <p>Player 1 Score: {player1Score}</p>
        <p>Player 2 Score: {player2Score}</p>
      </div>
      <div className="turn-indicator">
        <p>Current Player: Player {currentPlayer}</p>
      </div>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            card={card}
            handleChoice={handleChoice}
            flipped={card === first || card === second || card.matched}
            disabled={disabled}
            key={card.id}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
