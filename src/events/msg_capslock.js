export const hasTextCapslockAbuse = (str) => {
    const words = str.match(/[A-Z]+/gi)
	if (!words) return false;

	const upperLetters = str.match(/[A-Z]/g) || []
	const lowerLetters = str.match(/[a-z]/g) || []
	
	const upper = upperLetters.length
	const lower = lowerLetters.length

	const upperWords =  words.filter(word => word.length > 1 && word.length / 2 < (word.match(/[A-Z]/g) || []).length)
	const lowerWords =  words.filter(word => word.length > 1 && word.length / 2 < (word.match(/[a-z]/g) || []).length)

	const upperWordsCount = upperWords.length
	const lowerWordsCount = lowerWords.length
	
	return upperWordsCount > 0 && upperWordsCount > lowerWordsCount && upper > lower
}