export const getCookie = (name: string) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name))
    ?.split("=")[1];
  return token;
};
