import React, { useState, useEffect } from "react";
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

export default function CartFlyout(props: any) {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);

  const [animationParent] = useAutoAnimate();

  // Nuevo estado para manejar la renderización del lado del servidor
  const [isServer, setIsServer] = useState(true);

  useEffect(() => {
    setIsServer(false);
  }, []);

  // Si el carrito está abierto, deshabilita el scroll del body
  useEffect(() => {
    if ($isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [$isCartOpen]);

  // Carga los datos del carrito del almacenamiento local al montar el componente
  useEffect(() => {
    const initialCartItems = JSON.parse(
      localStorage.getItem(`cartItems-${props.userId}`) || "{}"
    );

    for (const key in initialCartItems) {
      cartItems.setKey(key, initialCartItems[key]);
    }
  }, []);

  // Guarda los datos del carrito en el almacenamiento local cuando se actualizan
  useEffect(() => {
    localStorage.setItem(`cartItems-${props.userId}`, JSON.stringify($cartItems));
  }, [$cartItems]);

  return (
    <>
      {$isCartOpen && (
        <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-10"></div>
      )}
      <aside
        className={`bg-[#2d007a]/80 fixed flex flex-col justify-between transition-all duration-500 ease-in-out gap-5 font-cabinetGroteskBold w-full md:w-[65%] lg:w-[55%] xl:w-[35%] h-full backdrop-blur-xl text-black top-0 right-0 z-10 ${
          $isCartOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        {/* Asegúrate de que el estado inicial del carrito sea el mismo en el servidor y en el cliente */}
        {!isServer && Object.values($cartItems).length ? (
          <>
            <header
              id="headerCart"
              className="bg-[#2d007a]/90 text-white w-full sticky top-0 left-0 h-[15vh] flex items-center justify-between px-6"
            >
              <h2 className="text-2xl xl:text-3xl">Tu carrito</h2>
              <button className="" onClick={() => isCartOpen.set(!$isCartOpen)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
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
              className="px-5 overflow-y-auto "
            >
              <ul ref={animationParent} className="flex flex-col justify-center items-center gap-5">
                {Object.values($cartItems).map((cartItem) => (
                  <li
                    className="bg-black/30 backdrop-blur-xl text-white flex flex-col justify-center items-center md:flex-row md:justify-center md:items-center gap-7 p-3 w-[90%] border-2 border-white rounded-md"
                    key={`${cartItem.id}-${cartItem.size}`}
                  >
                    <img
                      className="w-52"
                      style={{ aspectRatio: "243/179"}}
                      src={cartItem.imageSrc}
                      alt={cartItem.name}
                    />
                    <div className="flex flex-col gap-2 justify-center">
                      <h3 className="text-base">{cartItem.name}</h3>
                      <div className="flex justify-evenly items-center gap-2 border-2 py-1 border-white rounded-lg w-32">
                        <button
                          onClick={() =>
                            subtractItemQuantity(cartItem.id, cartItem.size)
                          }
                          className="text-2xl"
                        >
                          <svg
                            data-testid="geist-icon"
                            height="14"
                            strokeLinejoin="round"
                            viewBox="0 0 16 16"
                            width="14"
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
                        <p className="text-sm">{cartItem.quantity}</p>
                        <button
                          onClick={() =>
                            addItemQuantity(cartItem.id, cartItem.size)
                          }
                          className="text-3xl"
                        >
                          <svg
                            data-testid="geist-icon"
                            height="14"
                            strokeLinejoin="round"
                            viewBox="0 0 16 16"
                            width="14"
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
                      <p>Precio: {cartItem.price} €</p>
                      <button
                        className="flex items-center gap-2 text-red-500"
                        onClick={() =>
                          removeCartItem(cartItem.id, cartItem.size)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <footer
              id="headerCart"
              className="bg-[#2d007a]/90 text-white w-full sticky bottom-0 left-0 flex flex-col items-center justify-center px-5 p-5"
            >
              <a
                href="/checkout"
                className="text-base px-4 py-2 rounded-lg border-2 border-white w-full flex justify-between items-center transition-all duration-300 ease-in-out hover:text-[#2d007a]/90 hover:bg-white/90"
              >
                <span className="text-sm lg:text-base xl:text-lg font-cabinetGroteskBold">
                  CHECKOUT
                </span>
                <p className="text-sm lg:text-base xl:text-lg font-cabinetGroteskBold">
                  <span>TOTAL</span>
                  <span className="inline-block w-20 text-right">
                    {totalPrice()}.00 €
                  </span>
                </p>
              </a>
            </footer>
          </>
        ) : (
          <>
            <p className="text-2xl flex justify-center items-center h-full text-white">
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
                stroke="white"
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
