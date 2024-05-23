import { type APIContext } from "astro";
import { connection as db } from "@/pages/api/items";
import { type RowDataPacket } from "mysql2/promise";

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const userId = formData.get("userId");
  const name = formData.get("name");
  const lastName = formData.get("lastName");
  const username = formData.get("username");
  const email = formData.get("email");
  const address = formData.get("address");
  const floor = formData.get("floor");
  const postalCode = formData.get("postalCode");
  const city = formData.get("city");
  const province = formData.get("province");
  const country = formData.get("country");

  // Comprobar que los campos no están vacíos
  if (
    !name || !lastName || !username || !email || !address ||
    !postalCode ||
    !city || !province || !country
  ) {
    return new Response(
      JSON.stringify({
        error: "empty_fields",
        message: "Por favor, rellena todos los campos",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Comprobar que el usuario nuevo no existe en la base de datos
  const [usernameExists] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE user_name = ? AND id != ?",
    [username, userId],
  );

  if (usernameExists.length > 0) {
    return new Response(
      JSON.stringify({
        error: "username_exists",
        message: "El nombre de usuario introducido ya existe",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Comprobar que el email nuevo no existe en la base de datos
  const [emailExists] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE user_email = ? AND id != ?",
    [email, userId],
  );

  if (emailExists.length > 0) {
    return new Response(
      JSON.stringify({
        error: "email_exists",
        message: "El email introducido ya está registrado",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Si nada falla, actualizamos la información del usuario
  const [rows] = await db.query<RowDataPacket[]>(
    "UPDATE users SET first_name = ?, last_name = ?, user_name = ?, user_email = ?, address = ?, floor = ?, postal_code = ?, city = ?, province = ?, country = ? WHERE id = ?",
    [
      name,
      lastName,
      username,
      email,
      address,
      floor,
      postalCode,
      city,
      province,
      country,
      userId,
    ],
  );

  if (rows.length === 0) {
    return new Response(
      JSON.stringify({
        error: "update_failed",
        message: "No se ha podido actualizar la información",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({
      success: "update_success",
      message: "Información actualizada correctamente",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
