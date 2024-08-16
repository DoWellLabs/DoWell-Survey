// toastHelper.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
let isToastShowing = false;

export const showToast = (message) => {
  if (!isToastShowing) {
    isToastShowing = true;
    toast.info(message, {
      onClose: () => {
        isToastShowing = false;
      },
    });
  }
};
