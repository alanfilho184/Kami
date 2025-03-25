function deepClone(array: []) {
	return JSON.parse(JSON.stringify(array))
}

function rollDice(diceFaces: number) {
	return Math.floor(Math.random() * diceFaces) + 1
}

function buildDiceObj(dice: string) {
	const diceArray = dice.split(/(?=[dv<>])/gi)
	const diceFaces = Number(diceArray[1].replace(/[dv<>]/gi, ''))
	const diceQuantity = Number(diceArray[0].replace(/[dv<>]/gi, ''))
	const diceResults: number[] = []
	const diceSum: number[] = []
	const diceAdvantage: number[] = []
	const diceDisadvantage: number[] = []
	const diceGreater: number[] = []
	const diceLess: number[] = []
	const diceGreaterQuantity: number[] = []
	const diceLessQuantity: number[] = []
	const diceGreaterSum: number[] = []
	const diceLessSum: number[] = []

	for (let i = 0; i < diceQuantity; i++) {
		const diceResult = rollDice(diceFaces)
		diceResults.push(diceResult)
		diceSum.push(diceResult)
		diceAdvantage.push(diceResult)
		diceDisadvantage.push(diceResult)
		diceGreater.push(diceResult)
		diceLess.push(diceResult)
		diceGreaterQuantity.push(diceResult)
		diceLessQuantity.push(diceResult)
		diceGreaterSum.push(diceResult)
		diceLessSum.push(diceResult)
	}

	function instanceCounter(string: string, instance: string) {
		return string.split(instance).length - 1
	}

	const greater = dice.indexOf('>') != -1 ? diceGreater.filter(roll => roll > Number(dice.split('>')[1])) : null
	const less = dice.indexOf('<') != -1 ? diceGreater.filter(roll => roll < Number(dice.split('<')[1])) : null

	let diceObj: any = {}
	diceObj = {
		quantity: diceQuantity,
		faces: diceFaces,
		results: diceResults,
		sum: diceSum.reduce((a, b) => a + b, 0),
		advantage: dice.indexOf('v') != -1 ? Math.max(...diceAdvantage) : 0,
		disadvantage: instanceCounter(dice, 'd') > 1 ? Math.min(...diceDisadvantage) : 0,
		greater: greater,
		less: less,
		greaterQuantity: greater != null ? greater.length : null,
		lessQuantity: less != null ? less.length : null,
		greaterSum: greater != null ? greater.reduce((a: number, b: number) => a + b, 0) : null,
		lessSum: less != null ? less.reduce((a: number, b: number) => a + b, 0) : null,
		diceString: dice,
		has: {
			advantage: dice.indexOf('v') != -1 ? true : false,
			disadvantage: instanceCounter(dice, 'd') > 1 ? true : false,
			greater: dice.indexOf('>') != -1 ? true : false,
			less: dice.indexOf('<') != -1 ? true : false,
		},
	}

	return diceObj
}

