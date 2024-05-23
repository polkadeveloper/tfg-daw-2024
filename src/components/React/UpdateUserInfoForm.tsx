import React, { useRef, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import "@/styles/formStyles.css";

export function UpdateUserInfoForm(props: any) {
  const [initialState, setInitialState] = useState({
    name: props.name || "",
    lastName: props.lastName || "",
    username: props.username || "",
    email: props.email || "",
    address: props.address || "",
    floor: props.floor || "",
    postalCode: props.postalCode || "",
    city: props.city || "",
    province: props.province || "",
    country: props.country || "",
  });

  const [state, setState] = useState(initialState);

  const hasChanged = JSON.stringify(state) !== JSON.stringify(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanged) {
      toast.warning("No se realizaron cambios");
      return;
    }

    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("lastName", state.lastName);
    formData.append("username", state.username);
    formData.append("email", state.email);
    formData.append("address", state.address);
    formData.append("floor", state.floor);
    formData.append("postalCode", state.postalCode);
    formData.append("city", state.city);
    formData.append("province", state.province);
    formData.append("country", state.country);
    formData.append("userId", props.id);

    // Crea una nueva promesa que incluye un setTimeout
    const fetchWithDelay = new Promise((resolve, reject) => {
      // Inicia la petición fetch después de un retraso de 2 segundos
      setTimeout(() => {
        fetch("/api/update-user-info", {
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
        // Actualiza el estado inicial con el estado actual después de un envío exitoso
        setInitialState(state);
        return data.message;
      },
      error: (err) => {
        if (err.message) {
          fetch(`/api/get-user-info/${props.id}`)
            .then((response) => response.json())
            .then((data) => {
              setState({
                name: data.rows[0].first_name,
                lastName: data.rows[0].last_name,
                username: data.rows[0].user_name,
                email: data.rows[0].user_email,
                address: data.rows[0].address,
                floor: data.rows[0].floor,
                postalCode: data.rows[0].postal_code,
                city: data.rows[0].city,
                province: data.rows[0].province,
                country: data.rows[0].country,
              });
            })
            .catch((error) => {
              console.error(error);
            });

          return err.message;
        } else {
          fetch(`/api/get-user-info/${props.id}`)
            .then((response) => response.json())
            .then((data) => {
              setState({
                name: data.rows[0].first_name,
                lastName: data.rows[0].last_name,
                username: data.rows[0].user_name,
                email: data.rows[0].user_email,
                address: data.rows[0].address,
                floor: data.rows[0].floor,
                postalCode: data.rows[0].postal_code,
                city: data.rows[0].city,
                province: data.rows[0].province,
                country: data.rows[0].country,
              });
            })
            .catch((error) => {
              console.error(error);
            });

          return "Error al enviar el formulario";
        }
      },
    });
  };

  return (
    <>
      <form
        className="grid grid-cols-2 gap-5 overflow-y-auto max-h-[60vh] px-4 text-lg"
        onSubmit={handleSubmit}
        style={{ scrollbarWidth: "thin", scrollbarColor: "#AAAAAA #FFFFFF" }}
      >
        <h2 className="text-xl font-cabinetGroteskBold uppercase">
          Datos personales:
        </h2>
        <hr className="border-1 border-black col-span-2" />
        <label className="col-span-2 md:col-span-1" htmlFor="name">
          Nombre:
          <input
            type="text"
            name="name"
            id="name"
            value={state.name}
            onChange={handleChange}
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] rounded-md px-2 py-1 w-full text-lg"
          />
        </label>
        <label className="col-span-2 md:col-span-1" htmlFor="lastName">
          Apellidos:
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={state.lastName}
            onChange={handleChange}
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] rounded-md px-2 py-1 w-full text-lg"
          />
        </label>
        <label className="col-span-2 md:col-span-1" htmlFor="username">
          Nombre de usuario:
          <input
            type="text"
            name="username"
            id="username"
            value={state.username}
            onChange={handleChange}
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] rounded-md px-2 py-1 w-full text-lg"
          />
        </label>
        <label className="col-span-2 md:col-span-1" htmlFor="email">
          Correo:
          <input
            type="email"
            name="email"
            id="email"
            value={state.email}
            onChange={handleChange}
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] rounded-md px-2 py-1 w-full text-lg"
          />
        </label>
        <hr className="border-1 border-black col-span-2" />
        <h2 className="text-xl font-cabinetGroteskBold uppercase col-span-2">
          Dirección de Facturación:
        </h2>
        <label className="col-span-2 md:col-span-1" htmlFor="address">
          Dirección:
          <input
            type="text"
            name="address"
            id="address"
            value={state.address}
            onChange={handleChange}
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] rounded-md px-2 py-1 w-full text-lg"
          />
        </label>
        <label className="col-span-2 md:col-span-1" htmlFor="floor">
          Piso/Escalera (opcional):
          <input
            type="text"
            name="floor"
            id="floor"
            value={state.floor}
            onChange={handleChange}
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] rounded-md px-2 py-1 w-full text-lg"
          />
        </label>
        <label className="col-span-2 md:col-span-1" htmlFor="postalCode">
          Código Postal:
          <input
            type="text"
            name="postalCode"
            id="postalCode"
            value={state.postalCode}
            onChange={handleChange}
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] rounded-md px-2 py-1 w-full text-lg"
          />
        </label>
        <label className="col-span-2 md:col-span-1" htmlFor="city">
          Ciudad:
          <input
            type="text"
            name="city"
            id="city"
            value={state.city}
            onChange={handleChange}
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] rounded-md px-2 py-1 w-full text-lg"
          />
        </label>
        <label className="col-span-2 md:col-span-1" htmlFor="province">
          Provincia:
          <input
            type="text"
            name="province"
            id="province"
            value={state.province}
            onChange={handleChange}
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] rounded-md px-2 py-1 w-full text-lg"
          />
        </label>
        <label className="col-span-2 md:col-span-1" htmlFor="country">
          País:
          <input
            type="text"
            name="country"
            id="country"
            value={state.country}
            onChange={handleChange}
            className="border-2 border-black bg-[#BBBBBB] text-[#3C3C3C] rounded-md px-2 py-1 w-full text-lg"
          />
        </label>
        <hr className="border-1 border-black col-span-2" />
        <button className="bg-black text-white px-2 py-1 rounded-md text-lg mt-2 col-span-2">
          Guardar
        </button>
      </form>
    </>
  );
}

export default UpdateUserInfoForm;
