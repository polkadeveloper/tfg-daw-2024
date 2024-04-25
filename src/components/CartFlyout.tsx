import React, { useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
  isCartOpen,
  cartItems,
  removeCartItem,
  addItemQuantity,
  subtractItemQuantity,
  totalPrice,
} from "@/stores/cartStore";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);

  const [animationParent] = useAutoAnimate();

  useEffect(() => {
    if ($isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [$isCartOpen]);

  return (
    <>
      {$isCartOpen && (
        <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-10"></div>
      )}
      <aside
        className={`fixed flex flex-col justify-between transition-all duration-500 ease-in-out gap-5 font-cabinetGroteskBold w-full md:w-[35%] h-full backdrop-blur-xl bg-white/90 text-black top-0 right-0 z-10 ${
          $isCartOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        {Object.values($cartItems).length ? (
          <>
            <header
              id="headerCart"
              className="w-full sticky top-0 left-0 h-[15vh] bg-transparent flex items-center justify-between px-10"
            >
              <h2 className="text-3xl">Tu carrito</h2>
              <button className="" onClick={() => isCartOpen.set(!$isCartOpen)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-x"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M18 6l-12 12" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div
              style={{
                scrollbarWidth: "none",
                scrollbarColor: "#212121 white",
              }}
              className="px-5 overflow-y-auto"
            >
              <ul ref={animationParent} className="w-full flex flex-col gap-5">
                {Object.values($cartItems).map((cartItem) => (
                  <li
                    className="flex justify-around items-center gap-7 p-5 w-full border-2 border-black rounded-md"
                    key={`${cartItem.id}-${cartItem.size}`}
                  >
                    <img
                      className="w-56"
                      src={cartItem.imageSrc}
                      alt={cartItem.name}
                    />
                    <div className="flex flex-col gap-2 justify-center">
                      <h3>{cartItem.name}</h3>
                      <div className="flex justify-evenly items-center gap-2 border-2 py-1 border-black rounded-lg w-32">
                        <button
                          onClick={() =>
                            subtractItemQuantity(cartItem.id, cartItem.size)
                          }
                          className="text-3xl"
                        >
                          <svg
                            data-testid="geist-icon"
                            height="16"
                            strokeLinejoin="round"
                            viewBox="0 0 16 16"
                            width="16"
                            style={{ color: "currentcolor" }}
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M2 7.25H2.75H13.25H14V8.75H13.25H2.75H2V7.25Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </button>
                        <p>{cartItem.quantity}</p>
                        <button
                          onClick={() =>
                            addItemQuantity(cartItem.id, cartItem.size)
                          }
                          className="text-3xl"
                        >
                          <svg
                            data-testid="geist-icon"
                            height="16"
                            strokeLinejoin="round"
                            viewBox="0 0 16 16"
                            width="16"
                            style={{ color: "currentcolor" }}
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.75 1.75V1H7.25V1.75V6.75H2.25H1.5V8.25H2.25H7.25V13.25V14H8.75V13.25V8.25H13.75H14.5V6.75H13.75H8.75V1.75Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <p>Talla: {cartItem.size}</p>
                      <p>Precio: {cartItem.price * cartItem.quantity}.00 €</p>
                      <button
                        className="flex items-center gap-2 "
                        onClick={() =>
                          removeCartItem(cartItem.id, cartItem.size)
                        }
                      >
                        Eliminar
                        <svg
                          data-testid="geist-icon"
                          height="16"
                          strokeLinejoin="round"
                          viewBox="0 0 16 16"
                          width="16"
                          style={{ color: "red" }}
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.75 2.75C6.75 2.05964 7.30964 1.5 8 1.5C8.69036 1.5 9.25 2.05964 9.25 2.75V3H6.75V2.75ZM5.25 3V2.75C5.25 1.23122 6.48122 0 8 0C9.51878 0 10.75 1.23122 10.75 2.75V3H12.9201H14.25H15V4.5H14.25H13.8846L13.1776 13.6917C13.0774 14.9942 11.9913 16 10.6849 16H5.31508C4.00874 16 2.92263 14.9942 2.82244 13.6917L2.11538 4.5H1.75H1V3H1.75H3.07988H5.25ZM4.31802 13.5767L3.61982 4.5H12.3802L11.682 13.5767C11.6419 14.0977 11.2075 14.5 10.6849 14.5H5.31508C4.79254 14.5 4.3581 14.0977 4.31802 13.5767Z"
                            fill="red"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <footer
              id="headerCart"
              className="w-full sticky bottom-0 left-0 h-[15vh] bg-transparent flex items-center justify-between px-10"
            >
              <h3 className="text-2xl">TOTAL:</h3>
              <p className="text-xl">{totalPrice()}.00 €</p>
            </footer>
          </>
        ) : (
          <>
            <p className="text-2xl flex justify-center items-center h-full">
              ¡Tu carrito está vacío!
            </p>
            <button
              className="absolute top-3 right-3"
              onClick={() => isCartOpen.set(!$isCartOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-x"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </>
        )}
      </aside>
    </>
  );
}
