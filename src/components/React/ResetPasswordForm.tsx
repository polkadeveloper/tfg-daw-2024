"use client";
import React, { useRef, useEffect } from "react";
import { Label } from "@/components/React/ui/label";
import { Input } from "@/components/React/ui/input";
import { cn } from "@/utils/cn";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Toaster, toast } from "sonner";

export function ResetPasswordForm(props: any) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const repeatPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = document.querySelector("#errorMessage") as HTMLElement;
    if (passwordRef.current?.value !== repeatPasswordRef.current?.value) {
      errorMessage.textContent = "Las contraseñas no coinciden";
      errorMessage.classList.remove("hidden");
      return;
    } else {
      errorMessage.classList.add("hidden");
    }
    const formData = new FormData();
    formData.append("password", passwordRef.current?.value || "");
    formData.append("repeatPassword", repeatPasswordRef.current?.value || "");
    formData.append("idUser", props.id);

    const fetchPromise = fetch("http://localhost:4321/api/reset-password", {
      method: "POST",
      body: formData,
    });

    // Mostramos un toast mientras se envía el formulario
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
    <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-indigo-500 via-black to-black border-2 border-indigo-500/40">
      <h2 className="font-bold text-2xl text-neutral-200">
        Restablece tu contraseña de Emblem
      </h2>
      <p className="text-base max-w-sm mt-2 text-neutral-300">
        Recuerda que la contraseña debe tener al menos 8 caracteres, una
        mayúscula, una minúscula y un número
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            ref={passwordRef}
            required
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="repeatPassword">Repite la contraseña</Label>
          <Input
            id="repeatPassword"
            placeholder="••••••••"
            type="repeatPassword"
            ref={repeatPasswordRef}
            required
          />
        </LabelInputContainer>

        {/* Mostramos los mensajes de error aquí */}
        {props.children}
        <p className="hidden text-red-500" id="errorMessage"></p>

        <button
          className="flex justify-center items-center gap-2 bg-gradient-to-br relative group/btn mt-5 from-zinc-900 to-zinc-900  bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Cambiar la contraseña
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-password-user"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 17v4" />
            <path d="M10 20l4 -2" />
            <path d="M10 18l4 2" />
            <path d="M5 17v4" />
            <path d="M3 20l4 -2" />
            <path d="M3 18l4 2" />
            <path d="M19 17v4" />
            <path d="M17 20l4 -2" />
            <path d="M17 18l4 2" />
            <path d="M9 6a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
            <path d="M7 14a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2" />
          </svg>
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-indigo-800 to-transparent my-8 h-[1px] w-full" />

        <Toaster position="top-right" expand={true} richColors theme="dark" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default ResetPasswordForm;
