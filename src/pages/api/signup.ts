// Importamos las funciones y tipos necesarios de nuestras dependencias
import { lucia } from "@/auth";
import { generateId } from "lucia";
import { Scrypt } from "lucia";
import { connection as db } from "@/pages/api/items";
import type { APIContext } from "astro";
import type { RowDataPacket } from "mysql2/promise";

// Definimos una función asíncrona POST que será utilizada para manejar las solicitudes POST a nuestra API
export async function POST(context: APIContext): Promise<Response> {
  // Obtenemos los datos del formulario de la solicitud
  const formData = await context.request.formData();
  const username = formData.get("username");
  const firstName = formData.get("firstname");
  const lastName = formData.get("lastname");
  const email = formData.get("email");

  // Validamos el nombre de usuario
  if (
    typeof username !== "string" ||
    username.length < 6 ||
    username.length > 18 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    // Si el nombre de usuario no es válido, devolvemos una respuesta con un estado 400
    return context.redirect("/signup?error=invalid_username&toast=Error+al+crear+la+cuenta+,+intentalo+de+nuevo");
  }

  // Obtenemos y validamos la contraseña
  const password = formData.get("password");
  if (
    typeof password !== "string" || password.length < 8 || password.length > 100
  ) {
    // Si la contraseña no es válida, devolvemos una respuesta con un estado 400
    return context.redirect("/signup?error=invalid_password&toast=Error+al+crear+la+cuenta+,+intentalo+de+nuevo");
  }

  // Generamos un ID de usuario y una contraseña cifrada
  const userId = generateId(15);
  const hashedPassword = await new Scrypt().hash(password);
  console.log(hashedPassword); // Aquí puedes ver la contraseña cifrada que se almacenará en tu base de datos (¡no la muestres en producción!

  // Comprobamos si ya existe un usuario con el mismo nombre
  const [existingUser] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE user_name = ?",
    [username],
  );
  if (existingUser.length > 0) {
    // Si el usuario ya existe, devolvemos una respuesta con un estado 400
    return context.redirect("/signup?error=username_exists&toast=Error+al+crear+la+cuenta+,+intentalo+de+nuevo");
  }

  // validamos el email
  if (
    typeof email !== "string" ||
    email.length < 10 ||
    email.length > 100 ||
    !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)
  ) {
    // Si el email no es válido, devolvemos una respuesta con un estado 400
    return context.redirect("/signup?error=invalid_email&toast=Error+al+crear+la+cuenta+,+intentalo+de+nuevo");
  }

  // comprobamos si ya existe un usuario con el mismo email
  const [existingEmail] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE user_email = ?",
    [email],
  );

  if (existingEmail.length > 0) {
    // Si el email ya existe, devolvemos una respuesta con un estado 400
    return context.redirect("/signup?error=email_exists&toast=Error+al+crear+la+cuenta+,+intentalo+de+nuevo");
  }


  // Si el usuario no existe, lo insertamos en la base de datos
  await db.query(
    "INSERT INTO users (id, user_name, user_password, first_name, last_name, user_email) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, username, hashedPassword, firstName, lastName, email],
  );

  // Creamos una nueva sesión para el usuario y establecemos la cookie de sesión
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  // Redirigimos al usuario a la página de inicio
  return context.redirect("/?account=created");
}
