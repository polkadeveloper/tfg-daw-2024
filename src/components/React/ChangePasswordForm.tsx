"use client";
import { useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import "@/styles/formStyles.css";
import "@/styles/sonner.css";

export function ChangePasswordForm(props: any) {
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmNewPasswordRef = useRef<HTMLInputElement>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const toggleShowCurrentPassword = () =>
    setShowCurrentPassword(!showCurrentPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmNewPassword = () =>
    setShowConfirmNewPassword(!showConfirmNewPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      newPasswordRef.current?.value !== confirmNewPasswordRef.current?.value
    ) {
      toast.error("Las contraseñas no coinciden", {
        duration: 1500,
      });
      return;
    }

    const formData = new FormData();
    formData.append("currentPassword", currentPasswordRef.current?.value || "");
    formData.append("newPassword", newPasswordRef.current?.value || "");
    formData.append(
      "confirmNewPassword",
      confirmNewPasswordRef.current?.value || ""
    );
    formData.append("idUser", props.idUser);

    // Crea una nueva promesa que incluye un setTimeout
    const fetchWithDelay = new Promise((resolve, reject) => {
      // Inicia la petición fetch después de un retraso de 2 segundos
      setTimeout(() => {
        fetch("/api/change-password", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              // Si la API devuelve un error, rechaza la promesa con el objeto de error
              return response.json().then(reject);
            }
            // Si la API devuelve un éxito, resuelve la promesa con el objeto de éxito
            return response.json().then(resolve);
          })
          .catch(reject); // Rechaza la promesa si la petición falla
      }, 2000);
    });

    // Muestra un toast mientras se envía el formulario
    toast.promise(fetchWithDelay, {
      loading: "Enviando...",
      success: (data: any) => {
        // Limpiar los campos del formulario
        currentPasswordRef.current!.value = "";
        newPasswordRef.current!.value = "";
        confirmNewPasswordRef.current!.value = "";
        return data.message;
      },
      error: (err) => {
        if (err.message) {
          return err.message;
        } else {
          return "Error al enviar el formulario";
        }
      },
    });
  };

  return (
    <>
      <form
        id="password-htmlForm"
        className="grid grid-cols-2 gap-5 overflow-y-auto max-h-[60vh] px-4"
        onSubmit={handleSubmit}
        style={{ scrollbarWidth: "thin", scrollbarColor: "#AAAAAA #FFFFFF" }}
      >
        <h2 className="text-xl font-cabinetGroteskBold uppercase col-span-2">
          Actualizar tu contraseña:
        </h2>
        <hr className="border-1 border-black col-span-2" />
        <label className="col-span-2 lg:col-span-1" htmlFor="current-password">
          Contraseña actual:
          <div className="relative">
            <input
              className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] placeholder:text-[#5d5c5ccb] rounded-md px-2 py-1 w-full"
              type={showCurrentPassword ? "text" : "password"}
              placeholder="••••••••"
              name="current-password"
              id="current-password"
              ref={currentPasswordRef}
              required
            />
            <button
              type="button"
              onClick={toggleShowCurrentPassword}
              className="absolute inset-y-0 right-2 pr-2 flex items-center text-sm leading-5 focus:outline-none"
            >
              {showCurrentPassword ? (
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
                    d="M4.02168 4.76932C6.11619 2.33698 9.88374 2.33698 11.9783 4.76932L14.7602 7.99999L11.9783 11.2307C9.88374 13.663 6.1162 13.663 4.02168 11.2307L1.23971 7.99999L4.02168 4.76932ZM13.1149 3.79054C10.422 0.663244 5.57797 0.663247 2.88503 3.79054L-0.318359 7.5106V8.48938L2.88503 12.2094C5.57797 15.3367 10.422 15.3367 13.1149 12.2094L16.3183 8.48938V7.5106L13.1149 3.79054ZM6.49997 7.99999C6.49997 7.17157 7.17154 6.49999 7.99997 6.49999C8.82839 6.49999 9.49997 7.17157 9.49997 7.99999C9.49997 8.82842 8.82839 9.49999 7.99997 9.49999C7.17154 9.49999 6.49997 8.82842 6.49997 7.99999ZM7.99997 4.99999C6.34311 4.99999 4.99997 6.34314 4.99997 7.99999C4.99997 9.65685 6.34311 11 7.99997 11C9.65682 11 11 9.65685 11 7.99999C11 6.34314 9.65682 4.99999 7.99997 4.99999Z"
                    fill="currentColor"
                  ></path>
                </svg>
              ) : (
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
                    d="M0.191137 2.06228L0.751694 2.56055L14.2517 14.5605L14.8122 15.0588L15.8088 13.9377L15.2482 13.4394L13.4399 11.832L16.3183 8.48938V7.51059L13.1149 3.79053C10.6442 0.921301 6.36413 0.684726 3.59378 3.07992L1.74824 1.43943L1.18768 0.941162L0.191137 2.06228ZM14.7602 7.99998L12.3187 10.8354L10.6699 9.36978C11.249 8.24171 11.0661 6.82347 10.1213 5.87865C9.08954 4.8469 7.49326 4.72376 6.32676 5.50923L4.72751 4.08767C6.88288 2.36327 10.1023 2.59076 11.9783 4.76931L14.7602 7.99998ZM7.52702 6.57613L9.46929 8.30259C9.56713 7.82531 9.43091 7.30959 9.06063 6.93931C8.64578 6.52446 8.0484 6.4034 7.52702 6.57613ZM-0.318359 7.51059L1.40386 5.5106L2.54051 6.48938L1.23971 7.99998L4.02168 11.2307C5.52853 12.9805 7.90301 13.4734 9.89972 12.7017L10.4405 14.1008C7.88008 15.0904 4.82516 14.4625 2.88503 12.2094L-0.318359 8.48938V7.51059Z"
                    fill="currentColor"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </label>
        <label className="col-span-2 lg:col-span-1" htmlFor="new-password">
          Nueva contraseña:
          <div className="relative">
            <input
              className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] placeholder:text-[#5d5c5ccb] rounded-md px-2 py-1 w-full"
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              name="new-password"
              id="new-password"
              ref={newPasswordRef}
              required
            />
            <button
              type="button"
              onClick={toggleShowNewPassword}
              className="absolute inset-y-0 right-2 pr-2 flex items-center text-sm leading-5 focus:outline-none"
            >
              {showNewPassword ? (
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
                    d="M4.02168 4.76932C6.11619 2.33698 9.88374 2.33698 11.9783 4.76932L14.7602 7.99999L11.9783 11.2307C9.88374 13.663 6.1162 13.663 4.02168 11.2307L1.23971 7.99999L4.02168 4.76932ZM13.1149 3.79054C10.422 0.663244 5.57797 0.663247 2.88503 3.79054L-0.318359 7.5106V8.48938L2.88503 12.2094C5.57797 15.3367 10.422 15.3367 13.1149 12.2094L16.3183 8.48938V7.5106L13.1149 3.79054ZM6.49997 7.99999C6.49997 7.17157 7.17154 6.49999 7.99997 6.49999C8.82839 6.49999 9.49997 7.17157 9.49997 7.99999C9.49997 8.82842 8.82839 9.49999 7.99997 9.49999C7.17154 9.49999 6.49997 8.82842 6.49997 7.99999ZM7.99997 4.99999C6.34311 4.99999 4.99997 6.34314 4.99997 7.99999C4.99997 9.65685 6.34311 11 7.99997 11C9.65682 11 11 9.65685 11 7.99999C11 6.34314 9.65682 4.99999 7.99997 4.99999Z"
                    fill="currentColor"
                  ></path>
                </svg>
              ) : (
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
                    d="M0.191137 2.06228L0.751694 2.56055L14.2517 14.5605L14.8122 15.0588L15.8088 13.9377L15.2482 13.4394L13.4399 11.832L16.3183 8.48938V7.51059L13.1149 3.79053C10.6442 0.921301 6.36413 0.684726 3.59378 3.07992L1.74824 1.43943L1.18768 0.941162L0.191137 2.06228ZM14.7602 7.99998L12.3187 10.8354L10.6699 9.36978C11.249 8.24171 11.0661 6.82347 10.1213 5.87865C9.08954 4.8469 7.49326 4.72376 6.32676 5.50923L4.72751 4.08767C6.88288 2.36327 10.1023 2.59076 11.9783 4.76931L14.7602 7.99998ZM7.52702 6.57613L9.46929 8.30259C9.56713 7.82531 9.43091 7.30959 9.06063 6.93931C8.64578 6.52446 8.0484 6.4034 7.52702 6.57613ZM-0.318359 7.51059L1.40386 5.5106L2.54051 6.48938L1.23971 7.99998L4.02168 11.2307C5.52853 12.9805 7.90301 13.4734 9.89972 12.7017L10.4405 14.1008C7.88008 15.0904 4.82516 14.4625 2.88503 12.2094L-0.318359 8.48938V7.51059Z"
                    fill="currentColor"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </label>
        <label
          className="col-span-2 lg:col-span-1"
          htmlFor="confirm-new-password"
        >
          Confirmar nueva contraseña:
          <div className="relative">
            <input
              className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] placeholder:text-[#5d5c5ccb] rounded-md px-2 py-1 w-full"
              type={showConfirmNewPassword ? "text" : "password"}
              placeholder="••••••••"
              name="confirm-new-password"
              id="confirm-new-password"
              ref={confirmNewPasswordRef}
              required
            />
            <button
              type="button"
              onClick={toggleShowConfirmNewPassword}
              className="absolute inset-y-0 right-2 pr-2 flex items-center text-sm leading-5 focus:outline-none"
            >
              {showConfirmNewPassword ? (
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
                    d="M4.02168 4.76932C6.11619 2.33698 9.88374 2.33698 11.9783 4.76932L14.7602 7.99999L11.9783 11.2307C9.88374 13.663 6.1162 13.663 4.02168 11.2307L1.23971 7.99999L4.02168 4.76932ZM13.1149 3.79054C10.422 0.663244 5.57797 0.663247 2.88503 3.79054L-0.318359 7.5106V8.48938L2.88503 12.2094C5.57797 15.3367 10.422 15.3367 13.1149 12.2094L16.3183 8.48938V7.5106L13.1149 3.79054ZM6.49997 7.99999C6.49997 7.17157 7.17154 6.49999 7.99997 6.49999C8.82839 6.49999 9.49997 7.17157 9.49997 7.99999C9.49997 8.82842 8.82839 9.49999 7.99997 9.49999C7.17154 9.49999 6.49997 8.82842 6.49997 7.99999ZM7.99997 4.99999C6.34311 4.99999 4.99997 6.34314 4.99997 7.99999C4.99997 9.65685 6.34311 11 7.99997 11C9.65682 11 11 9.65685 11 7.99999C11 6.34314 9.65682 4.99999 7.99997 4.99999Z"
                    fill="currentColor"
                  ></path>
                </svg>
              ) : (
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
                    d="M0.191137 2.06228L0.751694 2.56055L14.2517 14.5605L14.8122 15.0588L15.8088 13.9377L15.2482 13.4394L13.4399 11.832L16.3183 8.48938V7.51059L13.1149 3.79053C10.6442 0.921301 6.36413 0.684726 3.59378 3.07992L1.74824 1.43943L1.18768 0.941162L0.191137 2.06228ZM14.7602 7.99998L12.3187 10.8354L10.6699 9.36978C11.249 8.24171 11.0661 6.82347 10.1213 5.87865C9.08954 4.8469 7.49326 4.72376 6.32676 5.50923L4.72751 4.08767C6.88288 2.36327 10.1023 2.59076 11.9783 4.76931L14.7602 7.99998ZM7.52702 6.57613L9.46929 8.30259C9.56713 7.82531 9.43091 7.30959 9.06063 6.93931C8.64578 6.52446 8.0484 6.4034 7.52702 6.57613ZM-0.318359 7.51059L1.40386 5.5106L2.54051 6.48938L1.23971 7.99998L4.02168 11.2307C5.52853 12.9805 7.90301 13.4734 9.89972 12.7017L10.4405 14.1008C7.88008 15.0904 4.82516 14.4625 2.88503 12.2094L-0.318359 8.48938V7.51059Z"
                    fill="currentColor"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </label>

        {/* Mostramos los mensajes de error aquí */}
        {props.children}
        <p className="hidden text-red-500" id="errorMessage"></p>

        <hr className="border-1 border-black col-span-2" />
        <button className="bg-black text-white px-2 py-1 rounded-md text-lg mt-2 col-span-2">
          Guardar
        </button>
      </form>
      <Toaster position="top-right" expand={true} richColors theme="dark" />
    </>
  );
}

export default ChangePasswordForm;
