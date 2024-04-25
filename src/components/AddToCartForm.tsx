import React, { useState, useEffect } from "react";
import { addCartItem, isCartOpen } from "@/stores/cartStore";
import { arrayTallasPorItemId } from "@/services/sizesInfo";

export default function AddToCartForm({ children, itemInfo }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  function addToCart(e) {
    e.preventDefault();
    if (!selectedSize) {
      setIsModalOpen(true);
      return;
    }
    isCartOpen.set(true);
    
    addCartItem({ ...itemInfo, size: selectedSize });
  }

  const tallas = arrayTallasPorItemId[itemInfo.id - 1]?.tallas;
  const productoAgotado = arrayTallasPorItemId[itemInfo.id - 1].tallas.every(
    (talla) => talla.outOfStock === 1
  );

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
          {tallas.map((talla, index) => (
            <option
              key={index}
              value={talla.sizeName}
              disabled={talla.stockQuantity <= 5}
            >
              {talla.sizeName} {talla.stockQuantity <= 5 ? "(Agotado)" : ""}
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
          <div className="absolute flex flex-col gap-3 justify-center items-center bg-white text-black font-cabinetGroteskBold p-2 inset-0 m-auto z-10 max-w-[250px] md:max-w-lg h-[300px] rounded-lg">
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
            <p className="text-2xl text-pretty ">
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
    </>
  );
}
