'use client';

import { GlobalContext } from '@/context';
import { getAllOrdersForUsers } from '@/services/order';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import Notification from '@/components/Notification';
import { useRouter } from 'next/navigation';

export default function Orders() {
  const {
    user,
    pageLevelLoader,
    setPageLevelLoader,
    allOrdersForUser,
    setAllOrdersForUser,
  } = useContext(GlobalContext);

  const router = useRouter();

  async function extractAllOrders() {
    setPageLevelLoader(true);

    const res = await getAllOrdersForUsers(user?._id);

    if (res.success) {
      setPageLevelLoader(false);

      setAllOrdersForUser(res.data);

      toast.success(res.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    } else {
      setPageLevelLoader(false);

      toast.error(res.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }

  useEffect(() => {
    if (user !== null) extractAllOrders();
  }, [user]);

  console.log(allOrdersForUser);

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
    <section className="h-auto">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-2 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div>
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="flow-root">
                {allOrdersForUser && allOrdersForUser.length ? (
                  <ul className="flex flex-col gap-4">
                    {allOrdersForUser.map((item) => (
                      <li
                        key={item._id}
                        className="bg-gray-50 shadow p-5 flex flex-col space-y-3 py-6 text-left"
                      >
                        <div className="flex">
                          <h1 className="font-bold text-lg mb-3 flex-1">
                            Order ID: {item._id}
                          </h1>
                          <div className="flex items-center">
                            <p className="mr-3 text-sm font-medium text-gray-900">
                              Total paid amount
                            </p>
                            <p className="mr-3 text-2xl  font-semibold text-gray-900">
                              ${item.totalPrice}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {item.orderItems.map((orderItem, index) => (
                            <div key={index} className="shrink-0">
                              <img
                                alt="Order Item"
                                className="h-24 w-24 max-w-full rounded-lg object-cover"
                                src={
                                  orderItem &&
                                  orderItem.product &&
                                  orderItem.product.imageUrl
                                }
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-5">
                          <button
                            disabled={item.isProcessing}
                            className={`${
                              !item.isProcessing ? 'bg-green-700' : ''
                            } mt-5 rounded-md flex justify-center bg-black px-6 py-4 text-md font-medium uppercase tracking-wide text-white`}
                          >
                            {item.isProcessing
                              ? 'Order is Processing'
                              : 'Order is delivered'}
                          </button>
                          <button
                            onClick={() => router.push(`/orders/${item._id}`)}
                            className="hoverEffect mt-5 flex justify-center bg-black px-6 py-4 text-md font-medium uppercase tracking-wide text-white"
                          >
                            View Order Details
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
                      <div className="bg-gray-50 shadow">
                        <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                          <h1 className="font-bold text-lg text-center">
                            You have not made any purchases yet
                          </h1>

                          <button
                            onClick={() =>
                              router.push('/product/listing/all-products')
                            }
                            className="hoverEffect mt-1.5 flex justify-center bg-black px-5 py-3 text-md font-medium uppercase tracking-wide text-white"
                          >
                            Shop NOW
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </section>
  );
}
