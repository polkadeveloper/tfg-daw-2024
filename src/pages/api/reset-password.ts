import { type APIRoute } from "astro";
import { type APIContext } from "astro";
import { connection as db } from "@/pages/api/items";
import { type RowDataPacket } from "mysql2/promise";
import { Scrypt } from "lucia";

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const password = formData.get("password");
  const repeatPassword = formData.get("repeatPassword");
  const idUser = formData.get("idUser");

  if (password !== repeatPassword) {
    return context.redirect(
      `/reset-password/${idUser}?error=passwords_mismatch&toast=Error+al+cambiar+la+contrasena+,+intentalo+de+nuevo`,
    );
  }

  // Regex para validar la contraseña con una longitud mínima de 8 caracteres, al menos una letra mayúscula, una letra minúscula y un dígito
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,100}$/;
  if (
    typeof password !== "string" || !passwordRegex.test(password)
  ) {
    // Si la contraseña no es válida, redirigimos al usuario a la página de registro con un mensaje de error
    return context.redirect(
      "/signup?error=invalid_password&toast=Error+al+cambiar+la+contrasena+,+intentalo+de+nuevo",
    );
  }

  const [oldPassword] = await db.query<RowDataPacket[]>(
    "SELECT user_password FROM users WHERE id = ?",
    [idUser],
  );

  const storedPassword = oldPassword[0]?.user_password || '';

  if (storedPassword === password) {
    return context.redirect(
      `/reset-password/${idUser}?error=same_password&toast=Error+al+cambiar+la+contrasena+,+intentalo+de+nuevo`,
    );
  }

  const hashedPassword = await new Scrypt().hash(password);

  const [rows] = await db.query<RowDataPacket[]>(
    "UPDATE users SET user_password = ? WHERE id = ?",
    [hashedPassword, idUser],
  );

  if (rows.length === 0) {
    return context.redirect(
      `/reset-password/${idUser}?error=invalid_user&toast=Error+al+cambiar+la+contrasena+,+intentalo+de+nuevo`,
    );
  }

  return context.redirect(`/login?password=changed`);
}
