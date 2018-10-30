module.exports = {
  "plugins": [],
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "mocha": true,
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  },
  "rules": {
    "semi": [
      "error",
      "always"
    ],
    "no-var": [
      "warn",
    ],
    "prefer-const": ["error", {
      "destructuring": "any",
      "ignoreReadBeforeAssign": false
    }],
    "curly": ["error"],
    "eqeqeq": ["error"],
    "no-multi-spaces": ["error"],
    "no-lone-blocks": ["error"],
    "no-self-compare": ["error"],
    "no-unused-expressions": ["error"],
    "no-unused-vars": ["off"],
    "no-useless-call": ["error"],
    "no-use-before-define": ["off"],

    "camelcase": ["error", {properties: "never"}],
    "func-call-spacing": ["error"],
    "no-lonely-if": ["error"],
    "array-bracket-spacing": ["error"],

    "no-console": ["off"],
  }
};
