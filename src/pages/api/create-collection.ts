// Importamos la conexión a la base de datos que hemos creado en el archivo items.ts
import { connection as db } from "@/pages/api/items";
// Importamos el tipo APIContext de Astro que nos permite manejar las solicitudes a la API
import type { APIContext } from "astro";
// Importamos RowDataPacket de mysql2/promise
import { type RowDataPacket } from "mysql2/promise";

export async function POST(context: APIContext) {
  // Parsea el cuerpo de la solicitud a JSON
  const body = await context.request.text();
  const { collectionName } = JSON
    .parse(body);

  // Comprobamos si los campos requeridos están vacíos
  if (
    !collectionName
  ) {
    return new Response(
      JSON.stringify({ message: "La colección no puede estar vacía" }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  }

  // Comprobamos si la colección ya existe
  const [collections] = await db.query<RowDataPacket[]>(
    "SELECT * FROM collections WHERE collection_name = ?",
    [collectionName],
  );

  if (collections.length > 0) {
    return new Response(
      JSON.stringify({ message: "La colección ya existe" }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  }

  // Inserta el nuevo elemento en la base de datos
  await db.query(
    "INSERT INTO collections (collection_name) VALUES (?)",
    [collectionName],
  );

  return new Response(
    JSON.stringify({ message: "Colección creada correctamente" }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    },
  );
}
