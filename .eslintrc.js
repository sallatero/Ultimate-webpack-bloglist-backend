module.exports = {
    "env": {
        "jest": true,
        "es6": true,
        "node": true
    },
    "settings": {
      "react": {
        "createClass": "createReactClass",
        "pragma": "React",
        "version": "detect",
        "flowVersion": "0.53"
      },
      "propWrapperFunctions": [
        "forbidExtraProps",
        {"property": "freeze", "object": "Object"},
        {"property": "myFavoriteWrapper"}
      ],
      "linkComponents": [
        "Hyperlink",
        {"name": "Link", "linkAttribute": "to"}
      ]
    },
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended"
    ],
    "parser": "babel-eslint",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "experimentalObjectRestSpread": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
      "eqeqeq": "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": [
        "error", "always"
      ],
      "arrow-spacing": [
        "error", { "before": true, "after": true }
      ],
      "indent": [
        "error", 2
      ],
      "linebreak-style": [
        "error", "unix"
      ],
      "quotes": [
        "error", "single"
      ],
      "semi": [
        "error", "never"
      ],
      "no-console": 0,
      "react/prop-types": 0
    }
};