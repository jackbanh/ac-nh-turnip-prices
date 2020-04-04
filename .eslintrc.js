module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "globals": {
    "fetch": true,
    "FormData": true,
    "localStorage": true,
    "sessionStorage": true,
    "window": true
  },
  "rules": {
    "arrow-parens": [
      "error",
      "as-needed"
    ],
    "class-methods-use-this": 1,
    "max-len": 1,
    "no-unused-vars": 1,
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [
          ".js",
          ".jsx"
        ]
      }
    ],
    "react/prefer-stateless-function": [
      1,
      {
        "ignorePureComponents": true
      }
    ],
    "react/prop-types": 1,
    "jsx-a11y/label-has-for": [
      1,
      {
        "required": "id"
      }
    ],
    "jsx-a11y/label-has-associated-control": [
      1,
      {
        "assert": "htmlFor"
      }
    ],
    "react/destructuring-assignment": 1,
    "react/jsx-one-expression-per-line": 1,
    "react/no-unused-state": 1,
    "react/jsx-props-no-spreading": 0,
    "react/jsx-fragments": 1,
    "react/jsx-wrap-multilines": 1,
    "react/static-property-placement": 1,
    "no-mixed-operators": 1,
    "react/jsx-curly-newline": 1,
    "object-curly-newline": 1,
  }
};
