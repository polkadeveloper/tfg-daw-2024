import { useState, useEffect } from "react";
import "@/styles/noInputColor.css";
import { Toaster, toast } from "sonner";
import "@/styles/sonner.css";

function UpdateAdminPanel(props: any) {
  const [showUpdateItemComponent, setShowUpdateItemComponent] = useState(false);

  if (showUpdateItemComponent) {
    return (
      <UpdateItemsUpdatePanel
        setShowUpdateItemComponent={setShowUpdateItemComponent}
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
          onClick={() => setShowUpdateItemComponent(true)}
          className="relative z-0 w-56 h-56 cursor-pointer flex justify-center items-center border-2 border-white rounded-lg overflow-hidden [&>article]:hover:scale-125 [&>div]:hover:bg-black/30"
        >
          <article
            style={{ backgroundImage: "url(img/fondo-borrar-camisetas.jpg)" }}
            className="absolute top-0 left-0 z-10 w-full h-full bg-center bg-cover bg-no-repeat overflow-hidden duration-500 transition-all ease-in-out"
          ></article>
          <div className="absolute bottom-0 top-0 z-10 h-full w-full bg-gradient-to-b from-transparent from-40% via-black/60 to-black/90 duration-300 transition-all ease-in-out"></div>
          <p className="absolute bottom-3 z-20 text-base uppercase font-cabinetGroteskBlack text-white tracking-wider text-center">
            Actualizar prendas
          </p>
        </section>
      </section>
    </>
  );
}

function UpdateItemsUpdatePanel(props: any) {
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

  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  const fetchItems = () => {
    fetch("/api/items")
      .then((response) => response.json())
      .then((data) => {
        setItems(data.camisetas);
      })
      .catch((error) => {
        console.error("Error fetching items", error);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpdate = () => {
    fetch("/api/update-item", {
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
        toast.error("Error al actualizar la prenda");
      });
  };

  const handleSelectItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedItemName = e.target.value;
    setSelectedItem(selectedItemName);

    fetch(`/api/item/${selectedItemName}`)
      .then((response) => response.json())
      .then((data) => {
        const item = data.rows[0];
        setItemName(item.item_name || "");
        setImageName(item.item_img_name || "");
        setDescription(item.item_description || "");
        setPrice(item.item_price || "");

        // Segundo fetch para obtener el nombre de la colección
        return fetch(`/api/collection/${item.collection_id}`);
      })
      .then((response) => response.json())
      .then((data) => {
        // Accede al primer elemento del array 'collection' y luego a 'collection_name'
        setCollection(data.collection[0].collection_name || "");

        // Tercer fetch para obtener las tallas
        return fetch(`/api/sizes/${selectedItemName}`);
      })
      .then((response) => response.json())
      .then((data) => {
        // Busca en el array de tallas la que corresponde a cada talla y luego establece el stock correspondiente
        const sizeXS = data.sizes.find((size) => size.size_id === 1);
        const sizeS = data.sizes.find((size) => size.size_id === 2);
        const sizeM = data.sizes.find((size) => size.size_id === 3);
        const sizeL = data.sizes.find((size) => size.size_id === 4);
        const sizeXL = data.sizes.find((size) => size.size_id === 5);

        setStockXS(sizeXS ? sizeXS.quantity : "");
        setStockS(sizeS ? sizeS.quantity : "");
        setStockM(sizeM ? sizeM.quantity : "");
        setStockL(sizeL ? sizeL.quantity : "");
        setStockXL(sizeXL ? sizeXL.quantity : "");
      })
      .catch((error) => {
        console.error("Error fetching item details", error);
      });
  };

  return (
    <>
      <button
        className="absolute top-5 left-5"
        onClick={() => props.setShowUpdateItemComponent(false)}
      >
        Volver atrás
      </button>
      <h1 className="text-3xl text-center font-cabinetGroteskBold">
        Actualizar prendas
      </h1>
      <div className="grid grid-cols-3 justify-center items-center gap-5">
        <article className="col-span-1 w-[425px] h-32 cursor-pointer flex justify-center items-center gap-5 bg-black/30 border-2 border-white rounded-lg overflow-hidden">
          <h2>Nombre de la prenda</h2>
          <select
            className="px-4 py-2 border-2 border-white rounded-lg"
            value={selectedItem}
            onChange={handleSelectItem}
            style={{ width: "200px", textOverflow: "ellipsis" }}
          >
            {items.map((item) => (
              <option
                key={item.item_id}
                value={item.item_name}
                style={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {item.item_name}
              </option>
            ))}
          </select>
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
        onClick={handleUpdate}
      >
        Crear
      </button>
      <Toaster position="top-right" expand={true} richColors theme="dark" />
    </>
  );
}

export default UpdateAdminPanel;
