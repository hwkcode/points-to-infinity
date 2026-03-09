import { useState } from "react"
import "./index.css"

interface Card {
  id: number
  group: number
  character: string
  isRaised: boolean
  isFlipped: boolean
  isMatched: boolean
}

const rows = 6
const cols = 8

const characters = [
  "aliens",
  "bopeep",
  "bullseye",
  "buttercup",
  "buzz",
  "dolly",
  "dukecaboom",
  "forky",
  "hamm",
  "jessie",
  "mrpotatohead",
  "woody",
]

const brailleMap: Record<string, number[]> = {
  M: [1, 3, 4],
  R: [1, 2, 3, 5],
  ".": [2, 5, 6],
  S: [2, 3, 4],
  P: [1, 2, 3, 4],
  E: [1, 5],
  L: [1, 2, 3],
}

const letters = ["M", "R", ".", "S", "P", "E", "L", "L"]

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

function buildBoard(): Card[] {
  const board: Card[] = []

  // 12 groups, each appears 4 times
  const groups = shuffle([
    0,0,0,0,
    1,1,1,1,
    2,2,2,2,
    3,3,3,3,
    4,4,4,4,
    5,5,5,5,
    6,6,6,6,
    7,7,7,7,
    8,8,8,8,
    9,9,9,9,
    10,10,10,10,
    11,11,11,11,
  ])

  let index = 0

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {

      const group = groups[index++]
      const character = characters[group]

      const letterRow = row < 3 ? 0 : 1
      const letterCol = Math.floor(col / 2)
      const letterIndex = letterRow * 4 + letterCol
      const letter = letters[letterIndex]

      const localRow = row % 3
      const localCol = col % 2
      const dotNumber =
        localCol === 0
          ? localRow + 1
          : localRow + 4

      const isRaised = brailleMap[letter].includes(dotNumber)

      board.push({
        id: row * cols + col,
        group,
        character,
        isRaised,
        isFlipped: false,
        isMatched: false,
      })
    }
  }

  return board
}

export default function App() {
  const [cards, setCards] = useState<Card[]>(buildBoard())
  const [flipped, setFlipped] = useState<Card[]>([])
  const [checking, setChecking] = useState(false)
  const [revealAll, setRevealAll] = useState(false)

  const handleFlip = (card: Card) => {
    if (revealAll) return
    if (checking) return
    if (card.isFlipped || card.isMatched) return
    if (flipped.length === 4) return

    const updated = cards.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    )

    const newFlipped = [...flipped, { ...card, isFlipped: true }]

    setCards(updated)
    setFlipped(newFlipped)

    if (newFlipped.length === 4) {
      checkMatch(newFlipped)
    }
  }

  const checkMatch = (four: Card[]) => {
    setChecking(true)

    const sameGroup = four.every(c => c.group === four[0].group)

    if (sameGroup) {
      setCards(prev =>
        prev.map(c =>
          four.some(f => f.id === c.id)
            ? { ...c, isMatched: true }
            : c
        )
      )
      setFlipped([])
      setChecking(false)
    } else {
      setTimeout(() => {
        setCards(prev =>
          prev.map(c =>
            four.some(f => f.id === c.id)
              ? { ...c, isFlipped: false }
              : c
          )
        )
        setFlipped([])
        setChecking(false)
      }, 800)
    }
  }

  const resetGame = () => {
    setCards(buildBoard())
    setFlipped([])
    setChecking(false)
    setRevealAll(false)
  }

  return (
    <div className="game">
      <h1>Points to Infinity</h1>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => setRevealAll(!revealAll)}>
          {revealAll ? "Hide Solution" : "Reveal Solution"}
        </button>

        <button onClick={resetGame} style={{ marginLeft: "10px" }}>
          Restart
        </button>
      </div>

      <div className="board">
        {cards.map(card => (
          <div
            key={card.id}
            className={`card ${
              revealAll || card.isFlipped || card.isMatched ? "flipped" : ""
            }`}
            onClick={() => handleFlip(card)}
          >
            <div className="card-inner">
              <div className="card-front">
                <img
                  src={`/images/${card.character}-${card.isRaised ? "raised" : "flat"}.png`}
                  alt=""
                />
              </div>
              <div className="card-back">
                <img src="/images/toystorycard.png" alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
