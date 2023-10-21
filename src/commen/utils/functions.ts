export const charCodeAtWord = (word: string): string => {
  return String(
    word
      .split('')
      .map((char) => char.charCodeAt(0))
      .reduce((current, previous) => previous + current),
  );
};
