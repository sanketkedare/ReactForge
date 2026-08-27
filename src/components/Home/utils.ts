export const headerMotion = {
  initial: { opacity: 0.5, y: -200 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay: 0 },
};

export const themeMotion = {
  initial: { opacity: 0.5, y: -200 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay: 0.5 },
};

export const iconMotion = {
  animate: { rotate: 360 },
  transition: { duration: 10, repeat: Infinity, ease: "linear" as const },
};

export const introMotion = {
  initial: { opacity: 0, y: -500 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 1 },
};
