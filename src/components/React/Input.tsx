"use client";
import React, { useRef, useEffect } from "react";
import { Label } from "@/components/React/ui/label";
import { Input } from "@/components/React/ui/input";
import { cn } from "@/utils/cn";
import { Toaster, toast } from "sonner";
export function SignupFormDemo(props: any) {
  const firstnameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e) => {
    const formData = new FormData();
    formData.append("username", usernameRef.current?.value || "");
    formData.append("password", passwordRef.current?.value || "");
    formData.append("firstname", firstnameRef.current?.value || "");
    formData.append("lastname", lastnameRef.current?.value || "");
    formData.append("email", emailRef.current?.value || "");

    const fetchPromise = fetch("http://localhost:4321/api/signup", {
      method: "POST",
      body: formData,
    });

    // Mostramos un toast mientras se envía el formulario
    toast.promise(fetchPromise, {
      loading: "Enviando...",
      success: (response) => {
        if (response.ok) {
          console.log("Form submitted successfully");
          if (response.redirected) {
            window.location.href = response.url;
          }
          return "Cuenta creada exitosamente";
        } else {
          console.error("Form submission failed");
          return "Error al crear la cuenta";
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
        Bienvenido a Emblem
      </h2>
      <p className="text-base max-w-sm mt-2 text-neutral-300">
        Crea tu cuenta en Emblem a traves de este formulario
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Nombre</Label>
            <Input
              id="firstname"
              placeholder="Daryl"
              type="text"
              ref={firstnameRef}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Apellidos</Label>
            <Input
              id="lastname"
              placeholder="Dixon"
              type="text"
              ref={lastnameRef}
              required
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="daryldixon@thewalkingdead.com"
            type="email"
            ref={emailRef}
            required
          />
        </LabelInputContainer>
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
          className="bg-gradient-to-br relative group/btn mt-5 from-zinc-900 to-zinc-900 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Registrarse &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-indigo-800 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <a className="text-center" href="/login">
            ¿Ya tienes una cuenta? Inicia sesión
          </a>
        </div>

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

export default SignupFormDemo;
