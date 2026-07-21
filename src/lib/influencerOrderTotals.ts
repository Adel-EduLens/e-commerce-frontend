type OrderItem = {
  price: number;
  quantity: number;
};

export const formatEgp = (amount: number, sign = "") =>
  `${sign}${amount.toFixed(2)} EGP`;

export const getItemsSubtotal = (items: OrderItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const getOriginalOrderTotal = (
  items: OrderItem[],
  orderTotal = 0,
  discountAmount = 0,
) => {
  const itemsSubtotal = getItemsSubtotal(items);
  if (itemsSubtotal > 0) return itemsSubtotal;

  return orderTotal + discountAmount;
};

export const getItemDiscount = (
  item: OrderItem,
  items: OrderItem[],
  discountAmount: number,
) => {
  const itemsSubtotal = getItemsSubtotal(items);
  if (itemsSubtotal <= 0 || discountAmount <= 0) return 0;

  return ((item.price * item.quantity) / itemsSubtotal) * discountAmount;
};

export const getItemTotalAfterDiscount = (
  item: OrderItem,
  items: OrderItem[],
  discountAmount: number,
) => Math.max(0, item.price * item.quantity - getItemDiscount(item, items, discountAmount));
