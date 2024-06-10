// Importamos el tipo APIRoute de Astro que nos permite realizar peticiones a la API
import { type APIRoute } from "astro";
// Importamos la conexión a la base de datos que hemos creado en el archivo items.ts
import { connection as db } from "@/pages/api/items";

// Creamos la función GET que se encargará de obtener los datos de la base de datos y devolverlos
export const GET: APIRoute = async ({ params }) => {
  try {
    const itemName = decodeURIComponent(params.itemName);

    console.log(itemName);

    const [rows] = await db.query(
      `SELECT items_sizes_stock.item_id, items_sizes_stock.size_id, items_sizes_stock.quantity FROM items_sizes_stock INNER JOIN items on items_sizes_stock.item_id = items.item_id WHERE items.item_name = ?;`,
      [itemName],
    );

    return new Response(
      JSON.stringify({ sizes: rows }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error al obtener los datos" }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  }
};
