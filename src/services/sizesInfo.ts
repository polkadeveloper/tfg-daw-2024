async function getSizesInfo() {
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

  // Crear un conjunto de todos los itemId únicos
  const uniqueItemIds = new Set(tallas.map((talla) => talla.itemId));

  const arrayTallasPorItemId = [];

  // Iterar sobre cada itemId único
  for (let itemId of uniqueItemIds) {
    const tallasFiltradas = tallas.filter((talla) => talla.itemId === itemId);
    arrayTallasPorItemId.push({
      itemId: itemId,
      tallas: tallasFiltradas,
    });
  }

  return arrayTallasPorItemId;
}

export { getSizesInfo };
