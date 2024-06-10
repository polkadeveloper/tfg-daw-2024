// Importamos el tipo APIRoute de Astro que nos permite realizar peticiones a la API
import { type APIRoute } from "astro";
// Importamos la conexión a la base de datos que hemos creado en el archivo items.ts
import { connection as db } from "@/pages/api/items";

// Creamos la función GET que se encargará de obtener los datos de la base de datos y devolverlos
export const GET: APIRoute = async ({ params }) => {
  try {
    const id = params.id;

    console.log(id);

    const [rows] = await db.query(
      `SELECT collection_name FROM collections WHERE collection_id = ?;`,
      [id],
    );

    return new Response(
      JSON.stringify({ collection: rows }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error(error);
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
