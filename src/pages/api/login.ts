// pages/api/login.ts
import { lucia } from "@/auth";
import { Scrypt } from "lucia";
import type { APIContext } from "astro";
import { connection as db } from "@/pages/api/items";
import type { RowDataPacket } from "mysql2/promise";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 6 ||
    username.length > 18 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return new Response(
      JSON.stringify({
        error: "invalid_username",
        message:
          "El nombre de usuario debe tener entre 6 y 18 caracteres y solo puede contener letras minúsculas, números, guiones bajos y guiones medios",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  const password = formData.get("password");
  // Regex para validar la contraseña con una longitud mínima de 8 caracteres, al menos una letra mayúscula, una letra minúscula y un dígito
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,100}$/;
  if (
    typeof password !== "string" || !passwordRegex.test(password)
  ) {
    return new Response(
      JSON.stringify({
        error: "invalid_password",
        message:
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un dígito",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE user_name = ?",
    [username.toLowerCase()],
  );
  if (rows.length === 0) {
    return new Response(
      JSON.stringify({
        error: "user_not_found",
        message: "El usuario no existe",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const existingUser = rows[0];
  if (!existingUser || !existingUser.user_password) {
    return new Response(
      JSON.stringify({
        error: "incorrect_credentials",
        message: "Credenciales incorrectas",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const validPassword = await new Scrypt().verify(
    existingUser.user_password,
    password,
  );
  if (validPassword === false) {
    return new Response(
      JSON.stringify({
        error: "incorrect_credentials",
        message: "Credenciales incorrectas",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return new Response(
    JSON.stringify({
      success: "login_success",
      message: "Inicio de sesión exitoso",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
