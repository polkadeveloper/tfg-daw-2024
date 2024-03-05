import express from "express";
import { handler as ssrHandler } from "./dist/server/entry.mjs";

const app = express();
// Modifica esto en función de la opción `base` de tu archivo astro.config.mjs.
// Deben coincidir. El valor predeterminado es "/".
const base = "/";
app.use(base, express.static("dist/client/"));
app.use(ssrHandler);


app.listen(8080);
