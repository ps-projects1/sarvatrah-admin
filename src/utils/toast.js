import toast from "react-hot-toast";

export const showSuccessToast = (message) => {
  toast.success(message, {
    style: {
      background: "#4caf50",
      color: "#fff",
    },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    style: {
      background: "#f44336",
      color: "#fff",
    },
  });
};

export const showLoadingToast = (message) => {
  return toast.loading(message, {
    style: {
      background: "#2196f3",
      color: "#fff",
    },
  });
};

export const updateToast = (id, type, message) => {
  toast.dismiss(id);
  if (type === "success") {
    showSuccessToast(message);
  } else if (type === "error") {
    showErrorToast(message);
  }
};
