export const slugifyText = (text: string): string => {
  let slugifiedText = text.normalize('NFD')
    .split('')
    .filter(
      character => {
        const characterCode = character.charCodeAt(0)

        return characterCode === ' '.charCodeAt(0) ||
        characterCode === ','.charCodeAt(0) ||
        characterCode === '-'.charCodeAt(0) ||
        characterCode === '.'.charCodeAt(0) ||
        characterCode === '_'.charCodeAt(0) ||
        (characterCode >= '0'.charCodeAt(0) && characterCode <= '9'.charCodeAt(0)) ||
        (characterCode >= 'A'.charCodeAt(0) && characterCode <= 'Z'.charCodeAt(0)) ||
        (characterCode >= 'a'.charCodeAt(0) && characterCode <= 'z'.charCodeAt(0))
      }
    )
    .join('')
    .split(' ')
    .join('-')
    .split(',')
    .join('.')
    .toLowerCase()

  const noExtremitiesCharacters = [' ', ',', '-', '.', '_']

  while (noExtremitiesCharacters.some(character => slugifiedText.startsWith(character)))
    slugifiedText = slugifiedText.slice(1)

  while (noExtremitiesCharacters.some(character => slugifiedText.endsWith(character)))
    slugifiedText = slugifiedText.slice(0, -1)

  return slugifiedText
}
