function levenshteinDistance(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    if (!str1.length || !str2.length) return 0;

    const matrix = Array(str2.length + 1)
        .fill(null)
        .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + substitutionCost
            );
        }
    }

    const distance = matrix[str2.length][str1.length];
    return 1 - distance / Math.max(str1.length, str2.length);
}

function stringSimilarity(str1: string, str2: string): number {
    str1 = str1.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str2 = str2.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const distance = levenshteinDistance(str1, str2);
    return distance;
}

function similaritySearch(
    searchString: string,
    items: string[]
): { bestMatch: { value: string; similarity: number }; allMatches: { value: string; similarity: number }[] } {
    const search = {
        bestMatch: { value: '', similarity: 0 },
        allMatches: Array<{ value: string; similarity: number }>()
    };

    for (let item of items) {
        search.allMatches.push({ value: item, similarity: stringSimilarity(searchString, `${item}`) });
    }

    search.allMatches.sort((a, b) => b.similarity - a.similarity);

    search.bestMatch = search.allMatches[0];
    return search;
}

export default stringSimilarity;
export { stringSimilarity, levenshteinDistance, similaritySearch };
