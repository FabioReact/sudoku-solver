import React, {useState, useEffect} from "react"
import "./App.css"
import {sudokuArray} from "./algo/algo"

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
	return null
}

const colorCase = (sudoku, x, y, color) => {
	const newSudoku = [...sudoku]
	newSudoku[y][x].color = color
	return newSudoku
}

const findColumn = (sudoku, x) => {
	let i = 0
	const tab = []
	while (i < 9) {
		const value = sudoku[i][x].value
		if (value !== "x")
			tab.push(Number.parseInt(value))
		i++
	}
	return tab
}

const findRange = number => {
	if (number < 3) return [0, 2]
	else if (number < 6) return [3, 5]
	else return [6, 8]
}

const findSquare = (sudoku, x, y) => {
	const [minX, maxX] = findRange(x)
	const [minY, maxY] = findRange(y)
	const tab = []
	for (let x = minX; x <= maxX; x++) {
		for (let y = minY; y <= maxY; y++) {
			const value = sudoku[y][x].value
			if (value !== "x")
				tab.push(Number.parseInt(value))
		}
	}
	return tab
}

const findLine = (sudoku, y) => {
	return sudoku[y].reduce((array, obj) => {
		const value = obj.value
		if (value !== "x")
			array.push(Number.parseInt(value))
		return array
	}, [])
}

const findNumbers = (sudoku, x, y) => {
	const possibleNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	const column = findColumn(sudoku, x)
	const square = findSquare(sudoku, x, y)
	const line = findLine(sudoku, y)
	return possibleNumber.filter(number => {
		const isInColumn = column.includes(number)
		const isInLine = line.includes(number)
		const isInSquare = square.includes(number)
		return !isInColumn && !isInLine && !isInSquare
	})
}

const eliminateNumber = (x, y, number, sudoku) => {
	const newSudoku = [...sudoku]
	const line = sudoku[y].reduce((array, cell) => {
		array.push(cell)
		return array
	}, [])
	for (const cell of line) {
		const isInArray =	cell.possibleValues.includes(number)
		// console.log(cell.possibleValues, isInArray)
		if (isInArray) {
			const newPossibleValues = cell.possibleValues.filter(n => n !== number)
			if (newPossibleValues.length === 1) {
				// console.log("je dois changer")
				newSudoku[cell.y][cell.x].value = newPossibleValues[0]
				newSudoku[cell.y][cell.x].possibleValues = []
			} else {
				newSudoku[cell.y][cell.x].possibleValues = newPossibleValues
			}
		}
	}
	return newSudoku
}

const nextCoord = (x, y) => {
	if (x < 8) return [x + 1, y]
	else if (y > 8 || (y === 8 && x === 8)) return [0, 0]
	return [0, y + 1]
}

const App = () => {
	const [sudoku, setsudoku] = useState(sudokuArray)
	const [coord, setcoord] = useState({x: 0, y:0})

	useEffect(() => {
		const foundNumbers = findNumbers(sudoku, coord.x, coord.y)
		if (foundNumbers?.length !== 1) {
			const newSudoku = [...sudoku]
			newSudoku[coord.y][coord.x].possibleValues = foundNumbers
			setsudoku(newSudoku)
		}
		if ((foundNumbers === null || foundNumbers.length > 1) || (coord.x === 0 && coord.y === 0)) {
			const [nextX, nextY] = nextCoord(coord.x, coord.y)
			if (!isFinished(sudoku))
				startAlgo(nextX, nextY)
		} else if (foundNumbers !== null) {
			const newSudoku = [...sudoku]
			newSudoku[coord.y][coord.x].value = foundNumbers[0]
			newSudoku[coord.y][coord.x].color = "lightblue"
			setsudoku(newSudoku)
			eliminateNumber(coord.x, coord.y, foundNumbers[0], newSudoku)
			const [nextX, nextY] = nextCoord(coord.x, coord.y)
			if (!isFinished(sudoku))
				startAlgo(nextX, nextY)
		}
	}, [coord])

	const startAlgo = (x, y) => {
		if (isFinished(sudoku)) return
		try {
			const [indexX, indexY] = findFirstEmpty(sudoku, x, y)
			const newSudoku = colorCase(sudoku, indexX, indexY, "lightgreen")
			setsudoku(newSudoku)
			setcoord({x: indexX, y: indexY})
		} catch (e) {
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
