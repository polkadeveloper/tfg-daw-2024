// Importamos el tipo APIRoute de Astro que nos permite realizar peticiones a la API
import { type APIRoute } from "astro";
// Importamos la conexión a la base de datos que hemos creado en el archivo items.ts
import { connection as db } from "@/pages/api/items";

// Creamos la función GET que se encargará de obtener los datos de la base de datos y devolverlos
export const GET: APIRoute = async ({ params }) => {
  try {
    const collectionName = params.collectionName;

    console.log(collectionName);

    const [rows] = await db.execute(
      `SELECT * FROM items INNER JOIN collections on items.collection_id = collections.collection_id WHERE collections.collection_name = ?;`,
      [collectionName],
    );

    return new Response(
      JSON.stringify({ items: rows }),
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
