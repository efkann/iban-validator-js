const IBANValidator = require('./index');

test('IBAN isValid AL', () => {
  expect(IBANValidator.isValid('AL35202111090000000001234567')).toBe(true);
});

test('IBAN isValid KW', () => {
  expect(IBANValidator.isValid('KW81CBKU0000000000001234560101')).toBe(true);
});

test('IBAN isValid (empty string)', () => {
  expect(IBANValidator.isValid('')).toBe(false);
});

test('IBAN isValid (too long)', () => {
  expect(IBANValidator.isValid('SD8811123456789012144')).toBe(false);
});

test('IBAN isValid TR', () => {
  expect(IBANValidator.isValid('TR320010009999901234567890')).toBe(true);
});

test('IBAN isValid BE', () => {
  expect(IBANValidator.isValid('BE68539007547034')).toBe(true);
});
