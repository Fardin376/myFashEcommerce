'use client';

import { GlobalContext } from '@/context';
import { toast } from 'react-toastify';
import { getAllCartItems, deleteFromCart } from '@/services/cart';
import { useContext, useEffect } from 'react';
import CartPageComp from '@/components/CartPageComp';
import { PulseLoader } from 'react-spinners';

export default function Cart() {
  const {
    user,
    setCartItems,
    cartItems,
    pageLevelLoader,
    setPageLevelLoader,
    setComponentLevelLoader,
    componentLevelLoader,
  } = useContext(GlobalContext);

  async function extractAllCartItems() {
    setPageLevelLoader(true);

    const res = await getAllCartItems(user?._id);

    if (res.success) {
      setTimeout(() => {
        setPageLevelLoader(false);

        setCartItems(res.data);
        localStorage.setItem('cartItems', JSON.stringify(res.data));
      }, 1000);
    }
  }

  useEffect(() => {
    if (user !== null) extractAllCartItems();
  }, [user]);

  async function handleDeleteCartItem(getCartItemID) {
    setComponentLevelLoader({ loading: true, id: getCartItemID });
    const res = await deleteFromCart(getCartItemID);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: '' });

      toast.success(res.message, {
        position: toast.POSITION.TOP_LEFT,
      });

      extractAllCartItems();
    } else {
      setComponentLevelLoader({ loading: false, id: '' });

      toast.error(res.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }

  if (pageLevelLoader) {
    return (
      <div className="my-2 w-full h-screen flex justify-center items-center">
        <PulseLoader
          color={'#000000'}
          loading={pageLevelLoader}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <CartPageComp
      handleDeleteCartItem={handleDeleteCartItem}
      componentLevelLoader={componentLevelLoader}
      cartItems={cartItems}
    />
  );
}
