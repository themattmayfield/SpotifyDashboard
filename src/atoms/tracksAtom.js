import { atom } from "recoil";

export const tracksState = atom({
  key: "tracksState",
  default: {
    long: null,
    medium: null,
    short: null,
  },
});
