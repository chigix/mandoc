const { defaults } = require("jest-config");

module.exports = {
    "verbose": true,
    "roots": [
        "<rootDir>/test"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "testRegex": "((\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleNameMapper": {
        "mandoc/(.*)": "<rootDir>/src/$1",
        "mandoc-test/(.*)": "<rootDir>/test/$1"
    },
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ]
};