function calculateOperation(operationsArray: string[]) {
	if (operationsArray.length == 3) {
		let sumResult: any = null

		const firstOperand = operationsArray[0]
		const operator = operationsArray[1]
		const secondOperand = operationsArray[2]

		if (typeof firstOperand == 'object' && typeof secondOperand == 'object') {
			let firstOperandModifer = 'sum'
			for (const modifer of Object.keys(firstOperand)) {
				if (['advantage', 'disadvantage', 'greaterSum', 'lessSum'].includes(modifer)) {
					if (firstOperand[modifer] != 0 && firstOperand[modifer] != null) {
						firstOperandModifer = modifer
						break
					}
				}
			}

			let secondOperandModifer = 'sum'
			for (const modifer of Object.keys(secondOperand)) {
				if (['advantage', 'disadvantage', 'greaterSum', 'lessSum'].includes(modifer)) {
					if (secondOperand[modifer] != 0 && secondOperand[modifer] != null) {
						secondOperandModifer = modifer
						break
					}
				}
			}

			if (operator == '*') {
				sumResult = firstOperand[firstOperandModifer] * secondOperand[secondOperandModifer]
			} else if (operator == '/') {
				sumResult = firstOperand[firstOperandModifer] / secondOperand[secondOperandModifer]
			} else if (operator == '+') {
				sumResult = firstOperand[firstOperandModifer] + secondOperand[secondOperandModifer]
			} else if (operator == '-') {
				sumResult = firstOperand[firstOperandModifer] - secondOperand[secondOperandModifer]
			}
		} else if (typeof firstOperand == 'object' && typeof secondOperand == 'string') {
			let firstOperandModifer = 'sum'
			for (const modifer of Object.keys(firstOperand)) {
				if (['advantage', 'disadvantage', 'greaterSum', 'lessSum'].includes(modifer)) {
					if (firstOperand[modifer] != 0 && firstOperand[modifer] != null) {
						firstOperandModifer = modifer
						break
					}
				}
			}

			if (operator == '*') {
				sumResult = firstOperand[firstOperandModifer] * parseInt(secondOperand)
			} else if (operator == '/') {
				sumResult = firstOperand[firstOperandModifer] / parseInt(secondOperand)
			} else if (operator == '+') {
				sumResult = firstOperand[firstOperandModifer] + parseInt(secondOperand)
			} else if (operator == '-') {
				sumResult = firstOperand[firstOperandModifer] - parseInt(secondOperand)
			}
		} else if (typeof firstOperand == 'string' && typeof secondOperand == 'object') {
			let secondOperandModifer = 'sum'
			for (const modifer of Object.keys(secondOperand)) {
				if (['advantage', 'disadvantage', 'greaterSum', 'lessSum'].includes(modifer)) {
					if (secondOperand[modifer] != 0 && secondOperand[modifer] != null) {
						secondOperandModifer = modifer
						break
					}
				}
			}

			if (operator == '*') {
				sumResult = parseInt(firstOperand) * secondOperand[secondOperandModifer]
			} else if (operator == '/') {
				sumResult = parseInt(firstOperand) / secondOperand[secondOperandModifer]
			} else if (operator == '+') {
				sumResult = parseInt(firstOperand) + secondOperand[secondOperandModifer]
			} else if (operator == '-') {
				sumResult = parseInt(firstOperand) - secondOperand[secondOperandModifer]
			}
		} else if (typeof firstOperand == 'string' && typeof secondOperand == 'string') {
			if (operator == '*') {
				sumResult = parseInt(firstOperand) * parseInt(secondOperand)
			} else if (operator == '/') {
				sumResult = parseInt(firstOperand) / parseInt(secondOperand)
			} else if (operator == '+') {
				sumResult = parseInt(firstOperand) + parseInt(secondOperand)
			} else if (operator == '-') {
				sumResult = parseInt(firstOperand) - parseInt(secondOperand)
			}
		} else {
			throw new Error('Invalid operation')
		}

		if (sumResult != null) {
			return sumResult
		}
	} else if (operationsArray.length > 3) {
		let result = null

		for (let i = 1; i < operationsArray.length; i += 2) {
			let firstOperand: any = result !== null ? result : operationsArray[i - 1]
			const operator = operationsArray[i]
			let secondOperand = operationsArray[i + 1]

			if (typeof firstOperand != 'object') {
				firstOperand = `${firstOperand}`
			}

			if (typeof secondOperand != 'object') {
				secondOperand = `${secondOperand}`
			}

			let sumResult: any = null

			if (typeof firstOperand == 'object' && typeof secondOperand == 'object') {
				let firstOperandModifer = 'sum'
				for (const modifer of Object.keys(firstOperand)) {
					if (['advantage', 'disadvantage', 'greaterSum', 'lessSum'].includes(modifer)) {
						if (firstOperand[modifer] != 0 && firstOperand[modifer] != null && firstOperand[modifer] != null) {
							firstOperandModifer = modifer
							break
						}
					}
				}

				let secondOperandModifer = 'sum'
				for (const modifer of Object.keys(secondOperand)) {
					if (['advantage', 'disadvantage', 'greaterSum', 'lessSum'].includes(modifer)) {
						if (secondOperand[modifer] != 0 && secondOperand[modifer] != null && secondOperand[modifer] != null) {
							secondOperandModifer = modifer
							break
						}
					}
				}

				if (operator == '*') {
					sumResult = firstOperand[firstOperandModifer] * secondOperand[secondOperandModifer]
				} else if (operator == '/') {
					sumResult = firstOperand[firstOperandModifer] / secondOperand[secondOperandModifer]
				} else if (operator == '+') {
					sumResult = firstOperand[firstOperandModifer] + secondOperand[secondOperandModifer]
				} else if (operator == '-') {
					sumResult = firstOperand[firstOperandModifer] - secondOperand[secondOperandModifer]
				}
			} else if (typeof firstOperand == 'object' && typeof secondOperand == 'string') {
				let firstOperandModifer = 'sum'
				for (const modifer of Object.keys(firstOperand)) {
					if (['advantage', 'disadvantage', 'greaterSum', 'lessSum'].includes(modifer)) {
						if (firstOperand[modifer] != 0 && firstOperand[modifer] != null) {
							firstOperandModifer = modifer
							break
						}
					}
				}

				if (operator == '*') {
					sumResult = firstOperand[firstOperandModifer] * parseInt(secondOperand)
				} else if (operator == '/') {
					sumResult = firstOperand[firstOperandModifer] / parseInt(secondOperand)
				} else if (operator == '+') {
					sumResult = firstOperand[firstOperandModifer] + parseInt(secondOperand)
				} else if (operator == '-') {
					sumResult = firstOperand[firstOperandModifer] - parseInt(secondOperand)
				}
			} else if (typeof firstOperand == 'string' && typeof secondOperand == 'object') {
				let secondOperandModifer = 'sum'
				for (const modifer of Object.keys(secondOperand)) {
					if (['advantage', 'disadvantage', 'greaterSum', 'lessSum'].includes(modifer)) {
						if (secondOperand[modifer] != 0 && secondOperand[modifer] != null) {
							secondOperandModifer = modifer
							break
						}
					}
				}

				if (operator == '*') {
					sumResult = parseInt(firstOperand) * secondOperand[secondOperandModifer]
				} else if (operator == '/') {
					sumResult = parseInt(firstOperand) / secondOperand[secondOperandModifer]
				} else if (operator == '+') {
					sumResult = parseInt(firstOperand) + secondOperand[secondOperandModifer]
				} else if (operator == '-') {
					sumResult = parseInt(firstOperand) - secondOperand[secondOperandModifer]
				}
			} else if (typeof firstOperand == 'string' && typeof secondOperand == 'string') {
				if (operator == '*') {
					sumResult = parseInt(firstOperand) * parseInt(secondOperand)
				} else if (operator == '/') {
					sumResult = parseInt(firstOperand) / parseInt(secondOperand)
				} else if (operator == '+') {
					sumResult = parseInt(firstOperand) + parseInt(secondOperand)
				} else if (operator == '-') {
					sumResult = parseInt(firstOperand) - parseInt(secondOperand)
				}
			} else {
				throw new Error('Invalid operation')
			}

			if (sumResult !== null) {
				result = sumResult
			}
		}

		return result
	} else {
		throw new Error('Invalid operation')
	}
}

