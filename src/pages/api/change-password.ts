import { type APIContext } from "astro";
import { connection as db } from "@/pages/api/items";
import { type RowDataPacket } from "mysql2/promise";
import { Scrypt } from "lucia";

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const idUser = formData.get("idUser");
  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmNewPassword = formData.get("confirmNewPassword");

  if (newPassword !== confirmNewPassword) {
    return context.redirect(
      `/user-edit-password/?error=passwords_mismatch&toast=Error+al+cambiar+la+contrasena+,+intentalo+de+nuevo`,
    );
  }

  // Regex para validar la contraseña con una longitud mínima de 8 caracteres, al menos una letra mayúscula, una letra minúscula, un dígito y un carácter especial
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,100}$/;
  if (
    typeof newPassword !== "string" || !passwordRegex.test(newPassword)
  ) {
    // Si la contraseña no es válida, redirigimos al usuario a la página de registro con un mensaje de error
    return context.redirect(
      "/user-edit-password?error=invalid_password&toast=Error+al+cambiar+la+contrasena+,+intentalo+de+nuevo",
    );
  }
  const [oldPassword] = await db.query<RowDataPacket[]>(
    "SELECT user_password FROM users WHERE id = ?",
    [idUser],
  );

  const storedPassword = oldPassword[0]?.user_password || "";
  // Primero va el hash y luego la password en Scrypt
  const isCurrentPasswordCorrect = await new Scrypt().verify(
    storedPassword.toString(),
    currentPassword.toString(),
  );

  if (!isCurrentPasswordCorrect) {
    return context.redirect(
      `/user-edit-password/?error=incorrect_current_password&toast=Error+al+cambiar+la+contrasena+,+intentalo+de+nuevo`,
    );
  }

  if (storedPassword === newPassword) {
    return context.redirect(
      `/reset-password/?error=same_password&toast=Error+al+cambiar+la+contrasena+,+intentalo+de+nuevo`,
    );
  }

  const hashedPassword = await new Scrypt().hash(newPassword.toString());

  const [rows] = await db.query<RowDataPacket[]>(
    "UPDATE users SET user_password = ? WHERE id = ?",
    [hashedPassword, idUser],
  );

  if (rows.length === 0) {
    return context.redirect(
      `/reset-password/${idUser}?error=invalid_user&toast=Error+al+cambiar+la+contrasena+,+intentalo+de+nuevo`,
    );
  }

  return context.redirect(`/login?success=changed`);
}
