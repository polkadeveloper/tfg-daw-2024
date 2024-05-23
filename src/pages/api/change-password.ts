import { type APIContext } from "astro";
import { connection as db } from "@/pages/api/items";
import { type RowDataPacket } from "mysql2/promise";
import { Scrypt } from "lucia";
// Importamos resend
import { Resend } from "resend";
// Importamos dotenv para poder acceder a las variables de entorno
import "dotenv/config";
// Creamos una instancia de resend
const resend = new Resend(process.env.RESEND_API_KEY);
// Importamos el Email template que hemos creado en React
import { EmblemPasswordChanged } from "@/components/React/emails/PasswordChangedTemplate";

export async function POST(context: APIContext) {
  const formData = await context.request.formData();
  const idUser = formData.get("idUser");
  const currentPassword = formData.get("currentPassword");
  const newPassword = formData.get("newPassword");
  const confirmNewPassword = formData.get("confirmNewPassword");

  if (newPassword !== confirmNewPassword) {
    return new Response(
      JSON.stringify({
        error: "passwords_do_not_match",
        message: "Las contraseñas no coinciden",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Regex para validar la contraseña con una longitud mínima de 8 caracteres, al menos una letra mayúscula, una letra minúscula, un dígito y un carácter especial
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,100}$/;
  if (
    typeof newPassword !== "string" || !passwordRegex.test(newPassword)
  ) {
    // Si la contraseña no es válida, redirigimos al usuario a la página de registro con un mensaje de error
    return new Response(
      JSON.stringify({
        error: "invalid_password",
        message:
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un dígito y un carácter especial",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  const [oldPassword] = await db.query<RowDataPacket[]>(
    "SELECT user_password FROM users WHERE id = ?",
    [idUser],
  );

  const storedPassword = oldPassword[0]?.user_password || "";

  // Primero va el hash y luego la password en Scrypt
  const isSamePassword = await new Scrypt().verify(
    storedPassword.toString(),
    newPassword.toString(),
  );

  // Primero va el hash y luego la password en Scrypt
  const isCurrentPasswordCorrect = await new Scrypt().verify(
    storedPassword.toString(),
    currentPassword.toString(),
  );

  if (!isCurrentPasswordCorrect) {
    return new Response(
      JSON.stringify({
        error: "incorrect_password",
        message: "La contraseña actual es incorrecta",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (isSamePassword) {
    return new Response(
      JSON.stringify({
        error: "same_password",
        message: "La nueva contraseña no puede ser igual a la anterior",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const hashedPassword = await new Scrypt().hash(newPassword.toString());

  const [rows] = await db.query<RowDataPacket[]>(
    "UPDATE users SET user_password = ? WHERE id = ?",
    [hashedPassword, idUser],
  );

  // Obtenemos el nombre de usuario del usuario
  const [username] = await db.query<RowDataPacket[]>(
    "SELECT user_name FROM users WHERE id = ?",
    [idUser],
  );

  if (rows.length === 0) {
    return new Response(
      JSON.stringify({
        error: "update_failed",
        message: "No se ha podido actualizar la contraseña",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  // Enviamos un correo electrónico al usuario con un enlace para restablecer la contraseña
  await resend.emails.send({
    from: "Polkadev <alvarobarcena@polkadev.es>",
    to: ["alvarobarcena27@gmail.com"],
    subject: "Has cambiado tu contraseña en Emblem",
    react: EmblemPasswordChanged({
      username: username[0]?.user_name || "",
      updatedDate: new Date(),
    }),
  });

  return new Response(
    JSON.stringify({
      error: "success_password_update",
      message: "La contraseña se ha actualizado correctamente",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
