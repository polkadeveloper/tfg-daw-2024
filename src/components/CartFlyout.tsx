import { useStore } from "@nanostores/react";
import { isCartOpen, cartItems } from "@/stores/cartStore";

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);

  return $isCartOpen ? (
    <aside className="fixed flex flex-col font-cabinetGroteskBold items-center px-10 py-5 w-full md:w-[35%] h-full bg-white text-black top-0 right-0 z-10">
      {Object.values($cartItems).length ? (
        <ul className="w-full border-2 border-black rounded-md">
          {Object.values($cartItems).map((cartItem) => (
            <li
              className="flex justify-around items-center p-2 w-full"
              key={cartItem.id}
            >
              <img
                className="w-56"
                src={cartItem.imageSrc}
                alt={cartItem.name}
              />
              <div className="flex flex-col justify-center">
                <h3>{cartItem.name}</h3>
                <div className="flex justify-evenly items-center gap-2 border-2 border-black rounded-lg w-32">
                  <button className="text-3xl">+</button>
                  <p>{cartItem.quantity}</p>
                  <button className="text-3xl">-</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-2xl flex justify-center items-center h-full">
          ¡Tu carrito está vacío!
        </p>
      )}
    </aside>
  ) : null;
}
