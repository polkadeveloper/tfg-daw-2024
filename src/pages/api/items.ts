// Importamos el tipo APIRoute de Astro que nos permite realizar peticiones a la API
import { type APIRoute } from "astro";
// Importamos el cliente de MySQL para realizar la conexión a la base de datos y las consultas
import mysql from "mysql2/promise";

// Creamos la conexión a la base de datos
export const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "tfg-daw-2024",
});

// Creamos la función GET que se encargará de obtener los datos de la base de datos y devolverlos
export const GET: APIRoute = async ({ request }) => {
  let imagenes: string[] = [];
  try {
    const [rows, fields] = await connection.execute(
      `SELECT * FROM items`,
    );
    // Comprobamos si 'rows' es un array antes de intentar llamar a 'map' en él
    if (Array.isArray(rows)) {
      // Añadimos todas las imágenes al array 'imagenes'
      rows.map((row: any) => imagenes.push(row.item_img_name));
    }
    return new Response(
      JSON.stringify({ camisetas: rows, imagenes }),
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

