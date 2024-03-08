// Importamos el tipo APIRoute de Astro que nos permite realizar peticiones a la API
import { type APIRoute } from "astro";
// Importamos el cliente de MySQL para realizar la conexión a la base de datos y las consultas
import mysql from "mysql2/promise";

// Creamos la función GET que se encargará de obtener los datos de la base de datos y devolverlos
export const GET: APIRoute = async ({ request }) => {
  // Creamos la conexión a la base de datos
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "tfg-daw-2024",
  });

  try {
    const [rows, fields] = await connection.execute(`SELECT 
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
