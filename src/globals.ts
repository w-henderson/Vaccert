export const colours = {
  lightest: "#ffffff",
  light: "#f0f4f5",
  dark: "#231f20",
  accent: "#005ebb",
  accentLight: "#156cc1"
};

export const nhs = require("../assets/nhs.png");

export const dateFormat = (date: Date) => date.getDate().toString().padStart(2, "0") + "/"
  + (date.getMonth() + 1).toString().padStart(2, "0") + "/"
  + date.getFullYear().toString();