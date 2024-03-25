import { addCartItem, isCartOpen } from '@/stores/cartStore';

export default function AddToCartForm({ children }) {
  // ¡usaremos valores fijos por simplicidad!
  const hardcodedItemInfo = {
    id: 'astronaut-figurine',
    name: 'Emblem Asteroid ',
    imageSrc: 'https://res.cloudinary.com/dle7lr00f/image/upload/v1709637639/emblem-barca-back',
  }

  function addToCart(e) {
    e.preventDefault();
    isCartOpen.set(true);
    addCartItem(hardcodedItemInfo);
  }

  return (
    <form onSubmit={addToCart}>
      {children}
    </form>
  )
}