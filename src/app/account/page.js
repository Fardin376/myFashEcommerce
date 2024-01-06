'use client';

import InputComponent from '@/components/FormElements/InputComponent';
import ComponentLevelLoader from '@/components/Loader/ComponentLevel';
import Notification from '@/components/Notification';
import { GlobalContext } from '@/context';
import {
  addNewAddress,
  deleteAddress,
  getAllAddress,
  updateAddress,
} from '@/services/address';
import { addNewAddressFormControls } from '@/utils';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function Account() {
  const {
    user,
    addresses,
    setAddresses,
    addressFormData,
    setAddressFormData,
    componentLevelLoader,
    setComponentLevelLoader,
    pageLevelLoader,
    setPageLevelLoader,
  } = useContext(GlobalContext);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentUpdatedAddressId, setCurrentUpdatedAddressId] = useState(null);

  const router = useRouter();

  async function extractAllAddresses() {
    setPageLevelLoader(true);
    const res = await getAllAddress(user?._id);

    if (res.success) {
      setTimeout(() => {
        setPageLevelLoader(false);
        setAddresses(res.data);
      }, 1000);
    }
  }

  async function handleAddOrUpdateAddress() {
    setComponentLevelLoader({ loading: true, id: '' });
    const res =
      currentUpdatedAddressId !== null
        ? await updateAddress({
            ...addressFormData,
            _id: currentUpdatedAddressId,
          })
        : await addNewAddress({ ...addressFormData, userID: user?._id });

    console.log(res);

    if (res.success) {
      setTimeout(() => {
        setComponentLevelLoader({ loading: false, id: '' });
        toast.success(res.message, {
          position: toast.POSITION.TOP_LEFT,
        });
        setAddressFormData({
          fullName: '',
          address: '',
          city: '',
          country: '',
          postalCode: '',
        });
        extractAllAddresses();
        setCurrentUpdatedAddressId(null);
      }, 1000);
    } else {
      setComponentLevelLoader({ loading: false, id: '' });
      toast.error(res.message, {
        position: toast.POSITION.TOP_LEFT,
      });
      setAddressFormData({
        fullName: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
      });
    }
  }

  function handleUpdateAddress(getCurrentAddress) {
    setShowAddressForm(true);
    setAddressFormData({
      fullName: getCurrentAddress.fullName,
      address: getCurrentAddress.address,
      city: getCurrentAddress.city,
      country: getCurrentAddress.country,
      postalCode: getCurrentAddress.postalCode,
    });

    setCurrentUpdatedAddressId(getCurrentAddress._id);
  }

  async function handleDeleteAddress(getCurrentAddressId) {
    setComponentLevelLoader({ loading: true, id: getCurrentAddressId });

    const res = await deleteAddress(getCurrentAddressId);

    if (res.success) {
      setTimeout(() => {
        setComponentLevelLoader({ loading: false, id: '' });

        toast.success(res.message, {
          position: toast.POSITION.TOP_LEFT,
        });
        extractAllAddresses();
      }, 1000);
    } else {
      setComponentLevelLoader({ loading: false, id: '' });

      toast.error(res.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }

  useEffect(() => {
    if (user !== null) extractAllAddresses();
  }, [user]);

  return (
    <section className="h-screen">
      <div className="mx-auto bg-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow">
          <div className="p-6 sm:p-12">
            <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
              {/*render user image */}
            </div>

            <div className="flex flex-col flex-1">
              <h4 className="text-lg font-semibold text-center md:text-left">
                {user?.name}
              </h4>
              <p className="text-base font-medium text-gray-600">
                {user?.email}
              </p>
              <p className="text-base font-medium text-gray-600">
                {user?.role}
              </p>
            </div>

            <button
              onClick={() => router.push('/orders')}
              className="hoverEffect mt-5 inline-flex justify-center bg-black px-4 py-2 text-md font-medium uppercase tracking-wide text-white"
            >
              View your orders
            </button>

            <div className="mt-6">
              <h1 className="font-bold text-lg">Your addresses :</h1>
              {pageLevelLoader ? (
                <PulseLoader
                  color={'#000000'}
                  loading={pageLevelLoader}
                  size={15}
                  data-testid="loader"
                />
              ) : (
                <div className="mt-4 flex flex-col gap-2">
                  {addresses && addresses.length
                    ? addresses.map((item) => (
                        <div className="border gap-4 p-6" key={item._id}>
                          <p>Name: {item.fullName}</p>
                          <p>Address: {item.address}</p>
                          <p>City: {item.city}</p>
                          <p>Country: {item.country}</p>
                          <p>Postal Code: {item.postalCode}</p>
                          <button
                            onClick={() => handleUpdateAddress(item)}
                            className="hoverEffect mt-5 mr-2 inline-flex justify-center bg-black px-4 py-2 text-md font-medium uppercase tracking-wide text-white"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(item)}
                            className="hoverEffect mt-5 inline-flex justify-center bg-black px-4 py-2 text-md font-medium uppercase tracking-wide text-white"
                          >
                            {componentLevelLoader &&
                            componentLevelLoader.loading &&
                            componentLevelLoader.id === item._id ? (
                              <ComponentLevelLoader
                                text={'Deleting'}
                                color={'#000000'}
                                loading={
                                  componentLevelLoader &&
                                  componentLevelLoader.loading
                                }
                              />
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>
                      ))
                    : 'No addresses found. Please add a new address below'}
                </div>
              )}
            </div>

            <div className="mt-4">
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="hoverEffect mt-5 inline-flex justify-center bg-black px-4 py-2 text-md font-medium uppercase tracking-wide text-white"
              >
                {showAddressForm ? 'Hide Address form' : 'Add New Address'}
              </button>
            </div>

            {showAddressForm ? (
              <div className="flex flex-col mt-5 justify-center pt-4 items-center">
                <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
                  {addNewAddressFormControls.map((controlItem) => (
                    <InputComponent
                      type={controlItem.type}
                      label={controlItem.label}
                      placeholder={controlItem.placeholder}
                      value={addressFormData[controlItem.id]}
                      onChange={(ev) =>
                        setAddressFormData({
                          ...addressFormData,
                          [controlItem.id]: ev.target.value,
                        })
                      }
                    />
                  ))}
                </div>
                <button
                  onClick={handleAddOrUpdateAddress}
                  className="hoverEffect mt-5 inline-flex justify-center bg-black px-4 py-2 text-md font-medium uppercase tracking-wide text-white"
                >
                  {componentLevelLoader && componentLevelLoader.loading ? (
                    <ComponentLevelLoader
                      text={'Saving'}
                      color={'#000000'}
                      loading={
                        componentLevelLoader && componentLevelLoader.loading
                      }
                    />
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <Notification />
      </div>
    </section>
  );
}
