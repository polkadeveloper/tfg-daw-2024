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
    return context.redirect("/login?error=invalid_username");
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" || password.length < 8 || password.length > 100
  ) {
    return context.redirect("/login?error=invalid_password");
  }

  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE user_name = ?",
    [username.toLowerCase()],
  );
  if (rows.length === 0) {
    return context.redirect("/login?error=incorrect_credentials");
  }

  const existingUser = rows[0];
  if (!existingUser || !existingUser.user_password) {
    return context.redirect("/login?error=incorrect_credentials");
  }

  const validPassword = await new Scrypt().verify(
    existingUser.user_password,
    password,
  );
  if (validPassword === false) {
    return context.redirect("/login?error=incorrect_credentials");
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return context.redirect("/");
}