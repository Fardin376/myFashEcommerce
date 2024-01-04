'use client';

import { useRouter } from 'next/navigation';
import ComponentLevelLoader from '../Loader/ComponentLevel';

export default function CartPageComp({
  cartItems = [],
  handleDeleteCartItem,
  componentLevelLoader,
}) {
  const router = useRouter();

  return (
    <section className="-mt-4 h-screen bg-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mt-8 mb-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md  rounded-lg">
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="flow-root">
                {cartItems && cartItems.length ? (
                  <ul className="-my-8 border-b">
                    {cartItems.map((cartItem) => (
                      <li
                        className="flex-col flex space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0 "
                        key={cartItem.id}
                      >
                        <div className="shrink-0">
                          <img
                            src={
                              cartItem &&
                              cartItem.productInfo &&
                              cartItem.productInfo.imageUrl
                            }
                            alt="product image"
                            className="border h-24 w-25 max-w-full rounded-lg object-cover"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between items-start">
                          <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                            <div className="pr-8 sm:pr-4">
                              <p className="text-base font-semibold text-gray-900">
                                {cartItem &&
                                  cartItem.productInfo &&
                                  cartItem.productInfo.name}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-3 items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                          <p className="shrink-0 w-20 text-base font-semibold text-gray-950 sm:order-1 sm:ml-8 sm:text-right">
                            ${' '}
                            {cartItem &&
                              cartItem.productInfo &&
                              cartItem.productInfo.price}
                          </p>
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
                                  componentLevelLoader &&
                                  componentLevelLoader.loading
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
                )}
              </div>
              <div className="mt-6 border-t border-b py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">SubTotal</p>
                  <p className="text-lg text-gray-950 font-semibold">
                    ${' '}
                    {cartItems && cartItems.length
                      ? cartItems.reduce(
                          (total, item) => item.productInfo.price + total,
                          0
                        )
                      : '0'}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Shipping</p>
                  <p className="text-lg text-gray-950 font-semibold">$ 0</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-lg text-gray-950 font-semibold">
                    ${' '}
                    {cartItems && cartItems.length
                      ? cartItems.reduce(
                          (total, item) => item.productInfo.price + total,
                          0
                        )
                      : '0'}
                  </p>
                </div>

                <div className="mt-5 text-center">
                  <button
                    onClick={() => router.push('/checkout')}
                    type="button"
                    disabled={cartItems && cartItems.length === 0}
                    className={`${
                      cartItems && cartItems.length === 0
                        ? 'opacity-50'
                        : 'hoverEffect'
                    } group inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg font-medium uppercase tracking-wide text-white`}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
