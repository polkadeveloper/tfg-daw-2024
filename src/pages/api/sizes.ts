// Importamos el tipo APIRoute de Astro que nos permite realizar peticiones a la API
import { type APIRoute } from "astro";
import { connection as db } from "@/pages/api/items";

// Creamos la función GET que se encargará de obtener los datos de la base de datos y devolverlos
export const GET: APIRoute = async ({ request }) => {
  try {
    const [rows, fields] = await db.execute(`SELECT 
    items.item_id,
    items_sizes_stock.size_id,
    items_sizes_stock.quantity AS stock_quantity,
    items_sizes_stock.out_of_stock,
    sizes.size_name
FROM 
    items
INNER JOIN 
    items_sizes_stock ON items.item_id = items_sizes_stock.item_id
INNER JOIN 
    sizes ON items_sizes_stock.size_id = sizes.size_id
ORDER BY 
    items.item_id, items_sizes_stock.size_id;

`);
    return new Response(JSON.stringify({ tallas: rows }), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
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
