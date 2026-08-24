const path = require("node:path");

module.exports = {
  plugins: {
    "@stylexswc/postcss-plugin": {
      include: [
        "app/**/*.{js,jsx,ts,tsx}",
        "components/**/*.{js,jsx,ts,tsx}",
        "lib/**/*.{js,jsx,ts,tsx}",
        "hooks/**/*.{js,jsx,ts,tsx}",
      ],
      rsOptions: {
        aliases: {
          "@/*": [path.join(__dirname, "*")],
        },
        unstable_moduleResolution: {
          type: "commonJS",
        },
        dev: process.env.NODE_ENV === "development",
      },
    },
    autoprefixer: {},
  },
};
