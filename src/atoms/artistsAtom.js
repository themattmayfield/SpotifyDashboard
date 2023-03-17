import { atom } from "recoil";

export const artistsState = atom({
  key: "artistsState",
  default: {
    long: null,
    medium: null,
    short: null,
  },
});
