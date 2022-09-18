const { countryLengths } = require('./constants');

function isValid(input) {
  if (typeof input !== 'string') {
    return false;
  }
  const iban = input.toUpperCase();
  const countryCode = iban.slice(0, 2);
  if (!Object.keys(countryLengths).includes(countryCode)) {
    return false;
  }
  if (countryLengths[countryCode] !== iban.length) {
    return false;
  }

  const ibanMovedInitials = `${iban.slice(4)}${iban.slice(0, 4)}`;
  const lettersRegex = /[A-Z]/g;
  const onlyDigits = ibanMovedInitials.replace(lettersRegex, (match) =>
    letterToTwoDigits(match)
  );
  return mod97(onlyDigits) === 1;
}

function mod97(numStr) {
  if (typeof numStr !== 'string') {
    throw new Error('`numStr` parameter must be a string.');
  }
  let checksum = numStr.slice(0, 2);
  let fragment = '';
  for (let offset = 2; offset < numStr.length; offset += 7) {
    fragment = checksum + numStr.substring(offset, offset + 7);
    checksum = parseInt(fragment, 10) % 97;
  }
  return checksum;
}

function letterToTwoDigits(letter) {
  if (typeof letter !== 'string') {
    throw new Error('`letter` parameter must be a string.');
  }
  return letter.charCodeAt(0) - 55;
}

module.exports = {
  isValid,
};
