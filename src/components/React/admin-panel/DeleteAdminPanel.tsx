import { useState, useEffect } from "react";
import "@/styles/noInputColor.css";
import { Toaster, toast } from "sonner";
import "@/styles/sonner.css";

function DeleteAdminPanel(props: any) {
  const [showDeleteItemsComponent, setShowDeleteItemsComponent] =
    useState(false);
  const [showDeleteCollectionsComponent, setShowDeleteCollectionsComponent] =
    useState(false);

  if (showDeleteItemsComponent) {
    return (
      <DeleteItemsDeletePanel
        setShowDeleteItemsComponent={setShowDeleteItemsComponent}
      />
    );
  }

  if (showDeleteCollectionsComponent) {
    return (
      <DeleteCollectionsDeletePanel
        setShowDeleteCollectionsComponent={setShowDeleteCollectionsComponent}
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
          onClick={() => setShowDeleteItemsComponent(true)}
          className="relative z-0 w-56 h-56 cursor-pointer flex justify-center items-center border-2 border-white rounded-lg overflow-hidden [&>article]:hover:scale-125 [&>div]:hover:bg-black/30"
        >
          <article
            style={{ backgroundImage: "url(img/fondo-borrar-camisetas.jpg)" }}
            className="absolute top-0 left-0 z-10 w-full h-full bg-center bg-cover bg-no-repeat overflow-hidden duration-500 transition-all ease-in-out"
          ></article>
          <div className="absolute bottom-0 top-0 z-10 h-full w-full bg-gradient-to-b from-transparent from-40% via-black/60 to-black/90 duration-300 transition-all ease-in-out"></div>
          <p className="absolute bottom-3 z-20 text-base uppercase font-cabinetGroteskBlack text-white tracking-wider text-center">
            Eliminar prendas
          </p>
        </section>

        <section
          onClick={() => setShowDeleteCollectionsComponent(true)}
          className="relative z-0 w-56 h-56 cursor-pointer flex justify-center items-center border-2 border-white rounded-lg overflow-hidden [&>article]:hover:scale-125 [&>div]:hover:bg-black/30"
        >
          <article
            style={{ backgroundImage: "url(img/fondo-borrar-colecciones.jpg)" }}
            className="absolute top-0 left-0 z-10 w-full h-full bg-center bg-cover bg-no-repeat overflow-hidden duration-500 transition-all ease-in-out"
          ></article>
          <div className="absolute bottom-0 top-0 z-10 h-full w-full bg-gradient-to-b from-transparent from-40% via-black/60 to-black/90 duration-300 transition-all ease-in-out"></div>
          <p className="absolute bottom-3 z-20 text-base uppercase font-cabinetGroteskBlack text-white tracking-wider text-center">
            Eliminar colecciones
          </p>
        </section>
      </section>
    </>
  );
}

function DeleteItemsDeletePanel(props: any) {
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

  const handleDelete = () => {
    fetch("/api/delete-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item_name: selectedItem }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message);
        fetchItems(); // Refetch items after deletion
      })
      .catch((error) => {
        toast.error("Error al eliminar la prenda");
      });
  };

  return (
    <>
      <button
        className="absolute top-5 left-5"
        onClick={() => props.setShowDeleteItemsComponent(false)}
      >
        Volver atrás
      </button>
      <h1 className="text-3xl text-center font-cabinetGroteskBold">
        Eliminar prendas
      </h1>
      <article className="w-[450px] h-32 cursor-pointer flex justify-center items-center gap-5 bg-black/30 border-2 border-white rounded-lg overflow-hidden">
        <select
          className="px-4 py-2 border-2 border-white rounded-lg"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          {items.map((item) => (
            <option key={item.item_id} value={item.item_name}>
              {item.item_name}
            </option>
          ))}
        </select>
        <button
          className="bg-red-500 border-2 border-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out"
          onClick={handleDelete}
        >
          Eliminar
        </button>
      </article>
      <Toaster position="top-right" expand={true} richColors theme="dark" />
    </>
  );
}

function DeleteCollectionsDeletePanel(props: any) {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  const fetchItems = () => {
    fetch("/api/collections")
      .then((response) => response.json())
      .then((data) => {
        setItems(data.collections);
      })
      .catch((error) => {
        console.error("Error fetching items", error);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = () => {
    fetch("/api/delete-collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collection_name: selectedItem }),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(data.message);
        fetchItems();
      })
      .catch((error) => {
        toast.error("Error al eliminar la prenda");
      });
  };

  return (
    <>
      <button
        className="absolute top-5 left-5"
        onClick={() => props.setShowDeleteCollectionsComponent(false)}
      >
        Volver atrás
      </button>
      <h1 className="text-3xl text-center font-cabinetGroteskBold">
        Eliminar colecciones
      </h1>
      <article className="w-[450px] h-32 cursor-pointer flex justify-center items-center gap-5 bg-black/30 border-2 border-white rounded-lg overflow-hidden">
        <select
          className="px-4 py-2 border-2 border-white rounded-lg"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          {items.map((collection) => (
            <option
              key={collection.collection_id}
              value={collection.collection_name}
            >
              {collection.collection_name}
            </option>
          ))}
        </select>
        <button
          className="bg-red-500 border-2 border-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out"
          onClick={handleDelete}
        >
          Eliminar
        </button>
      </article>
      <Toaster position="top-right" expand={true} richColors theme="dark" />
    </>
  );
}

export default DeleteAdminPanel;
