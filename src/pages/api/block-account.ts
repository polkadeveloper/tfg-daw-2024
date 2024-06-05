import { type APIContext } from "astro";
import { connection as db } from "@/pages/api/items";
import { type RowDataPacket } from "mysql2/promise";

export async function POST(context: APIContext) {
  // Parsea el cuerpo de la solicitud a JSON
  const body = await context.request.text();
  const { id, status } = JSON.parse(body);

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT loginAttempts FROM users WHERE id = ?
    `,
      [id],
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ message: "Usuario no encontrado" }),
        { status: 400 },
      );
    }

    let { loginAttempts } = rows[0];

    // Si el estado es 'logged', restablece loginAttempts a 5 y retorna
    if (status === "logged") {
      loginAttempts = 5;

      await db.query(
        `
        UPDATE users SET loginAttempts = ? WHERE id = ?
      `,
        [loginAttempts, id],
      );

      return new Response(
        JSON.stringify({ message: "Usuario autenticado", loginAttempts }),
        {
          status: 200,
        },
      );
    }

    // Si loginAttempts - 1 es 0, bloquea la cuenta y establece loginAttempts a 0
    if (loginAttempts - 1 === 0) {
      loginAttempts = 0;

      await db.query(
        `
        UPDATE users SET status = 'blocked', loginAttempts = ? WHERE id = ?
      `,
        [loginAttempts, id],
      );

      return new Response(
        JSON.stringify({ message: "Usuario bloqueado", loginAttempts }),
        {
          status: 200,
        },
      );
    }

    // Si loginAttempts es mayor a 1, decrementa el número de intentos de inicio de sesión fallidos
    if (loginAttempts > 1) {
      loginAttempts--;

      // Actualiza el número de intentos de inicio de sesión fallidos en la base de datos
      await db.query(
        `
        UPDATE users SET loginAttempts = ? WHERE id = ?
      `,
        [loginAttempts, id],
      );

      // Recupera el número actualizado de intentos de inicio de sesión fallidos
      const [updatedRows] = await db.query<RowDataPacket[]>(
        `
        SELECT loginAttempts FROM users WHERE id = ?
      `,
        [id],
      );

      loginAttempts = updatedRows[0].loginAttempts;

      return new Response(
        JSON.stringify({ loginAttempts }),
        { status: 200 },
      );
    }

    if (loginAttempts === 0) {
      await db.query(
        `
        UPDATE users SET status = 'blocked' WHERE id = ?
      `,
        [id],
      );

      return new Response(
        JSON.stringify({ message: "Usuario bloqueado", loginAttempts }),
        {
          status: 200,
        },
      );
    }

    return new Response(JSON.stringify({ message: "Usuario no bloqueado" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error del servidor" }), {
      status: 500,
    });
  }
}
