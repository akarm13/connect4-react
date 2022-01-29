import { useEffect, useState } from "react";
import Button from "../../components/UI/Button";
import {
  Board,
  checkAll,
  fillBoard,
  minimax,
  pickBestMove,
} from "./boardHelpers";
import Row from "./Row";

export default function Game() {
  const [player1, setPlayer1] = useState(1);
  const [player2, setPlayer2] = useState(2);
  const [currentPlayer, setCurrentPlayer] = useState<null | number>(null);
  const [board, setBoard] = useState<Board>();
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState(true);

  const [isAiPlaying, setIsAiPlaying] = useState(false);
  useEffect(() => {
    initBoard();
  }, []);

  function setToDefault(board: Board) {
    setPlayer1(1);
    setPlayer2(2);
    setCurrentPlayer(player1);
    setBoard(board);
    setGameOver(false);
    setMessage("");
    setMode(true);
  }
  function initBoard() {
    // 6 rows, and 7 columns
    const board = fillBoard(6, 7);

    setToDefault(board);
    randomStart();
  }

  function togglePlayer() {
    return currentPlayer === player1 ? player2 : player1;
  }

  const randomStart = () => {
    // Generate either 1 or 2
    const randomPlayer = Math.floor(Math.random() * (3 - 1) + 1);

    if (randomPlayer === player2) {
      setCurrentPlayer(randomPlayer);
      setIsAiPlaying(true);

      aiPlay();
    }
  };

  function aiPlay() {
    if (board !== undefined) {
      const currentBoard = board;

      let col, minimaxScore;
      if (mode && board !== null) {
        col = pickBestMove(board, player2);
      } else {
        [col, minimaxScore] = minimax(
          currentBoard,
          4,
          true,
          player1,
          player2,
          gameOver
        );
      }

      play(col);
    }
  }

  function play(column: number | null) {
    if (column !== null) {
      if (!gameOver) {
        // Place piece on board
        let currentBoard = board;

        if (currentBoard) {
          for (let r = 5; r >= 0; r--) {
            if (!currentBoard[r][column]) {
              currentBoard[r][column] = currentPlayer;
              break;
            }
          }
        }

        // Check status of board
        if (currentBoard !== undefined) {
          let result = checkAll(currentBoard);
          if (result === player1) {
            setBoard(currentBoard);
            setGameOver(true);
            setIsAiPlaying(false);
            setMessage("Player 1 (black) wins!");
          } else if (result === player2) {
            setBoard(currentBoard);
            setGameOver(true);
            setIsAiPlaying(false);
            setMessage("Player 2 (green) wins!");
          } else if (result === "draw") {
            setBoard(currentBoard);
            setGameOver(true);
            setIsAiPlaying(false);
            setMessage("It's a draw!");
          } else {
            setBoard(currentBoard);
            setCurrentPlayer(togglePlayer());
          }
        } else {
          setMessage("Game over. Please start a new game.");
        }
      }
    }
  }

  useEffect(() => {
    if (currentPlayer === player2) {
      setIsAiPlaying(true);
    } else {
      setIsAiPlaying(false);
    }
    setTimeout(function () {
      // Call ai play
      if (currentPlayer === player2) {
        aiPlay();
      }
    }, 1000);
  }, [currentPlayer, player2]);

  useEffect(() => {
    if (board && currentPlayer === player1) {
      const bestMoveForPlayer = minimax(
        board,
        5,
        false,
        player1,
        player2,
        gameOver
      );
      console.log("Best move for player: ", bestMoveForPlayer);
    }
  }, [currentPlayer]);

  return (
    <div className="container">
      <div
        className="winorloss "
        style={{
          backgroundColor:
            gameOver && currentPlayer === 1
              ? "rgba(0,200,0,0.4)"
              : "rgba(200,0,0,0.4)",
          display: gameOver && currentPlayer ? "table" : "none",
        }}
      >
        <div className="flex justify-center items-center flex-col h-full">
          {gameOver && currentPlayer === 1 ? (
            <div>
              <h1>{"You WON!!!"}</h1>
            </div>
          ) : (
            <div>
              <h1>{"you LOST!!!"}</h1>
            </div>
          )}
          <Button
            variant="primary"
            className="mt-10 self-center"
            onClick={() => {
              setCurrentPlayer(player1);
              initBoard();
            }}
          >
            New Game
          </Button>
        </div>
      </div>
      <div className="game">
        <h1 className="text-primary text-4xl mt-4">Connect4</h1>

        <div className="row mt-4">
          <div
            className={
              "player red" +
              (currentPlayer === player1 ? " activePlayer" : " inactivePlayer")
            }
          ></div>
          <div
            className={
              "player yellow" +
              (currentPlayer === player2 ? " activePlayer" : " inactivePlayer")
            }
          ></div>
        </div>
        <table
          className={`${isAiPlaying ? "pointer-events-none opacity-70" : ""}`}
        >
          <thead />
          <tbody>
            {board &&
              board.map((row, i) => (
                <Row
                  key={i}
                  row={row}
                  play={(column: number) => {
                    if (row[column] === 1 || row[column] === 2) {
                      setMessage("Invalid move");
                    } else {
                      play(column);
                    }
                  }}
                />
              ))}
          </tbody>
        </table>
        <p className="message"> {message} </p>
      </div>
    </div>
  );
}
