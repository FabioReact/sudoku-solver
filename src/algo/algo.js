const sudokuStr = "5,3,x,x,7,x,x,x,x,6,x,x,1,9,5,x,x,x,x,9,8,x,x,x,x,6,x,8,x,x,x,6,x,x,x,3,4,x,x,8,x,3,x,x,1,7,x,x,x,2,x,x,x,6,x,6,x,x,x,x,2,8,x,x,x,x,4,1,9,x,x,5,x,x,x,x,8,x,x,7,9"

const chunk = (array, size) => {
	let index = 0
	let indexArr = -1
	return array.reduce((arr, currentValue) => {
		if (index % size === 0) {
			arr.push([currentValue])
			indexArr++
		}
		else
			arr[indexArr].push(currentValue)
		index++
		return arr
	}, [])
}

const customSudoku = sudoku => {
	const possibleValuesArr = Array.from(Array(9), (_, i) => i + 1)
	return sudoku.map((line, y) => line.map((cell, x) => {
		let possibleValues = []
		if (cell === "x")
			possibleValues = possibleValuesArr
		return {
			value: cell,
			x,
			y,
			color: "#fff",
			possibleValues
		}
	}))
}

const sudokuSplit = sudokuStr.split(",")
const sudokuPlain = chunk(sudokuSplit, 9)

export const sudokuArray = customSudoku(sudokuPlain)

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


const sudokuSolver = (sudoku) => {

}
