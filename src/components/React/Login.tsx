"use client";
import React, { useRef, useEffect } from "react";
import { Label } from "@/components/React/ui/label";
import { Input } from "@/components/React/ui/input";
import { cn } from "@/utils/cn";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Toaster, toast } from "sonner";

export function LoginForm(props: any) {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", usernameRef.current?.value || "");
    formData.append("password", passwordRef.current?.value || "");

    const fetchPromise = fetch("http://localhost:4321/api/login", {
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
          return "Inicio de sesión exitoso";
        } else {
          return "Error al iniciar sesión";
        }
      },
      error: "Error al enviar el formulario",
    });
  };

  // Una vez que el componente se monta, revisamos si hay un mensaje de toast en la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const toastErrorMessage = urlParams.get("toast");
    const toastSuccessMessage = urlParams.get("success");
    if (toastErrorMessage) {
      setTimeout(() => {
        toast.error(toastErrorMessage);
      }, 0);
    } else if (toastSuccessMessage) {
      setTimeout(() => {
        toast.success("Contraseña cambiada correctamente");
      }, 0);
    }
  }, []);

  return (
    <>
      <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-indigo-500 via-black to-black border-2 border-indigo-500/40">
        <h2 className="font-bold text-2xl text-neutral-200">
          Bienvenido a Emblem
        </h2>
        <p className="text-base max-w-sm mt-2 text-neutral-300">
          Inicia sesión para continuar
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              placeholder="daryldixon"
              type="text"
              ref={usernameRef}
              required
            />
          </LabelInputContainer>
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

          {/* Mostramos los mensajes de error aquí */}
          {props.children}

          <button
            className="flex justify-center items-center gap-2 bg-gradient-to-br relative group/btn mt-5 from-zinc-900 to-zinc-900  bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Iniciar sesión
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-login"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M21 12h-13l3 -3" />
              <path d="M11 15l-3 -3" />
            </svg>
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-indigo-800 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
              className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="submit"
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                Iniciar sesión con Google
              </span>
              <BottomGradient />
            </button>

            <a className="text-center pt-5" href="/signup">
              ¿No tienes cuenta? Regístrate
            </a>
            <a className="text-center" href="/forgot-password">
              ¿Has olvidado tu contraseña?
            </a>
          </div>
        </form>
      </div>
      <Toaster position="top-right" expand={true} richColors theme="dark" />
    </>
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

export default LoginForm;
