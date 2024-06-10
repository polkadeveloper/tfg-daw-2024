import React, { useState } from "react";
import "@/styles/noInputColor.css";
import { Toaster, toast } from "sonner";
import "@/styles/sonner.css";
import DeleteAdminPanel from "@/components/React/admin-panel/DeleteAdminPanel";
import CreateAdminPanel from "@/components/React/admin-panel/CreateAdminPanel";
import UpdateAdminPanel from "@/components/React/admin-panel/UpdateAdminPanel";

function AdminPanel(props: any) {
  const [password, setPassword] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [isBlocked, setIsBlocked] = useState(props.status); // Inicializa isBlocked con el estado de la cuenta
  const [loginAttempts, setLoginAttempts] = useState(props.loginAttempts); // Inicializa loginAttempts con el número de intentos del usuario
  // Agrega un nuevo estado para rastrear el panel actual
  const [currentPanel, setCurrentPanel] = useState<
    "create" | "update" | "delete" | null
  >(null);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== "admin") {
      toast.error("La contraseña es incorrecta", {
        duration: 1500,
      });
      try {
        const response = await fetch(`/api/block-account`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: props.id }),
        });
        const data = await response.json();
        setLoginAttempts(data.loginAttempts);
        if (data.message === "Usuario bloqueado") {
          toast.error("Tu cuenta está bloqueada", {
            duration: 1500,
          });
          setIsBlocked("blocked");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const response = await fetch(`/api/block-account`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: props.id, status: "logged" }),
        });
        const data = await response.json();
        setLoginAttempts(data.loginAttempts);
        if (data.message === "Usuario autenticado") {
          toast.success("Has iniciado sesión correctamente", {
            duration: 1500,
          });
          setIsBlocked("logged");
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setAuthenticated(true);
    }
  };

  // if (!authenticated) {
  //   return (
  //     <>
  //       <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-lg flex items-center justify-center z-10 px-8">
  //         <div className="flex flex-col justify-center items-center gap-2 bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto text-black z-20">
  //           <div>
  //             {
  //               <svg
  //                 data-testid="geist-icon"
  //                 height="36"
  //                 strokeLinejoin="round"
  //                 viewBox="0 0 16 16"
  //                 width="36"
  //                 style={{ color: "currentcolor" }}
  //               >
  //                 <path
  //                   fillRule="evenodd"
  //                   clipRule="evenodd"
  //                   d="M6.5 5.5C6.5 3.29086 8.29086 1.5 10.5 1.5C12.7091 1.5 14.5 3.29086 14.5 5.5C14.5 7.70914 12.7091 9.5 10.5 9.5C10.0496 9.5 9.61798 9.42583 9.21589 9.28964L9.09885 9.25H8.97528H8H7.25V10V12.25H5.75H5V13V14.5H1.5V11.5818L6.38022 7.14521L6.70674 6.84837L6.60585 6.41878C6.53673 6.12449 6.5 5.81702 6.5 5.5ZM10.5 0C7.46243 0 5 2.46243 5 5.5C5 5.77753 5.02062 6.05064 5.06048 6.31778L0.245495 10.695L0 10.9182V11.25V15.25V16H0.75H5.75H6.5V15.25V13.75H8H8.75V13V10.75H8.85639C9.37626 10.9126 9.92859 11 10.5 11C13.5376 11 16 8.53757 16 5.5C16 2.46243 13.5376 0 10.5 0ZM10.5 6.5C11.0523 6.5 11.5 6.05228 11.5 5.5C11.5 4.94772 11.0523 4.5 10.5 4.5C9.94771 4.5 9.5 4.94772 9.5 5.5C9.5 6.05228 9.94771 6.5 10.5 6.5Z"
  //                   fill="currentColor"
  //                 ></path>
  //               </svg>
  //             }
  //           </div>
  //           <p className="text-2xl font-cabinetGroteskBold text-pretty text-center px-2">
  //             Esta acción requiere de contraseña
  //           </p>
  //           <p className="text-base font-cabinetGroteskRegular text-pretty text-center px-2">
  //             Introduce la clave de administrador para continuar
  //           </p>
  //           <p className="text-base font-cabinetGroteskRegular text-pretty text-center px-2">
  //             Intentos restantes: {loginAttempts}
  //           </p>
  //           {isBlocked === "blocked" && (
  //             <p className="text-base text-red-500 font-cabinetGroteskRegular text-pretty text-center px-2">
  //               Tu cuenta está bloqueada, porfavor contacta al administrador.
  //             </p>
  //           )}
  //           <form
  //             className="flex justify-center items-center gap-2"
  //             onSubmit={handleLogin}
  //           >
  //             <input
  //               className="bg-white border-2 border-black rounded-lg p-1 no-autofill-color"
  //               type="password"
  //               onChange={handlePasswordChange}
  //               autoComplete="off"
  //               disabled={isBlocked === "blocked"} // Deshabilita el input si el usuario está bloqueado
  //             />
  //             <button
  //               type="submit"
  //               className="px-2 py-2 text-base bg-indigo-700 hover:bg-indigo-500 text-white rounded-lg"
  //               disabled={isBlocked === "blocked"} // Deshabilita el botón si el usuario está bloqueado
  //             >
  //               Enviar
  //             </button>
  //           </form>
  //         </div>
  //       </div>
  //       <Toaster position="top-right" expand={true} richColors theme="dark" />
  //     </>
  //   );
  // }

  // Muestra el panel correspondiente en función del estado de currentPanel
  if (currentPanel === "create") {
    return (
      <section className="min-h-[65vh] relative px-5 py-2 w-full flex flex-col gap-5 justify-center items-center font-cabinetGroteskBold">
        <CreateAdminPanel setCurrentPanel={setCurrentPanel} />
      </section>
    );
  } else if (currentPanel === "update") {
    return (
      <section className="min-h-[65vh] relative px-5 py-2 w-full flex flex-col gap-5 justify-center items-center font-cabinetGroteskBold">
        <UpdateAdminPanel setCurrentPanel={setCurrentPanel} />
      </section>
    );
  } else if (currentPanel === "delete") {
    return (
      <section className="min-h-[65vh] relative px-5 py-2 w-full flex flex-col gap-5 justify-center items-center font-cabinetGroteskBold">
        <DeleteAdminPanel setCurrentPanel={setCurrentPanel} />
      </section>
    );
  }

  return (
    <>
      <article className="relative flex flex-col gap-10 justify-center items-center bg-black/40 border-2 border-white p-20 rounded-lg">
        <h1 className="text-2xl lg:text-4xl">Panel de administración</h1>
        <h2 className="text-2xl">¿Que deseas realizar?</h2>
        <article className="flex justify-center items-center text-black gap-10">
          <button
            className="bg-green-400 px-2 py-2 rounded-lg"
            onClick={() => setCurrentPanel("create")} // Establece currentPanel a "create" cuando se hace clic en este botón
          >
            Crear
          </button>
          <button
            className="bg-blue-400 px-2 py-2 rounded-lg"
            onClick={() => setCurrentPanel("update")} // Establece currentPanel a "update" cuando se hace clic en este botón
          >
            Actualizar
          </button>
          <button
            className="bg-red-400 px-2 py-2 rounded-lg"
            onClick={() => setCurrentPanel("delete")} // Establece currentPanel a "delete" cuando se hace clic en este botón
          >
            Eliminar
          </button>
        </article>
        <p className="absolute top-2 right-2 font-bold">admin @ polkadev</p>
      </article>
      <Toaster position="top-right" expand={true} richColors theme="dark" />
    </>
  );
}

export default AdminPanel;
