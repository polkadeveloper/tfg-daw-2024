import { useStore } from "@nanostores/react";
import { isCartOpen } from "@/stores/cartStore";

export default function CartButton() {
  // lee el valor del store con el hook `useStore`
  const $isCartOpen = useStore(isCartOpen);
  // escribe en el store importado usando `.set`
  return (
    <button
      className="flex justify-center items-center w-full bg-white text-black px-4 py-2 gap-2 transition-all duration-300 ease-in-out hover:bg-indigo-800 hover:text-white"
      onClick={() => isCartOpen.set(!$isCartOpen)}
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
          d="M0 2.5L0.958427 2.5C1.41012 2.5 1.82194 2.74308 2.04258 3.12774L2.5 4.5L3.93019 8.79057C4.27047 9.81142 5.22582 10.5 6.3019 10.5H12.4505C13.6422 10.5 14.6682 9.65885 14.9019 8.49029L15.7 4.5L16 3H14.4703L4.5 3L3.62309 3L3.50287 2.70678C3.07956 1.67431 2.0743 1 0.958427 1H0V2.5ZM4.08114 4.5L5.35321 8.31623C5.48933 8.72457 5.87147 9 6.3019 9H12.4505C12.9272 9 13.3376 8.66354 13.4311 8.19612L14.1703 4.5H4.5H4.08114ZM12.5 15C11.6716 15 11 14.3284 11 13.5C11 12.6716 11.6716 12 12.5 12C13.3284 12 14 12.6716 14 13.5C14 14.3284 13.3284 15 12.5 15ZM4.5 13.5C4.5 14.3284 5.17157 15 6 15C6.82843 15 7.5 14.3284 7.5 13.5C7.5 12.6716 6.82843 12 6 12C5.17157 12 4.5 12.6716 4.5 13.5Z"
          fill="currentColor"
        ></path>
      </svg>
      Carrito 
    </button>
  );
}
