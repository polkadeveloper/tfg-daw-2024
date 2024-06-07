import React, { useState, useEffect } from "react";
import { addCartItem, isCartOpen } from "@/stores/cartStore";
import { arrayTallasPorItemId } from "@/services/sizesInfo";

export default function AddToCartForm({
  children,
  user,
  sessionGoogle,
  tallas2,
  itemInfo,
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUserOpen, setIsModalUserOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalUserOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalUserOpen]);

  function addToCart(e) {
    e.preventDefault();
    if (!selectedSize) {
      setIsModalOpen(true);
      return;
    }

    if (!isModalUserOpen && !user && !sessionGoogle) {
      setIsModalUserOpen(true);
      return;
    }

    isCartOpen.set(true);

    addCartItem({ ...itemInfo, size: selectedSize });
  }

  const tallas = arrayTallasPorItemId[itemInfo.id - 1]?.tallas;
  const productoAgotado = tallas2.every((talla) => talla.outOfStock === 1);

  return (
    <>
      <div
        id="btn-Tallas"
        className="flex justify-center items-center gap-5 text-xs"
      >
        <select
          className="bg-gray-200 hover:bg-gray-300 text-xs cursor-pointer text-black py-1 px-1 border-2 border-black rounded-lg"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          <option value="" disabled>
            Selecciona una talla
          </option>
          {tallas2.map((talla, index) => (
            <option
              key={index}
              value={talla.sizeName}
              disabled={talla.stockQuantity <= 0}
            >
              {talla.sizeName} {talla.stockQuantity <= 0 ? "(Agotado)" : ""}
            </option>
          ))}
        </select>
        {productoAgotado && (
          <p className="text-red-500 text-lg font-cabinetGroteskBold">
            Producto agotado
          </p>
        )}
      </div>
      <p className="max-w-sm lg:max-w-xl xl:max-w-2xl">
        {itemInfo.description}
      </p>
      {/* <!-- Lista de características del producto --> */}
      <ul className="text-base">
        <li>100% cotton</li>
        <li>Standard fit</li>
        <li>High quality digital print</li>
      </ul>
      <form onSubmit={addToCart}>{children}</form>
      {/* <!-- Sección Botones Tallas --> */}
      <div
        id="btn-Tallas"
        className="flex justify-center items-center gap-5 text-xs"
      ></div>
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-10"></div>
          <div className="absolute flex flex-col gap-3 justify-center items-center bg-white text-black font-cabinetGroteskBold p-2 inset-0 m-auto z-10 max-w-[280px] md:max-w-lg h-[330px] rounded-lg">
            <div>
              <svg
                data-testid="geist-icon"
                height="64"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="64"
                style={{ color: "currentcolor" }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.55846 0.5C9.13413 0.5 9.65902 0.829456 9.90929 1.34788L15.8073 13.5653C16.1279 14.2293 15.6441 15 14.9068 15H1.09316C0.355835 15 -0.127943 14.2293 0.192608 13.5653L6.09065 1.34787C6.34092 0.829454 6.86581 0.5 7.44148 0.5H8.55846ZM8.74997 4.75V5.5V8V8.75H7.24997V8V5.5V4.75H8.74997ZM7.99997 12C8.55226 12 8.99997 11.5523 8.99997 11C8.99997 10.4477 8.55226 10 7.99997 10C7.44769 10 6.99997 10.4477 6.99997 11C6.99997 11.5523 7.44769 12 7.99997 12Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <p className="text-2xl text-pretty text-center">
              Selecciona una talla antes de añadir al carrito
            </p>
            <p className="text-lg font-cabinetGroteskRegular text-pretty text-center px-2">
              Antes de añadir un producto a tu carrito necesitamos saber que
              talla deseas.
            </p>
            <button
              className="px-4 py-2 text-lg bg-indigo-700 hover:bg-indigo-500 text-white rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Entendido
            </button>
          </div>
        </>
      )}
      {isModalUserOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-10"></div>
          <div className="absolute flex flex-col gap-3 justify-center items-center bg-white text-black font-cabinetGroteskBold p-2 inset-0 m-auto z-10 max-w-[280px] md:max-w-lg h-[330px] rounded-lg">
            <button
              onClick={() => setIsModalUserOpen(false)}
              className="absolute top-2 right-2"
            >
              <svg
                data-testid="geist-icon"
                height="24"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="24"
                style={{ color: "currentcolor" }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.96966 11.0303L10.5 11.5607L11.5607 10.5L11.0303 9.96966L9.06065 7.99999L11.0303 6.03032L11.5607 5.49999L10.5 4.43933L9.96966 4.96966L7.99999 6.93933L6.03032 4.96966L5.49999 4.43933L4.43933 5.49999L4.96966 6.03032L6.93933 7.99999L4.96966 9.96966L4.43933 10.5L5.49999 11.5607L6.03032 11.0303L7.99999 9.06065L9.96966 11.0303Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>
            <div>
              <svg
                data-testid="geist-icon"
                height="64"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                width="64"
                style={{ color: "currentcolor" }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.75 0C3.95507 0 2.5 1.45507 2.5 3.25V3.75C2.5 5.54493 3.95507 7 5.75 7H6.25C8.04493 7 9.5 5.54493 9.5 3.75V3.25C9.5 1.45507 8.04493 0 6.25 0H5.75ZM4 3.25C4 2.2835 4.7835 1.5 5.75 1.5H6.25C7.2165 1.5 8 2.2835 8 3.25V3.75C8 4.7165 7.2165 5.5 6.25 5.5H5.75C4.7835 5.5 4 4.7165 4 3.75V3.25ZM15.2803 6.28033L15.8107 5.75L14.75 4.68934L14.2197 5.21967L13.375 6.06434L12.5303 5.21967L12 4.68934L10.9393 5.75L11.4697 6.28033L12.3143 7.125L11.4697 7.96967L10.9393 8.5L12 9.56066L12.5303 9.03033L13.375 8.18566L14.2197 9.03033L14.75 9.56066L15.8107 8.5L15.2803 7.96967L14.4357 7.125L15.2803 6.28033ZM1.5 13.1709V14.5H10.5V13.1709C9.68042 11.5377 8.00692 10.5 6.17055 10.5H5.82945C3.99308 10.5 2.31958 11.5377 1.5 13.1709ZM0.0690305 12.6857C1.10604 10.4388 3.35483 9 5.82945 9H6.17055C8.64517 9 10.894 10.4388 11.931 12.6857L12 12.8353V13V15.25V16H11.25H0.75H0V15.25V13V12.8353L0.0690305 12.6857Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <p className="text-2xl text-pretty ">
              Debes iniciar sesión para añadir al carrito
            </p>
            <p className="text-lg font-cabinetGroteskRegular text-pretty text-center px-2">
              Antes de añadir un producto a tu carrito necesitamos que inicies
              sesión.
            </p>
            <button
              className="px-4 py-2 text-lg bg-indigo-700 hover:bg-indigo-500 text-white rounded-lg"
              onClick={() => (window.location.href = "/login")}
            >
              Iniciar sesión
            </button>
          </div>
        </>
      )}
    </>
  );
}
