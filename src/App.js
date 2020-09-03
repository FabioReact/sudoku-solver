import React, {useState} from "react"
import "./App.css"
import {sudokuArray, findNumbers, findRange, deepCloneArray} from "./algo/algo"

const isFinished = (sudoku) => {
	for (let row of sudoku) {
		for (let obj of row) {
			if (obj.value === "x") return false
		}
	}
	return true
}

const findFirstEmpty = (sudoku, firstX, firstY) => {
	let x = firstX
	for (let y = firstY; y < sudoku.length; y++) {
		while (x < sudoku[y].length) {
			const obj = sudoku[y][x]
			if (obj.value === "x") {
				return [x, y]
			}
			x++
		}
		x = 0
	}
	// if (!isFinished(sudoku)) return findFirstEmpty(sudoku, 0, 0)
	return null
}

const eliminateLoop = (number, line, sudoku) => {
	for (const cell of line) {
		// if (x === 4 && y === 4) console.log(cell)
		const isInArray = cell.possibleValues.includes(number)
		if (isInArray) {
			// console.log(`x: ${cell + 1} - y; ${line + 1}`)
			// console.log(cell.possibleValues, isInArray)
			const newPossibleValues = cell.possibleValues.filter(n => n !== number)
			if (newPossibleValues.length === 1) {
				// console.log("je dois changer la valeur de la cellule:", cell.x + 1, cell.y + 1)
				// console.log(newPossibleValues)
				sudoku[cell.y][cell.x].value = newPossibleValues[0]
				sudoku[cell.y][cell.x].possibleValues = []
				sudoku[cell.y][cell.x].color = "lightblue"
				return [cell.x, cell.y, newPossibleValues[0]]
			} else {
				sudoku[cell.y][cell.x].possibleValues = newPossibleValues
			}
		}
	}
	return null
	// return sudoku
}

const findSquareArray = (sudoku, x, y) => {
	const [minX, maxX] = findRange(x)
	const [minY, maxY] = findRange(y)
	const tab = []
	for (let x = minX; x <= maxX; x++) {
		for (let y = minY; y <= maxY; y++) {
			tab.push(sudoku[y][x])
		}
	}
	return tab
}

const eliminateNumber = (x, y, number, sudoku) => {
	const newSudoku = deepCloneArray(sudoku)
	const line = sudoku[y].reduce((array, cell) => {
		array.push(cell)
		return array
	}, [])
	const column = []
	for (let i = 0; i < 9; i++) {
		column.push(sudoku[i][x])
	}
	const square = findSquareArray(sudoku, x, y)
	const foundLine = eliminateLoop(number, line, newSudoku)
	const foundColumn = eliminateLoop(number, column, newSudoku)
	const foundSquare = eliminateLoop(number, square, newSudoku)
	if (foundLine) eliminateNumber(...foundLine, sudoku)
	if (foundColumn) eliminateNumber(...foundColumn, sudoku)
	if (foundSquare) eliminateNumber(...foundSquare, sudoku)
	return newSudoku
}

const nextCoord = (x, y) => {
	if (x < 8) return [x + 1, y]
	else if (y > 8 || (y === 8 && x === 8)) return [0, 0]
	return [0, y + 1]
}

const App = () => {
	const [sudoku, setsudoku] = useState(sudokuArray)

	const startAlgo = (x, y) => {
		try {
			const [indexX, indexY] = findFirstEmpty(sudoku, x, y)
			// console.log(indexX + 1, indexY + 1)
			const foundNumbers = findNumbers(sudoku, indexX, indexY)
			// console.log(`Possible match: ${foundNumbers}`)
			const newSudoku = deepCloneArray(sudoku)
			let backtrack = false
			if (foundNumbers.length === 1) {
				sudoku[indexY][indexX].value = foundNumbers[0]
				sudoku[indexY][indexX].possibleValues = []
				sudoku[indexY][indexX].color = "lightblue"
				backtrack = true
			} else {
				sudoku[indexY][indexX].possibleValues = foundNumbers
				sudoku[indexY][indexX].color = "lightgreen"
			}
			setsudoku(newSudoku)
			if (backtrack) {
				console.log(`${foundNumbers[0]} trouvé en ${indexX + 1} ${indexY + 1}`)
				const s2 = eliminateNumber(indexX, indexY, foundNumbers[0], sudoku)
				setsudoku(s2)
			}
			const [nextX, nextY] = nextCoord(indexX, indexY)
			// startAlgo(indexX, indexY)
			setTimeout(() => {
				startAlgo(nextX, nextY)
			}, 50);
		} catch {
			console.log("On a parcouru le sudoku")
		}
	}


	return (
		<div className="container">
			<h1>Sudoku</h1>
			<table>
				<tbody>
					{sudoku.map((line, index) => {
						return (
							<tr key={`row${index}`}>
								{line.map((cell, i) => (
									<td key={`number${i}`} style={{backgroundColor: cell.color}}>
										<span>{cell.value === "x" && cell.possibleValues.map(n => n)}</span>
										{cell.value !== "x" && cell.value}
									</td>
								))}
							</tr>
						)
					})}
				</tbody>
			</table>
			<button onClick={() => startAlgo(0, 0)}>Start</button>
		</div>
	)
}

export default App
