// Importamos el tipo APIContext de Astro que nos permite manejar las solicitudes a la API
import type { APIContext } from "astro";
// Importamos el cliente de MySQL para realizar la conexión a la base de datos y las consultas
import { connection as db } from "@/pages/api/items";

// Creamos la función GET que se encargará de obtener los datos de la base de datos y devolverlos
export async function GET(context: APIContext) {
  let imagenes: string[] = [];
  try {
    const [rows] = await db.execute(
      `SELECT * FROM items LIMIT 3;`,
    );

    return new Response(
      JSON.stringify({ camisetas: rows }),
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
}
