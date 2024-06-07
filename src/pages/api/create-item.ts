// Importamos la conexión a la base de datos que hemos creado en el archivo items.ts
import { connection as db } from "@/pages/api/items";
// Importamos el tipo APIContext de Astro que nos permite manejar las solicitudes a la API
import type { APIContext } from "astro";
// Importamos RowDataPacket de mysql2/promise
import { type RowDataPacket } from "mysql2/promise";
// Importamos ResultSetHeader de mysql2/promise
import { type ResultSetHeader } from "mysql2/promise";

export async function POST(context: APIContext) {
  // Parsea el cuerpo de la solicitud a JSON
  const body = await context.request.text();
  const { itemName, imageName, description, stock, price, collection } = JSON
    .parse(body);
  const sizeKeys = ["XS", "S", "M", "L", "XL"];

  // Comprobamos si los campos requeridos están vacíos
  if (
    !itemName || !imageName || !description || !stock || !price || !collection
  ) {
    return new Response(
      JSON.stringify({ message: "Todos los campos son obligatorios" }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  }

  // Obtener el id de la colección
  const [collectionId] = await db.query<RowDataPacket[]>(
    "SELECT collection_id FROM collections WHERE collection_name = ?",
    [collection],
  );

  // Si la colección no existe, devolver un error
  if (!collectionId) {
    return new Response(
      JSON.stringify({ message: "La colección no existe" }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  }

  // Obtener el id del último item
  const [lastItemId] = await db.query<RowDataPacket[]>(
    "SELECT item_id FROM items ORDER BY item_id DESC LIMIT 1",
  );

  // Inserta el nuevo elemento en la base de datos
  const [result] = await db.query(
    "INSERT INTO items (item_id, item_name, item_img_name, item_description, item_price, collection_id) VALUES (?, ?, ?, ?, ?, ?)",
    [
      lastItemId[0].item_id + 1,
      itemName,
      imageName,
      description,
      price,
      collectionId[0].collection_id,
    ],
  );

  // Haz un casting explícito de `result` a `ResultSetHeader`
  const itemId = (result as ResultSetHeader).insertId;

  for (let i = 0; i < sizeKeys.length; i++) {
    await db.query(
      "INSERT INTO items_sizes_stock (item_id, size_id, quantity) VALUES (?, ?, ?)",
      [
        itemId,
        i + 1,
        stock[sizeKeys[i]],
      ],
    );
  }

  return new Response(
    JSON.stringify({ message: "Prenda creada correctamente" }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    },
  );
}
