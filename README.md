# IBAN Validator

IBAN Validator, follows the algorithm described at [Validating the IBAN](https://en.wikipedia.org/wiki/International_Bank_Account_Number). Only checks if the passed IBAN is valid.

## Install

Install using [npm](https://www.npmjs.com/):

```sh
npm install iban-validator-js
```

## Basic Usage

```js
const IBANValidator = require('iban-validator-js');
IBANValidator.isValid(''); // false
IBANValidator.isValid('not-a-valid-IBAN'); // false
IBANValidator.isValid('TR320010009999901234567890'); // true
IBANValidator.isValid('BE68539007547034'); // true
```
