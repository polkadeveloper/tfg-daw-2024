// Realizamos una petición a la API local para obtener los datos
const response = await fetch("http://localhost:4321/api/sizes");
const data = await response.json();

// Creamos un array de objetos a partir de los datos de las camisetas
const tallas = data.tallas.map((talla: any) => ({
  itemId: talla.item_id,
  sizeId: talla.size_id,
  stockQuantity: talla.stock_quantity,
  sizeName: talla.size_name,
  outOfStock: talla.out_of_stock,
}));

const realLength = tallas.length / 5;

console.log(realLength);

// Creamos un array para almacenar los resultados
const arrayTallasPorItemId = [];

for (let i = 1; i <= realLength; i++) {
  // Filtramos las tallas para el itemId actual
  const tallasFiltradas = tallas.filter((talla) => talla.itemId === i);

  // Añadimos las tallas filtradas al array
  arrayTallasPorItemId.push({
    itemId: i,
    tallas: tallasFiltradas,
  });
}

export { arrayTallasPorItemId };