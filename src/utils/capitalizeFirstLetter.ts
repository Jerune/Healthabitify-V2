function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function capitalizeFirstLetterFromArray(words: string[]): string {
  const capitalizedWords = words
    .map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

  return capitalizedWords;
}

export { capitalizeFirstLetter, capitalizeFirstLetterFromArray };
