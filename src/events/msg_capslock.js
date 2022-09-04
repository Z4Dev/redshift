export const hasTextCapslockAbuse = async (str) => {
    const words = str.replace(/<a?:(\w+):\d+>/g, '').match(/[A-Z]+/gi)
	if (!words) return false;

	const upperLetters = str.replace(/<a?:(\w+):\d+>/g, '').match(/[A-Z]/g) || []
	const lowerLetters = str.replace(/<a?:(\w+):\d+>/g, '').match(/[a-z]/g) || []
	
	const upper = upperLetters.length
	const lower = lowerLetters.length

	const upperWords =  words.filter(word => word.length > 1 && word.length / 2 < (word.replace(/<a?:(\w+):\d+>/g, '').match(/[A-Z]/g) || []).length)
	const lowerWords =  words.filter(word => word.length > 1 && word.length / 2 < (word.replace(/<a?:(\w+):\d+>/g, '').match(/[a-z]/g) || []).length)
	
	const upperWordsCount = upperWords.length
	const lowerWordsCount = lowerWords.length
	
	return upperWordsCount > 0 && (upperWordsCount > lowerWordsCount && upper > lower) || upper > lower
}