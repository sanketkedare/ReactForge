export const generateId = (): string => {
  let pass = "";
  const str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()1234567890";

  for (let i = 0; i < 16; i++) {
    const random = Math.floor(Math.random() * str.length);
    const char = str[random];
    pass += char;
  }

  return pass;
};

export const useGenrateId = generateId;
export default generateId;
