// Importamos el cliente de Cloudinary para obtener las imágenes
import { v2 as cloudinary } from "cloudinary";

// Configuramos el cliente de Cloudinary con las credenciales necesarias
cloudinary.config({
  cloud_name: "dle7lr00f",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Realizamos una petición a la API local para obtener los datos
const response = await fetch("http://localhost:4321/api/items");
const data = await response.json();

// Creamos un array para guardar las URL de las imágenes
const imagenesFront: string[] = [];
const imagenesBack: string[] = [];

// Añadimos todas las imágenes al array 'imagenes'
data.camisetas.map((camiseta) => {
  // Añadimos las imagenes frontales de las camisetas al array 'imagenesFront'
  imagenesFront.push(
    cloudinary.url(
      `${camiseta.item_img_name}-front`,
      { fetch_format: "auto", quality: "auto" },
    ),
  );

  // Añadimos las imagenes traseras de las camisetas al array 'imagenesBack'
  imagenesBack.push(
    cloudinary.url(
      `${camiseta.item_img_name}-back`,
      { fetch_format: "auto", quality: "auto" },
    ),
  );
});

export { imagenesBack, imagenesFront };
