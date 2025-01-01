export const checkToAuth = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return false;
  }

  return true;
};
