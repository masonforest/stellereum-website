module.exports = {
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module",
    "ecmaFeatures": {
      "blockBindings": true,
      "jsx": true,
      "experimentalObjectRestSpread": true,
    }
  },
  "parser": "babel-eslint",
  "plugins": [
        "react"
    ],
  "rules": {
    "indent": [2, 2],
    "react/jsx-indent": [2, 2],
  }
};
