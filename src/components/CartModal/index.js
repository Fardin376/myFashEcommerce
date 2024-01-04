'use client';

import { Fragment, useContext, useEffect } from 'react';
import CommonModal from '../CommonModal';
import { GlobalContext } from '@/context';
import { deleteFromCart, getAllCartItems } from '@/services/cart';
import { toast } from 'react-toastify';
import ComponentLevelLoader from '../Loader/ComponentLevel';
import { useRouter } from 'next/navigation';

export default function CartModal() {
  const router = useRouter();

  const {
    showCartModal,
    setShowCartModal,
    cartItems,
    setCartItems,
    user,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  async function extractAllCartItems() {
    const res = await getAllCartItems(user?._id);

    if (res.success) {
      setCartItems(res.data);
      localStorage.setItem('cartItems', JSON.stringify(res.data));
    }

    console.log(res);
  }

  useEffect(() => {
    if (user !== null) {
      return extractAllCartItems;
    }
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

  return (
    <CommonModal
      showButtons={true}
      show={showCartModal}
      setShow={setShowCartModal}
      mainContent={
        cartItems && cartItems.length ? (
          <ul role="list" className="my-2 divide-y divide-gray-300">
            {cartItems.map((cartItem) => (
              <li key={cartItem.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={
                      cartItem &&
                      cartItem.productInfo &&
                      cartItem.productInfo.imageUrl
                    }
                    alt="Cart Item Image"
                    className="h-full w-full object-contain object-center"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <a>
                          {cartItem &&
                            cartItem.productInfo &&
                            cartItem.productInfo.name}
                        </a>
                      </h3>
                    </div>
                    <p>
                      $
                      {cartItem &&
                        cartItem.productInfo &&
                        cartItem.productInfo.price}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <button
                      type="button"
                      className="font-medium text-red-500 sm:order-2"
                      onClick={() => handleDeleteCartItem(cartItem._id)}
                    >
                      {componentLevelLoader &&
                      componentLevelLoader.loading &&
                      componentLevelLoader.id === cartItem._id ? (
                        <ComponentLevelLoader
                          text={'Removing from Cart'}
                          color={'#f44336'}
                          loading={
                            componentLevelLoader && componentLevelLoader.loading
                          }
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-6 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <h1 className="inline-flex items-center font-semibold gap-2 text-red-500">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </span>{' '}
            Your Cart is currently empty!
          </h1>
        )
      }
      buttonComponent={
        <Fragment>
          <button
            type="button"
            className="hoverEffect mt-1.5 flex w-full justify-center bg-black px-6 py-4 text-md font-medium uppercase tracking-wide text-white"
            onClick={() => {
              router.push('/cart');
              setShowCartModal(false);
            }}
          >
            Go To Cart
          </button>
          <button
            onClick={() => {
              router.push('/checkout');
              setShowCartModal(false);
            }}
            type="button"
            disabled={cartItems && cartItems.length === 0}
            className={`${
              cartItems && cartItems.length === 0 ? 'opacity-50' : 'hoverEffect'
            } mt-1.5 flex w-full justify-center bg-black px-6 py-4 text-md font-medium uppercase tracking-wide text-white`}
          >
            Checkout
          </button>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-600">
            <button
              onClick={() => {
                setShowCartModal(false);
                router.push('/product/listing/all-products');
              }}
              type="button"
              className="font-medium text-gray"
            >
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </div>
        </Fragment>
      }
    />
  );
}
