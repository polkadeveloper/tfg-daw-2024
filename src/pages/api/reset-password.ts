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
    return new Response(
      JSON.stringify({
        error: "passwords_do_not_match",
        message: "Las contraseñas no coinciden",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Regex para validar la contraseña con una longitud mínima de 8 caracteres, al menos una letra mayúscula, una letra minúscula y un dígito
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,100}$/;
  if (
    typeof password !== "string" || !passwordRegex.test(password)
  ) {
    // Si la contraseña no es válida, redirigimos al usuario a la página de registro con un mensaje de error
    return new Response(
      JSON.stringify({
        error: "invalid_password",
        message:
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un dígito",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const [oldPassword] = await db.query<RowDataPacket[]>(
    "SELECT user_password FROM users WHERE id = ?",
    [idUser],
  );

  const storedPassword = oldPassword[0]?.user_password || "";

  const isSamePassword = await new Scrypt().verify(
    storedPassword.toString(),
    password.toString(),
  );

  if (isSamePassword) {
    return new Response(
      JSON.stringify({
        error: "same_password",
        message: "La nueva contraseña no puede ser igual a la anterior",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const hashedPassword = await new Scrypt().hash(password);

  const [rows] = await db.query<RowDataPacket[]>(
    "UPDATE users SET user_password = ? WHERE id = ?",
    [hashedPassword, idUser],
  );

  if (rows.length === 0) {
    return new Response(
      JSON.stringify({
        error: "invalid_user",
        message: "El usuario no existe",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({
      success: "password_updated",
      message: "La contraseña ha sido actualizada correctamente",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
