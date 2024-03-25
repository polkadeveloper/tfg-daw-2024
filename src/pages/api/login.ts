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
    return context.redirect(
      "/login?error=invalid_username&toast=Error+al+iniciar+sesion",
    );
  }
  const password = formData.get("password");
  // Regex para validar la contraseña con una longitud mínima de 8 caracteres, al menos una letra mayúscula, una letra minúscula y un dígito
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,100}$/;
  if (
    typeof password !== "string" || !passwordRegex.test(password)
  ) {
    return context.redirect(
      "/login?error=invalid_password&toast=Error+al+iniciar+sesion",
    );
  }

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE user_name = ?",
    [username.toLowerCase()],
  );
  if (rows.length === 0) {
    return context.redirect(
      "/login?error=incorrect_credentials&toast=Error+al+iniciar+sesion",
    );
  }

  const existingUser = rows[0];
  if (!existingUser || !existingUser.user_password) {
    return context.redirect(
      "/login?error=incorrect_credentials&toast=Error+al+iniciar+sesion",
    );
  }

  const validPassword = await new Scrypt().verify(
    existingUser.user_password,
    password,
  );
  if (validPassword === false) {
    return context.redirect(
      "/login?error=incorrect_credentials&toast=Error+al+iniciar+sesion",
    );
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return context.redirect("/?account=logged");
}
