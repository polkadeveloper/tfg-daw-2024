// Importamos el tipo APIRoute de Astro que nos permite realizar peticiones a la API
import { type APIRoute } from "astro";
// Importamos la conexión a la base de datos que hemos creado en el archivo items.ts
import { connection as db } from "@/pages/api/items";

// Creamos la función GET que se encargará de obtener los datos de la base de datos y devolverlos
export const GET: APIRoute = async ({ params, request }) => {
  try {
    const id = params.id;

    const [rows, fields] = await db.execute(
      `SELECT * 
      FROM transactions 
      INNER JOIN cart ON transactions.cart_id = cart.cart_id 
      INNER JOIN cart_items ON cart.cart_id = cart_items.cart_id 
      INNER JOIN items ON cart_items.item_id = items.item_id 
      WHERE cart.user_id = ?;`,
      [id],
    );

    return new Response(
      JSON.stringify({ orders: rows }),
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
