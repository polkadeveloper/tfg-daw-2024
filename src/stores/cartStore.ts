import { atom, map } from "nanostores";
import { getSizesInfo } from "@/services/sizesInfo";

export const isCartOpen = atom(false);

export type CartItem = {
  id: string;
  name: string;
  imageSrc: string;
  size: string;
  price: number;
  quantity: number;
};

export const cartItems = map<Record<string, CartItem>>({});

export async function addCartItem({ id, name, imageSrc, size, price }) {
  const arrayTallasPorItemId = await getSizesInfo();
  const itemSizeStockQuantity =
    arrayTallasPorItemId[Number(id) - 1].tallas.find(
      (talla) => talla.sizeName === size,
    ).stockQuantity;
  const key = `${id}-${size}`; // usa una combinación de id y size como clave
  const existingEntry = cartItems.get()[key];
  if (existingEntry) {
    if (existingEntry.quantity >= itemSizeStockQuantity) {
      console.warn(
        `No se puede añadir más de ${itemSizeStockQuantity} unidades del artículo con id ${id} y size ${size}.`,
      );
      return;
    }
    cartItems.setKey(key, {
      ...existingEntry,
      quantity: existingEntry.quantity + 1,
    });
  } else {
    cartItems.setKey(key, {
      id,
      name,
      imageSrc,
      size,
      price,
      quantity: 1,
    });
  }
}
export function removeCartItem(id: string, size: string) {
  const key = `${id}-${size}`; // usa una combinación de id y size como clave
  const existingCartItems = cartItems.get();
  if (existingCartItems[key]) {
    const updatedCartItems = { ...existingCartItems };
    delete updatedCartItems[key];
    cartItems.set(updatedCartItems);
  } else {
    console.warn(
      `No se encontró el artículo con id ${id} y size ${size} en el carrito.`,
    );
  }
}

export async function addItemQuantity(id: string, size: string) {
  const arrayTallasPorItemId = await getSizesInfo();
  const itemSizeStockQuantity =
    arrayTallasPorItemId[Number(id) - 1].tallas.find(
      (talla) => talla.sizeName === size,
    ).stockQuantity;
  const key = `${id}-${size}`; // usa una combinación de id y size como clave
  const existingEntry = cartItems.get()[key];
  if (existingEntry && existingEntry.quantity < itemSizeStockQuantity) {
    cartItems.setKey(key, {
      ...existingEntry,
      quantity: existingEntry.quantity + 1,
    });
  } else {
    console.warn(
      `No se encontró el artículo con id ${id} y size ${size} en el carrito o la cantidad máxima ya se ha alcanzado.`,
    );
  }
}

export async function subtractItemQuantity(id: string, size: string) {
  const arrayTallasPorItemId = await getSizesInfo();
  const key = `${id}-${size}`; // usa una combinación de id y size como clave
  const existingEntry = cartItems.get()[key];
  if (existingEntry) {
    if (existingEntry.quantity === 1) {
      removeCartItem(id, size);
    } else {
      cartItems.setKey(key, {
        ...existingEntry,
        quantity: existingEntry.quantity - 1,
      });
    }
  } else {
    console.warn(
      `No se encontró el artículo con id ${id} y size ${size} en el carrito.`,
    );
  }
}

export function totalPrice() {
  return Object.values(cartItems.get()).reduce(
    (total, { price, quantity }) => total + price * quantity,
    0,
  );
}
