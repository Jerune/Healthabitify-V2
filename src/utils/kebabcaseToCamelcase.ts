import { capitalizeFirstLetterFromArray } from './capitalizeFirstLetter';

function kebabcaseToCamelcase(word: string) {
  const kebabcaseWord = word;
  const wordsArray = kebabcaseWord.split('-');
  const wordsWithCapital = capitalizeFirstLetterFromArray(wordsArray)
    .split(' ')
    .join('');

  return wordsWithCapital;
}

export default kebabcaseToCamelcase;
