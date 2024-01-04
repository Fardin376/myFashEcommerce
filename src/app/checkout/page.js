'use client';

import Notification from '@/components/Notification';
import { GlobalContext } from '@/context';
import { getAllAddress } from '@/services/address';
import { createNewOrder } from '@/services/order';
import { callStripeSession } from '@/services/stripe';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function Checkout() {
  const {
    cartItems,
    user,
    addresses,
    setAddresses,
    checkOutFormData,
    setCheckOutFormData,
  } = useContext(GlobalContext);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [isOrderProcessing, setIsOrderProcessing] = useState(false);

  const [orderSuccess, setOrderSuccess] = useState(false);

  const params = useSearchParams();

  const router = useRouter();

  const publishableKey =
    'pk_test_51OUTgCLOqJLlb3XM2klvBrrVI1Zvvf7WB8Cgg74rbO1Bb0X4MJIil2NwHI6rhVj4DQHEftytMpQsTdCq6Ci0n1Xg00EViXkiZe';

  const stripePromise = loadStripe(publishableKey);

  async function getAllAddresses() {
    const res = await getAllAddress(user?._id);

    if (res.success) {
      setAddresses(res.data);
    }
  }

  useEffect(() => {
    if (user !== null) getAllAddresses();
  }, [user]);

  useEffect(() => {
    async function createFinalOrder() {
      const isStripe = JSON.parse(localStorage.getItem('stripe'));

      if (
        isStripe &&
        params.get('status') === 'success' &&
        cartItems &&
        cartItems.length > 0
      ) {
        setIsOrderProcessing(true);
        const getCheckoutFormData = JSON.parse(
          localStorage.getItem('checkOutFormData')
        );

        const createFinalCheckoutFormData = {
          user: user?._id,
          shippingAddress: getCheckoutFormData.shippingAddress,
          orderItems: cartItems.map((item) => ({
            qty: 1,
            product: item.productInfo,
          })),
          paymentMethod: 'Stripe',
          totalPrice: cartItems.reduce(
            (total, item) => item.productInfo.price + total,
            0
          ),
          isPaid: true,
          paidAt: new Date(),
          isProcessing: true,
        };

        const res = await createNewOrder(createFinalCheckoutFormData);

        if (res.success) {
          setIsOrderProcessing(false);
          setOrderSuccess(true);

          toast.success(res.message, {
            position: toast.POSITION.TOP_LEFT,
          });
        } else {
          setIsOrderProcessing(false);
          setOrderSuccess(false);

          toast.error(res.message, {
            position: toast.POSITION.TOP_LEFT,
          });
        }
      }
    }

    createFinalOrder();
  }, [params.get('status'), cartItems]);

  function handleSelectedAddress(getAddress) {
    if (getAddress._id === selectedAddress) {
      setSelectedAddress(null);
      setCheckOutFormData({
        ...checkOutFormData,
        shippingAddress: {},
      });

      return;
    }

    setSelectedAddress(getAddress._id);
    setCheckOutFormData({
      ...checkOutFormData,
      shippingAddress: {
        ...checkOutFormData.shippingAddress,
        fullName: getAddress.fullName,
        address: getAddress.address,
        city: getAddress.city,
        country: getAddress.country,
        postalCode: getAddress.postalCode,
      },
    });
  }

  async function handleCheckout() {
    const stripe = await stripePromise;

    const createLineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          images: [item.productInfo.imageUrl],
          name: item.productInfo.name,
        },
        unit_amount: item.productInfo.price * 100,
      },
      quantity: 1,
    }));

    const res = await callStripeSession(createLineItems);
    setIsOrderProcessing(true);
    localStorage.setItem('stripe', true);
    localStorage.setItem('checkOutFormData', JSON.stringify(checkOutFormData));

    const { error } = await stripe.redirectToCheckout({
      sessionId: res.id,
    });

    console.log(error);
  }

  console.log(checkOutFormData);

  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => {
        // setOrderSuccess(false);
        router.push('/orders');
      }, 2000);
    }
  }, [orderSuccess]);

  if (orderSuccess) {
    return (
      <section className="h-screen bg-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8 ">
            <div className="bg-white shadow">
              <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                <h1 className="font-bold text-lg">
                  Your payment is successfull and you will be redirected to
                  orders page in 2 seconds !
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isOrderProcessing) {
    return (
      <div className="my-2 w-full h-screen flex justify-center items-center">
        <PulseLoader
          color={'#000000'}
          loading={isOrderProcessing}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }


  return (
    <div className="mt-2">
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="font-medium text-xl">Cart Summary</p>
          <div className="mt-5 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-5">
            {cartItems && cartItems.length ? (
              cartItems.map((item) => (
                <div
                  className="flex flex-col rounded-lg bg-white sm:flex-row"
                  key={item._id}
                >
                  <img
                    src={item && item.productInfo && item.productInfo.imageUrl}
                    alt="cart product image"
                    className="m-2 h-24 w-28 object-cover object-center"
                  />

                  <div className="flex flex-col w-full px-4 py-4">
                    <span className="font-bold">
                      {item && item.productInfo && item.productInfo.name}
                    </span>
                    <span className="font-semibold">
                      $ {item && item.productInfo && item.productInfo.price}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div>Your cart is empty</div>
            )}
          </div>
        </div>

        <div className="p-2 m-8 rounded-lg bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Shipping address details</p>
          <p className="text-gray-400 font-bold">Select shipping address :</p>

          <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-6">
            {addresses && addresses.length
              ? addresses.map((item) => (
                  <div
                    onClick={() => handleSelectedAddress(item)}
                    className={`border p-6 ${
                      item._id === selectedAddress
                        ? 'border-2 border-green-700'
                        : ''
                    }`}
                    key={item._id}
                  >
                    <p>Name: {item.fullName}</p>
                    <p>Address: {item.address}</p>
                    <p>City: {item.city}</p>
                    <p>Country: {item.country}</p>
                    <p>Postal Code: {item.postalCode}</p>
                    <button
                      className={`${
                        item._id === selectedAddress
                          ? 'bg-green-700 rounded-lg'
                          : 'hoverEffect'
                      } mt-5 mr-2 inline-flex justify-center bg-black px-4 py-2 text-md font-medium uppercase tracking-wide text-white`}
                    >
                      {item._id === selectedAddress
                        ? 'Selected Address'
                        : 'Select Address'}
                    </button>
                  </div>
                ))
              : 'Shipping address is not added to your account'}
          </div>

          <button
            onClick={() => router.push('/account')}
            className="hoverEffect mt-5 mr-2 inline-flex justify-center bg-black px-4 py-2 text-md font-medium uppercase tracking-wide text-white"
          >
            Add New Address
          </button>

          <div className="mt-6 border-t border-b py-2 ">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Subtotal</p>
              <p className="text-lg font-bold text-gray-900">
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
              <p className="text-sm font-medium text-gray-900">Shipping</p>
              <p className="text-lg font-bold text-gray-900">Free</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-lg font-bold text-gray-900">
                ${' '}
                {cartItems && cartItems.length
                  ? cartItems.reduce(
                      (total, item) => item.productInfo.price + total,
                      0
                    )
                  : '0'}
              </p>
            </div>
          </div>

          <div className="pb-10">
            <button
              disabled={
                (cartItems && cartItems.length === 0) ||
                Object.keys(checkOutFormData.shippingAddress).length === 0
              }
              onClick={handleCheckout}
              className={`${
                (cartItems && cartItems.length === 0) ||
                Object.keys(checkOutFormData.shippingAddress).length === 0
                  ? 'opacity-50'
                  : 'hoverEffect'
              } mt-5 mr-2 w-full inline-flex justify-center bg-black px-4 py-2 text-md font-medium uppercase tracking-wide text-white`}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}
