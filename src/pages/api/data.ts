// Importamos el tipo APIRoute de Astro que nos permite realizar peticiones a la API
import { type APIRoute } from "astro";
// Importamos el cliente de MySQL para realizar la conexión a la base de datos y las consultas
import mysql from "mysql2/promise";

// Creamos la conexión a la base de datos
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "gestor_contenidos",
});

// Creamos la función GET que se encargará de obtener los datos de la base de datos y devolverlos
export const GET: APIRoute = async ({ request }) => {
  try {
    const [rows, fields] = await connection.execute(
      `SELECT * FROM alumnos`,
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
};
