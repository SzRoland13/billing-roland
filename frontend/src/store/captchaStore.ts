import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CaptchaState {
  sessionId: string | null;
  imageUrl: string | null;
  captchaInput: string;
  setCaptchaInput: (value: string) => void;
  setCaptcha: (sessionId: string, imageUrl: string) => void;
  resetCaptcha: () => void;
}

export const useCaptchaStore = create(
  immer<CaptchaState>((set) => ({
    sessionId: null,
    imageUrl: null,
    captchaInput: "",

    setCaptchaInput: (value) =>
      set((state) => {
        state.captchaInput = value;
      }),

    setCaptcha: (sessionId, imageUrl) =>
      set((state) => {
        state.sessionId = sessionId;
        state.imageUrl = imageUrl;
        state.captchaInput = "";
      }),

    resetCaptcha: () =>
      set((state) => {
        state.sessionId = null;
        state.imageUrl = null;
        state.captchaInput = "";
      }),
  }))
);
