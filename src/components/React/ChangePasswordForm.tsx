"use client";
import React, { useRef, useEffect } from "react";
import { Label } from "@/components/React/ui/label";
import { Input } from "@/components/React/ui/input";
import { cn } from "@/utils/cn";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Toaster, toast } from "sonner";

export function ChangePasswordForm(props: any) {
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmNewPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = document.querySelector("#errorMessage") as HTMLElement;
    if (newPasswordRef.current?.value !== confirmNewPasswordRef.current?.value) {
      errorMessage.textContent = "Las contraseñas no coinciden";
      errorMessage.classList.remove("hidden");
      return;
    } else {
      errorMessage.classList.add("hidden");
    }
    const formData = new FormData();
    formData.append("currentPassword", currentPasswordRef.current?.value || "");
    formData.append("newPassword", newPasswordRef.current?.value || "");
    formData.append(
      "confirmNewPassword",
      confirmNewPasswordRef.current?.value || ""
    );
    formData.append("idUser", props.idUser);

    const fetchPromise = fetch("http://localhost:4321/api/change-password", {
      method: "POST",
      body: formData,
    });

    // Mostramos un toast mientras se envía el htmlFormulario
    toast.promise(fetchPromise, {
      loading: "Enviando...",
      success: (response) => {
        if (response.ok) {
          if (response.redirected) {
            window.location.href = response.url;
          }
          return "Cambio de contraseña exitoso";
        } else {
          return "Error al cambiar la contraseña";
        }
      },
      error: "Error al enviar el formulario",
    });
  };

  // Una vez que el componente se monta, revisamos si hay un mensaje de toast en la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const toastMessage = urlParams.get("toast");
    if (toastMessage) {
      setTimeout(() => {
        toast.error(toastMessage);
      }, 0);
    }
  }, []);

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
          <input
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] placeholder:text-[#5d5c5ccb] rounded-md px-2 py-1 w-full"
            type="password"
            placeholder="••••••••"
            name="current-password"
            id="current-password"
            ref={currentPasswordRef}
            required
          />
        </label>
        <label className="col-span-2 lg:col-span-1" htmlFor="new-password">
          Nueva contraseña:
          <input
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] placeholder:text-[#5d5c5ccb] rounded-md px-2 py-1 w-full"
            type="password"
            placeholder="••••••••"
            name="new-password"
            id="new-password"
            ref={newPasswordRef}
            required
          />
        </label>
        <label className="col-span-2 lg:col-span-1" htmlFor="confirm-new-password">
          Confirmar nueva contraseña:
          <input
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] placeholder:text-[#5d5c5ccb] rounded-md px-2 py-1 w-full"
            type="password"
            placeholder="••••••••"
            name="confirm-new-password"
            id="confirm-new-password"
            ref={confirmNewPasswordRef}
            required
          />
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
