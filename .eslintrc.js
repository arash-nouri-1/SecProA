module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "curly": [
            "error",
            "all"
        ],
        "eqeqeq": [
            "error",
            "smart"
        ],
        "arrow-spacing": [
            "error",
            {
                "before": true,
                "after": true
            }
        ],
        "eol-last": [
            "error",
            "always"
        ],
        "no-multiple-empty-lines": [
            "error"
        ],
        "no-trailing-spaces": [
            "error"
        ],
        "require-jsdoc": [
            "error",
            {
                "require": {
                    "FunctionDeclaration": true,
                    "MethodDefinition": false,
                    "ClassDeclaration": false,
                    "ArrowFunctionExpression": false,
                    "FunctionExpression": false
                }
            }
        ],
        "camelcase": [
            "error"
        ],
        "prefer-const": [
            "error"
        ],
        "yoda": [
            "error"
        ],
        "max-len": [
            "error",
            {
                "code": 120,
                "ignoreComments": true
            }
        ],
        "no-tabs": [
            "error"
        ]
    }
};
