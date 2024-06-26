import React, { useRef, useEffect } from "react";
import { Label } from "@/components/React/ui/label";
import { Input } from "@/components/React/ui/input";
import { Toaster, toast } from "sonner";
import { cn } from "@/utils/cn";
import "@/styles/sonner.css";

export function ForgotPasswordForm(props: any) {
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailRef.current?.value) {
      return toast.error("Por favor, introduce tu correo electrónico", {
        duration: 1500,
      });
    }
    const formData = new FormData();
    formData.append("email", emailRef.current?.value || "");

    // Crea una nueva promesa que incluye un setTimeout
    const fetchWithDelay = new Promise((resolve, reject) => {
      // Inicia la petición fetch después de un retraso de 2 segundos
      setTimeout(() => {
        fetch("/api/forgot-password", {
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
        window.location.href = `/email-sent/${data.userId}?email=sent`;
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

  // Una vez que el componente se monta, revisamos si hay un mensaje de toast en la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const toastMessage = urlParams.get("toast");
    if (toastMessage) {
      setTimeout(() => {
        toast.error(toastMessage, {
          duration: 1500,
        });
      }, 0);
    }
  }, []);

  return (
    <div className="max-w-sm w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-indigo-500 via-black to-black border-2 border-indigo-500/40">
      <h2 className="font-bold text-2xl text-neutral-200 mb-5">
        Restablecer contraseña
      </h2>
      <form className="my-10" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            placeholder="correo@ejemplo.com"
            type="email"
            ref={emailRef}
            required
          />
        </LabelInputContainer>

        <button
          className="flex justify-center items-center gap-2 bg-gradient-to-br relative group/btn mt-5 from-zinc-900 to-zinc-900  bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Enviar correo
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-send"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 14l11 -11" />
            <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
          </svg>
          <BottomGradient />
        </button>
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

export default ForgotPasswordForm;
