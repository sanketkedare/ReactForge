export const diwaliGifts: string[] = [
  "Sweets Box",
  "Dry Fruits Hamper",
  "Decorative Diyas",
  "Candles Set",
  "Silver Coin",
  "Gift Voucher",
  "Traditional Dress",
  "Lakshmi Ganesh Idols",
  "Chocolate Box",
  "Customized Greeting Card",
  "Home Decor Items",
  "Aromatic Incense Sticks",
  "Ethnic Jewelry",
  "Spiritual Book",
  "Personalized Photo Frame",
];

/**
 * useAssignGift helper
 * Randomly selects a gift from the predefined list of Diwali gifts.
 */
export const useAssignGift = (): string => {
  const number = Math.floor(Math.random() * diwaliGifts.length);
  return diwaliGifts[number];
};
