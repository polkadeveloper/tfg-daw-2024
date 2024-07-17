"use client";
import React, { useRef, useState, useEffect } from "react";
import { Label } from "@/components/React/ui/label";
import { Input } from "@/components/React/ui/input";
import { cn } from "@/utils/cn";
import { Toaster, toast } from "sonner";
import "@/styles/sonner.css";

export function LoginForm(props: any) {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (props.passwordChanged === true) {
      toast.success("Se ha cambiado la contraseña correctamente", {
        duration: 1500,
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", usernameRef.current?.value || "");
    formData.append("password", passwordRef.current?.value || "");

    // Crea una nueva promesa que incluye un setTimeout
    const fetchWithDelay = new Promise((resolve, reject) => {
      // Inicia la petición fetch después de un retraso de 2 segundos
      setTimeout(() => {
        fetch("/api/login", {
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
      success: () => {
        window.location.href = "/?account=logged";
        return ""; // Devuelve un mensaje vacío
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
      <h2 className="font-bold text-2xl text-neutral-200">
        Bienvenido a Future
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
          <div className="relative">
            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              ref={passwordRef}
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-2 pr-2 flex items-center text-sm leading-5 focus:outline-none"
            >
              {showPassword ? (
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
        </LabelInputContainer>

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
      </form>
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
