import { useState, useEffect } from "react";
import "@/styles/noInputColor.css";
import { Toaster, toast } from "sonner";
import "@/styles/sonner.css";

function CreateAdminPanel(props: any) {
  const [showCreateUserComponent, setShowCreateUserComponent] = useState(false);
  const [showCreateCollectionComponent, setShowCreateCollectionComponent] =
    useState(false);

  if (showCreateUserComponent) {
    return (
      <CreateUsersCreatePanel
        setShowCreateUserComponent={setShowCreateUserComponent}
      />
    );
  }

  if (showCreateCollectionComponent) {
    return (
      <CreateCollectionsCreatePanel
        setShowCreateCollectionComponent={setShowCreateCollectionComponent}
      />
    );
  }
  return (
    <>
      <button
        className="absolute top-5 left-5"
        onClick={() => props.setCurrentPanel(null)}
      >
        Volver atrás
      </button>

      <section className="flex justify-center items-center gap-10">
        <section
          onClick={() => setShowCreateUserComponent(true)}
          className="relative z-0 w-56 h-56 cursor-pointer flex justify-center items-center border-2 border-white rounded-lg overflow-hidden [&>article]:hover:scale-125 [&>div]:hover:bg-black/30"
        >
          <article
            style={{ backgroundImage: "url(img/fondo-borrar-camisetas.jpg)" }}
            className="absolute top-0 left-0 z-10 w-full h-full bg-center bg-cover bg-no-repeat overflow-hidden duration-500 transition-all ease-in-out"
          ></article>
          <div className="absolute bottom-0 top-0 z-10 h-full w-full bg-gradient-to-b from-transparent from-40% via-black/60 to-black/90 duration-300 transition-all ease-in-out"></div>
          <p className="absolute bottom-3 z-20 text-base uppercase font-cabinetGroteskBlack text-white tracking-wider text-center">
            Crear prendas
          </p>
        </section>

        <section
          onClick={() => setShowCreateCollectionComponent(true)}
          className="relative z-0 w-56 h-56 cursor-pointer flex justify-center items-center border-2 border-white rounded-lg overflow-hidden [&>article]:hover:scale-125 [&>div]:hover:bg-black/30"
        >
          <article
            style={{ backgroundImage: "url(img/fondo-borrar-colecciones.jpg)" }}
            className="absolute top-0 left-0 z-10 w-full h-full bg-center bg-cover bg-no-repeat overflow-hidden duration-500 transition-all ease-in-out"
          ></article>
          <div className="absolute bottom-0 top-0 z-10 h-full w-full bg-gradient-to-b from-transparent from-40% via-black/60 to-black/90 duration-300 transition-all ease-in-out"></div>
          <p className="absolute bottom-3 z-20 text-base uppercase font-cabinetGroteskBlack text-white tracking-wider text-center">
            Crear colecciones
          </p>
        </section>
      </section>
    </>
  );
}