function validateDiceString(dice: string) {
	try {
		const regex = /^(\d{1,3}|[d*v<>+\-*/()\[\]{}])+$/
		const regexPass = regex.test(dice)

		if (regexPass) {
			const diceArray = dice.split(/(?=[+-/*()[\]{}])|(?<=[+-/*()[\]{}])/gi)
			let sizePass = true

			diceArray.forEach((dice, index) => {
				if (dice.startsWith('d') || dice.startsWith('D')) {
					dice = '1' + dice
				}

				if (!dice.match(/(?<=[+-/*()[\]{}])|(?=[+-/*()[\]{}])/gi)) {
					try {
						if (dice.match(/(?<!d)\d+$/gi)) {
							const diceSplit = dice.split('d')

							if (diceSplit.length == 1) {
								if (diceSplit[0].indexOf('>') != -1 && diceSplit[0].indexOf('<') == -1) {
									const diceSplitOp = diceSplit[0].split('>')
									if (
										Number(diceSplitOp[1]) > 100000 ||
                                        Number(diceSplitOp[0]) > 100000 ||
                                        Number(diceSplitOp[0]) == 0 ||
                                        Number(diceSplitOp[1]) == 0
									) {
										sizePass = false
										return
									}
								} else if (diceSplit[0].indexOf('>') == -1 && diceSplit[0].indexOf('<') != -1) {
									const diceSplitOp = diceSplit[0].split('<')
									if (
										Number(diceSplitOp[1]) > 100000 ||
                                        Number(diceSplitOp[0]) > 100000 ||
                                        Number(diceSplitOp[0]) == 0 ||
                                        Number(diceSplitOp[1]) == 0
									) {
										sizePass = false
										return
									}
								} else if (diceSplit[0].indexOf('>') != -1 && diceSplit[0].indexOf('<') != -1) {
									let diceSplitOp = diceSplit[0].split('>')

									if (
										Number(diceSplitOp[1].split('<')[0]) > 100000 ||
                                        Number(diceSplitOp[0]) > 100000 ||
                                        Number(diceSplitOp[0]) == 0 ||
                                        Number(diceSplitOp[1].split('<')[0]) == 0
									) {
										sizePass = false
										return
									}

									diceSplitOp = diceSplit[0].split('<')

									if (
										Number(diceSplitOp[1].split('>')[0]) > 100000 ||
                                        Number(diceSplitOp[0]) > 100000 ||
                                        Number(diceSplitOp[0]) == 0 ||
                                        Number(diceSplitOp[1].split('>')[0]) == 0
									) {
										sizePass = false
										return
									}
								} else {
									if (Number(diceSplit[0]) > 100000 || Number(diceSplit[0]) == 0) {
										sizePass = false
										return
									}
								}
							} else if (diceSplit.length == 2) {
								if (Number(diceSplit[0]) > 1000 || Number(diceSplit[0]) == 0) {
									sizePass = false
									return
								} else if (diceSplit[1].indexOf('>') != -1 && diceSplit[1].indexOf('<') == -1) {
									const diceSplitOp = diceSplit[1].split('>')

									if (
										Number(diceSplitOp[0]) > 1000 ||
                                        Number(diceSplitOp[1]) > 100000 ||
                                        Number(diceSplitOp[0]) == 0 ||
                                        Number(diceSplitOp[1]) == 0
									) {
										sizePass = false
										return
									}
								} else if (diceSplit[1].indexOf('>') == -1 && diceSplit[1].indexOf('<') != -1) {
									const diceSplitOp = diceSplit[1].split('<')

									if (
										Number(diceSplitOp[0]) > 1000 ||
                                        Number(diceSplitOp[1]) > 100000 ||
                                        Number(diceSplitOp[0]) == 0 ||
                                        Number(diceSplitOp[1]) == 0
									) {
										sizePass = false
										return
									}
								} else if (diceSplit[1].indexOf('>') != -1 && diceSplit[1].indexOf('<') != -1) {
									let diceSplitOp = diceSplit[1].split('>')

									if (
										Number(diceSplitOp[0]) > 1000 ||
                                        Number(diceSplitOp[1]) > 100000 ||
                                        Number(diceSplitOp[0]) == 0 ||
                                        Number(diceSplitOp[1]) == 0
									) {
										sizePass = false
										return
									}

									diceSplitOp = diceSplit[1].split('<')

									if (
										Number(diceSplitOp[0]) > 1000 ||
                                        Number(diceSplitOp[1]) > 100000 ||
                                        Number(diceSplitOp[0]) == 0 ||
                                        Number(diceSplitOp[1]) == 0
									) {
										sizePass = false
										return
									}
								} else {
									if (Number(diceSplit[1]) > 1000 || Number(diceSplit[1]) == 0) {
										sizePass = false
										return
									}
								}
							} else if (diceSplit.length == 3) {
								if (Number(diceSplit[0]) > 1000 || Number(diceSplit[0]) == 0) {
									sizePass = false
									return
								} else if (Number(diceSplit[1].replace(/[<>dv]/gi, '')) > 1000 || Number(diceSplit[1].replace(/[<>dv]/gi, '')) == 0) {
									sizePass = false
									return
								}

								if (diceSplit[2].indexOf('>') != -1 && diceSplit[2].indexOf('<') == -1) {
									const diceSplitOp = diceSplit[2].split('>')
									if (Number(diceSplitOp[1]) > 100000 || Number(diceSplitOp[1]) == 0) {
										sizePass = false
										return
									}
								} else if (diceSplit[2].indexOf('>') == -1 && diceSplit[2].indexOf('<') != -1) {
									const diceSplitOp = diceSplit[2].split('<')
									if (Number(diceSplitOp[1]) > 100000 || Number(diceSplitOp[1]) == 0) {
										sizePass = false
										return
									}
								} else if (diceSplit[2].indexOf('>') != -1 && diceSplit[2].indexOf('<') != -1) {
									let diceSplitOp = diceSplit[2].split('>')

									if (Number(diceSplitOp[1].split('<')[0]) > 100000 || Number(diceSplitOp[1].split('<')[0]) == 0) {
										sizePass = false
										return
									}

									diceSplitOp = diceSplit[2].split('<')

									if (Number(diceSplitOp[1].split('>')[0]) > 100000 || Number(diceSplitOp[1].split('>')[0]) == 0) {
										sizePass = false
										return
									}
								}
							} else if (diceSplit.length > 3) {
								sizePass = false
								return
							}
						} else {
							if (dice[0] == 'd' || dice[0] == 'D') {
								dice = '1' + dice
								diceArray[index] = dice
							}

							const diceSplit = dice.split('d')

							if (diceSplit.length == 2) {
								if (Number(diceSplit[0]) > 1000) {
									sizePass = false
									return
								} else if (Number(diceSplit[1].replace(/[<>dv]/gi, '')) > 1000) {
									sizePass = false
									return
								}
							} else if (diceSplit.length == 3) {
								if (Number(diceSplit[0]) > 1000) {
									sizePass = false
									return
								} else if (Number(diceSplit[1].replace(/[<>dv]/gi, '')) > 1000) {
									sizePass = false
									return
								}
							}
						}
					} catch (err) {
						throw err
					}
				}
			})

			if (sizePass) {
				return true
			} else {
				return false
			}
		} else {
			return false
		}
	} catch (err) {
		return false
	}
}

function formatDiceStringOutput(unformattedDices: any) {
	let formattedString = ''
	if (unformattedDices.final !== undefined) {
		for (let i = 0; i < unformattedDices.diceArray.length; i++) {
			if (unformattedDices.diceArray[i].match(/(?<=[+-/*()[\]{}])|(?=[+-/*()[\]{}])/gi)) {
				formattedString += unformattedDices.diceArray[i]
			} else {
				if (unformattedDices.diceArray[i][0] == 'd' || unformattedDices.diceArray[i][0] == 'D') {
					unformattedDices.diceArray[i] = '1' + unformattedDices.diceArray[i]
				}

				formattedString += `${unformattedDices.diceArray[i]}`
			}
		}

		formattedString += ' = '

		function formatDiceResolvedRecursivly(diceArray: Array<any>) {
			for (let i = 0; i < diceArray.length; i++) {
				if (Array.isArray(diceArray[i])) {
					formatDiceResolvedRecursivly(diceArray[i])
				} else {
					if (typeof diceArray[i] == 'object') {
						if (diceArray[i].has.advantage) {
							formattedString += `[${diceArray[i].results.join(', ')}]v`
							formattedString += ` => ${diceArray[i].advantage}`
						} else if (diceArray[i].has.disadvantage) {
							formattedString += `[${diceArray[i].results.join(', ')}]d`
							formattedString += ` => ${diceArray[i].disadvantage}`
						} else if (diceArray[i].has.greater) {
							formattedString += `[${diceArray[i].results.join(', ') || 0}] > ${diceArray[i].diceString.split('>')[1]} => `
							formattedString += `(${diceArray[i].greater.join(', ') || 0})`
							formattedString += ` => ${diceArray[i].greaterSum}`
						} else if (diceArray[i].has.less) {
							formattedString += `[${diceArray[i].results.join(', ') || 0}] < ${diceArray[i].diceString.split('<')[1]} => `
							formattedString += `(${diceArray[i].less.join(', ') || 0})`
							formattedString += ` => ${diceArray[i].lessSum}`
						} else {
							formattedString += `[${diceArray[i].sum}]`
						}
					} else {
						formattedString += `${diceArray[i]}`
					}
				}
			}
		}

		for (let i = 0; i < unformattedDices.resolvedDices.length; i++) {
			if (Array.isArray(unformattedDices.resolvedDices[i])) {
				formatDiceResolvedRecursivly(unformattedDices.resolvedDices[i])
			} else {
				if (typeof unformattedDices.resolvedDices[i] == 'object') {
					if (unformattedDices.resolvedDices[i].has.advantage) {
						formattedString += `[${unformattedDices.resolvedDices[i].results.join(', ')}]v`
						formattedString += ` => ${unformattedDices.resolvedDices[i].advantage}`
					} else if (unformattedDices.resolvedDices[i].has.disadvantage) {
						formattedString += `[${unformattedDices.resolvedDices[i].results.join(', ')}]d`
						formattedString += ` => ${unformattedDices.resolvedDices[i].disadvantage}`
					} else if (unformattedDices.resolvedDices[i].has.greater) {
						formattedString += `[${unformattedDices.resolvedDices[i].results.join(', ') || 0}] > ${
							unformattedDices.resolvedDices[i].diceString.split('>')[1]
						} => `
						formattedString += `(${unformattedDices.resolvedDices[i].greater.join(', ') || 0})`
						formattedString += ` => ${unformattedDices.resolvedDices[i].greaterSum}`
					} else if (unformattedDices.resolvedDices[i].has.less) {
						formattedString += `[${unformattedDices.resolvedDices[i].results.join(', ') || 0}] < ${
							unformattedDices.resolvedDices[i].diceString.split('<')[1]
						} => `
						formattedString += `(${unformattedDices.resolvedDices[i].less.join(', ') || 0})`
						formattedString += ` => ${unformattedDices.resolvedDices[i].lessSum}`
					} else {
						if (unformattedDices.resolvedDices[i].results.length > 1) {
							formattedString += `[${unformattedDices.resolvedDices[i].results.join(', ')}] => `
						}
						formattedString += `[${unformattedDices.resolvedDices[i].sum}]`
					}
				} else {
					if (formattedString.endsWith(' ')) {
						formattedString += `${unformattedDices.resolvedDices[i]}`
					} else {
						formattedString += ` ${unformattedDices.resolvedDices[i]} `
					}
				}
			}
		}

		formattedString += ` = ${unformattedDices.final}`

		return formattedString
	} else {
		formattedString += `${unformattedDices.diceString} = `

		if (unformattedDices.has.advantage) {
			formattedString += `[${unformattedDices.results.join(', ')}]v`
			formattedString += ` = ${unformattedDices.advantage}`
		} else if (unformattedDices.has.disadvantage) {
			formattedString += `[${unformattedDices.results.join(', ')}]d`
			formattedString += ` = ${unformattedDices.disadvantage}`
		} else if (unformattedDices.has.greater) {
			formattedString += `[${unformattedDices.results.join(', ') || 0}] > ${unformattedDices.diceString.split('>')[1]} => `
			formattedString += `(${unformattedDices.greater.join(', ') || 0})`
			formattedString += ` = ${unformattedDices.greaterSum}`
		} else if (unformattedDices.has.less) {
			formattedString += `[${unformattedDices.results.join(', ') || 0}] < ${unformattedDices.diceString.split('<')[1]} => `
			formattedString += `(${unformattedDices.less.join(', ') || 0})`
			formattedString += ` = ${unformattedDices.lessSum}`
		} else {
			if (unformattedDices.results.length > 1) {
				formattedString += `[${unformattedDices.results.join(', ')}] = `
			}

			formattedString += `${unformattedDices.sum}`
		}

		return formattedString
	}
}

function diceRoller(dice: string) {
	dice = dice.replace(/\s/g, '')

	if (dice.match(/^\d+$/gi)) {
		dice = '1d' + dice
	}

	if (validateDiceString(dice)) {
		const diceArray = dice.split(/(?=[+-/*()[\]{}])|(?<=[+-/*()[\]{}])/gi)
		const operationsStack: string[] = []

		if (diceArray.length == 1) {
			if (diceArray[0].match(/(?<=[+-/*()[\]{}])|(?=[+-/*()[\]{}])/gi)) {
				return diceArray[0]
			} else {
				if (diceArray[0][0] == 'd' || diceArray[0][0] == 'D') {
					diceArray[0] = '1' + diceArray[0]
				}

				return { ...buildDiceObj(diceArray[0]), diceString: diceArray[0] }
			}
		} else {
			diceArray.forEach((dice, index) => {
				if (dice.match(/(?<=[+-/*()[\]{}])|(?=[+-/*()[\]{}])/gi)) {
					operationsStack.push(dice)
				} else {
					try {
						if (dice.match(/(?<!d)\d+$/gi)) {
							operationsStack.push(dice)
						} else {
							if (dice[0] == 'd' || dice[0] == 'D') {
								dice = '1' + dice
								diceArray[index] = dice
							}

							operationsStack.push(dice)
						}
					} catch (err) {
						throw err
					}
				}
			})

			function separateByPriority(expressionArray: string[]) {
				const stack: any = []
				let separatedOperations: any = []

				for (const token of expressionArray) {
					if (token === '(') {
						stack.push(separatedOperations)
						separatedOperations = []
					} else if (token === ')') {
						const lastSeparated = separatedOperations
						separatedOperations = stack.pop()
						separatedOperations.push(lastSeparated)
					} else {
						separatedOperations.push(token)
					}
				}

				return separatedOperations
			}

			const prioritizedOperations = separateByPriority(operationsStack)

			function resolveExpression(subExpression: any) {
				if (typeof subExpression === 'string') {
					if (subExpression.match(/(?<=[+-/*()[\]{}])|(?=[+-/*()[\]{}])/gi)) {
						return subExpression
					} else {
						if (!isNaN(Number(subExpression))) {
							return subExpression
						} else {
							if (subExpression[0] == 'd' || subExpression[0] == 'D') {
								subExpression = '1' + subExpression
							}

							return buildDiceObj(subExpression)
						}
					}
				} else {
					return subExpression.map(resolveExpression)
				}
			}

			const resolvedOperations = resolveExpression(prioritizedOperations)

			let finalOperations = deepClone(resolvedOperations)

			function calculateByPriority(finalOperations: any[]) {
				for (let i = 0; i < finalOperations.length; i++) {
					if (Array.isArray(finalOperations[i])) {
						calculateByPriority(finalOperations[i])
					}
				}

				for (let i = 0; i < finalOperations.length; i++) {
					if (Array.isArray(finalOperations[i])) {
						finalOperations[i] = calculateOperation(finalOperations[i])
					}
				}

				return finalOperations
			}

			finalOperations = calculateByPriority(finalOperations)

			const finalResult = calculateOperation(finalOperations)

			return {
				diceArray,
				resolvedDices: resolvedOperations,
				final: finalResult,
			}
		}
	} else {
		throw new Error('Invalid dice string')
	}
}

export { diceRoller, validateDiceString, formatDiceStringOutput }
