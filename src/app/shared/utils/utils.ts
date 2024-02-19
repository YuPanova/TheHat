export function mergeArrays<T>(arr1:T[], arr2:T[]): { name: T, teamIndex: number }[] {
  const result: { name: T, teamIndex: number }[] = [];

  arr1.forEach((el, index) => {
    result.push({name: el, teamIndex: 0});
    if (arr2[index] !== undefined) {
      result.push({name: arr2[index], teamIndex: 1});
    }
  });

  if (arr2.length > arr1.length) {
    arr2.slice(arr1.length).map( el => (result.push({ name: el, teamIndex: 1 })));
  }

  return result;
}

export function shuffleArray(array: any[]): any[] {
  const shuffledArray = array.slice();

  // Fisher-Eits algorithm
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}