function CreateUsersCreatePanel(props: any) {
  const [itemName, setItemName] = useState("");
  const [imageName, setImageName] = useState("");
  const [description, setDescription] = useState("");
  const [stockXS, setStockXS] = useState("");
  const [stockS, setStockS] = useState("");
  const [stockM, setStockM] = useState("");
  const [stockL, setStockL] = useState("");
  const [stockXL, setStockXL] = useState("");
  const [price, setPrice] = useState("");
  const [collection, setCollection] = useState("");

  const handleCreate = () => {
    fetch("/api/create-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemName,
        imageName,
        description,
        stock: {
          XS: stockXS,
          S: stockS,
          M: stockM,
          L: stockL,
          XL: stockXL,
        },
        price,
        collection,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message);
        // Limpiamos los campos
        setItemName("");
        setImageName("");
        setDescription("");
        setStockXS("");
        setStockS("");
        setStockM("");
        setStockL("");
        setStockXL("");
        setPrice("");
        setCollection("");
      })
      .catch((error) => {
        toast.error("Error al crear la prenda");
      });
  };
  return (
    <>
      <button
        className="absolute top-5 left-5"
        onClick={() => props.setShowCreateUserComponent(false)}
      >
        Volver atrás
      </button>
      <h1 className="text-3xl text-center font-cabinetGroteskBold">
        Crear prendas
      </h1>
      <div className="grid grid-cols-3 justify-center items-center gap-5">
        <article className="col-span-1 w-[425px] h-32 cursor-pointer flex justify-center items-center gap-5 bg-black/30 border-2 border-white rounded-lg overflow-hidden">
          <h2>Nombre de la prenda</h2>
          <input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="px-4 py-2 bg-white rounded-lg border-2 border-black text-black w-32"
            type="text"
          ></input>
        </article>
        <article className="col-span-1 w-[425px] h-32 cursor-pointer flex justify-center items-center gap-5 bg-black/30 border-2 border-white rounded-lg overflow-hidden">
          <h2>Nombre de la imágen</h2>
          <input
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            className="px-4 py-2 bg-white rounded-lg border-2 border-black text-black w-32"
            type="text"
          ></input>
        </article>
        <article className="col-span-1 w-[425px] h-32 cursor-pointer flex justify-center items-center gap-5 bg-black/30 border-2 border-white rounded-lg overflow-hidden">
          <h2>Descripción de la prenda</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-28 px-4 py-2 bg-white rounded-lg border-2 border-black text-black"
          ></textarea>
        </article>
        <article className="col-span-1 w-[425px] h-32 cursor-pointer flex flex-col gap-2 justify-center items-center bg-black/30 border-2 border-white rounded-lg overflow-hidden">
          <h2>Stock por tallas</h2>
          <div className="grid gap-1 grid-cols-5">
            <div className="col-span-1 flex gap-1 justify-center items-center">
              <label htmlFor="tallaXS">XS:</label>
              <input
                value={stockXS}
                onChange={(e) => setStockXS(e.target.value)}
                name="tallaXS"
                className="px-1 py-1 p-1 bg-white rounded-lg border-2 border-black text-black w-12"
                type="text"
              ></input>
            </div>
            <div className="col-span-1 flex gap-1 justify-center items-center">
              <label htmlFor="tallaS">S:</label>
              <input
                value={stockS}
                onChange={(e) => setStockS(e.target.value)}
                name="tallaS"
                className="px-1 py-1 p-1 bg-white rounded-lg border-2 border-black text-black w-12"
                type="text"
              ></input>
            </div>
            <div className="col-span-1 flex gap-1 justify-center items-center">
              <label htmlFor="tallaM">M:</label>
              <input
                value={stockM}
                onChange={(e) => setStockM(e.target.value)}
                name="tallaM"
                className="px-1 py-1 p-1 bg-white rounded-lg border-2 border-black text-black w-12"
                type="text"
              ></input>
            </div>
            <div className="col-span-1 flex gap-1 justify-center items-center">
              <label htmlFor="tallaL">L:</label>
              <input
                value={stockL}
                onChange={(e) => setStockL(e.target.value)}
                name="tallaL"
                className="px-1 py-1 p-1 bg-white rounded-lg border-2 border-black text-black w-12"
                type="text"
              ></input>
            </div>
            <div className="col-span-1 flex gap-1 justify-center items-center">
              <label htmlFor="tallaXL">XL:</label>
              <input
                value={stockXL}
                onChange={(e) => setStockXL(e.target.value)}
                name="tallaXL"
                className="px-1 py-1 p-1 bg-white rounded-lg border-2 border-black text-black w-12"
                type="text"
              ></input>
            </div>
          </div>
        </article>
        <article className="col-span-1 w-[425px] h-32 cursor-pointer flex justify-center items-center gap-5 bg-black/30 border-2 border-white rounded-lg overflow-hidden">
          <h2>Precio de la prenda</h2>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="px-4 py-2 bg-white rounded-lg border-2 border-black text-black w-20"
            type="text"
          ></input>
        </article>
        <article className="col-span-1 w-[425px] h-32 cursor-pointer flex justify-center items-center gap-5 bg-black/30 border-2 border-white rounded-lg overflow-hidden">
          <h2>Colección de la prenda</h2>
          <input
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            name="collection"
            className="px-4 py-2 bg-white rounded-lg border-2 border-black text-black"
            type="text"
          ></input>
        </article>
      </div>
      <button
        className="bg-green-500 border-2 border-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out"
        onClick={handleCreate}
      >
        Crear
      </button>
      <Toaster position="top-right" expand={true} richColors theme="dark" />
    </>
  );
}

function CreateCollectionsCreatePanel(props: any) {
  return (
    <>
      <button
        className="absolute top-5 left-5"
        onClick={() => props.setShowCreateCollectionComponent(false)}
      >
        Volver atrás
      </button>
      <p>Create Collections Create Panel</p>
    </>
  );
}

export default CreateAdminPanel;
