import { useCaptchaStore } from "../../store/captchaStore";
import axiosClient from "../axiosClient";

export const fetchCaptcha = async () => {
  const sessionId = crypto.randomUUID();
  try {
    const response = await axiosClient.get(`/captcha/${sessionId}`, {
      responseType: "blob",
    });
    const blob = response.data;
    const url = URL.createObjectURL(blob);
    useCaptchaStore.getState().setCaptcha(sessionId, url);
  } catch (err) {
    console.error("Failed to fetch captcha:", err);
  }
};

export const resetCaptcha = () => {
  useCaptchaStore.getState().resetCaptcha();
};
