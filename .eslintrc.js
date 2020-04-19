module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "prettier",
    "prettier/vue",
    "plugin:prettier/recommended",
    "plugin:vue/essential",
  ],
  parserOptions: {
    parser: "babel-eslint",
  },
  // required to lint *.vue files
  plugins: ["prettier"],
  // add your custom rules here
  rules: {
    "object-shorthand": "off",
    "prettier/prettier": "error",
    camelcase: "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/name-property-casing": ["error", "kebab-case"],
    "no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
      },
    ],
    "vue/no-v-html": process.env.NODE_ENV === "production" ? "off" : "warn",
    "vue/require-component-is": "off",
  },
};
