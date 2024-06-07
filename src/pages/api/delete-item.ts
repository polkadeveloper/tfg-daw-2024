// Importamos la conexión a la base de datos que hemos creado en el archivo items.ts
import { connection as db } from "@/pages/api/items";
// Importamos el tipo APIContext de Astro que nos permite manejar las solicitudes a la API
import type { APIContext } from "astro";
// Importamos RowDataPacket de mysql2/promise
import { type RowDataPacket } from "mysql2/promise";

export async function POST(context: APIContext) {
  // Parsea el cuerpo de la solicitud a JSON
  const body = await context.request.text();
  const { item_name } = JSON.parse(body);

  if (!item_name) {
    return new Response(
      JSON.stringify({ message: "El nombre de la prenda es obligatorio" }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  }

  // Comprobamos si el item_name existe en la base de datos
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT item_id FROM items WHERE item_name = ?",
    [item_name],
  );

  // Si el item_name existe, lo eliminamos
  if (rows.length) {
    await db.query("DELETE FROM items WHERE item_id = ?", [rows[0].item_id]);
    return new Response(
      JSON.stringify({ message: "Prenda eliminada correctamente" }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  }
}
