'use client';

import ComponentLevelLoader from '@/components/Loader/ComponentLevel';
import { GlobalContext } from '@/context';
import { addToCart } from '@/services/cart';
import { deleteProduct } from '@/services/product';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';
import { toast } from 'react-toastify';

export default function ProductButton({ item }) {
  const pathName = usePathname();
  const {
    setCurrentUpdatedProduct,
    componentLevelLoader,
    setComponentLevelLoader,
    user,
    setShowCartModal,
  } = useContext(GlobalContext);

  const router = useRouter();

  const isAdminView = pathName.includes('admin-view');

  async function handleDeleteProduct(item) {
    setComponentLevelLoader({ loading: true, id: item._id });

    const res = await deleteProduct(item._id);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: '' });

      toast.success(res.message, {
        position: toast.POSITION.TOP_LEFT,
      });

      router.refresh();
    } else {
      setComponentLevelLoader({ loading: false, id: '' });
      toast.error(res.message, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  }

  async function handleAddToCart(getItem) {
    setComponentLevelLoader({ loading: true, id: getItem._id });

    const res = await addToCart({ productInfo: getItem._id, userID: user._id });

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: '' });
      toast.success(res.message, {
        position: toast.POSITION.TOP_LEFT,
      });
      setShowCartModal(true);
    } else {
      setComponentLevelLoader({ loading: false, id: '' });
      toast.error(res.message, {
        position: toast.POSITION.TOP_LEFT,
      });
      setShowCartModal(true);
    }
  }

  return isAdminView ? (
    <div className="flex flex-col m-4">
      <button
        onClick={() => {
          setCurrentUpdatedProduct(item);
          router.push('/admin-view/add-product');
        }}
        className="hoverEffect mt-1.5 flex w-full justify-center bg-black px-6 py-4 text-md font-medium uppercase tracking-wide text-white"
      >
        Update
      </button>
      <button
        onClick={() => {
          handleDeleteProduct(item);
        }}
        className="hoverEffect mt-1.5 flex w-full justify-center bg-black px-6 py-4 text-md font-medium uppercase tracking-wide text-white"
      >
        {componentLevelLoader &&
        componentLevelLoader.loading &&
        item._id === componentLevelLoader.id ? (
          <ComponentLevelLoader
            text={'Deleting Product'}
            color={'#000000'}
            loading={componentLevelLoader && componentLevelLoader.loading}
          />
        ) : (
          'DELETE'
        )}
      </button>
    </div>
  ) : (
    <div className="flex flex-col m-4">
      <button
        onClick={() => handleAddToCart(item)}
        className="hoverEffect mt-1.5 flex w-full justify-center bg-black px-6 py-4 text-md font-medium uppercase tracking-wide text-white"
      >
        {componentLevelLoader &&
        componentLevelLoader.loading &&
        componentLevelLoader.id === item._id ? (
          <ComponentLevelLoader
            text={'Adding To Cart'}
            color={'#000000'}
            loading={componentLevelLoader && componentLevelLoader.loading}
          />
        ) : (
          'Add To Cart'
        )}
      </button>
    </div>
  );
}
