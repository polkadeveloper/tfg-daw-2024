// Definimos una función asincrónica para manejar el código con await

  // Realizamos una petición a la API local para obtener los datos
  const response = await fetch("http://localhost:4321/api/items");
  const data = await response.json();
  // Obtenemos la cantidad de camisetas de la base de datos
  const numeroCamisetas = data.camisetas.length;

  // Creamos un array de objetos a partir de los datos de las camisetas
  const camisetas = data.camisetas.map((camiseta: any) => ({
    itemId: camiseta.item_id,
    collectionId: camiseta.collection_id,
    itemName: camiseta.item_name,
    itemDescription: camiseta.item_description,
    itemPrice: camiseta.item_price,
    itemDiscounted: camiseta.item_discounted,
    itemImgName: camiseta.item_img_name
  }));

  console.log(camisetas);
  console.log(numeroCamisetas);


// Llamamos a la función asincrónica para ejecutar el código


export { camisetas, numeroCamisetas };