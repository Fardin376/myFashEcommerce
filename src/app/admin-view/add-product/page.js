'use client';

import InputComponent from '@/components/FormElements/InputComponent';
import SelectComponent from '@/components/FormElements/SelectComponent';
import TileComponent from '@/components/FormElements/TileComponent';
import ComponentLevelLoader from '@/components/Loader/ComponentLevel';
import Notification from '@/components/Notification';
import { GlobalContext } from '@/context';
import { addNewProduct, updateProduct } from '@/services/product';
import {
  AvailableSizes,
  adminAddProductformControls,
  firebaseConfig,
  firebaseStroageURL,
} from '@/utils';
import { initializeApp } from 'firebase/app';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const app = initializeApp(firebaseConfig);

const storage = getStorage(app, firebaseStroageURL);

const createUniqueFileName = (getFile) => {
  const timeStamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);

  return `${getFile.name}-${timeStamp}-${randomStringValue}`;
};

async function helperForUploadingImageToFirebase(file) {
  const getFileName = createUniqueFileName(file);
  const storageReference = ref(storage, `myFash/${getFileName}`);
  const uploadImage = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      'state_changed',
      (snapshot) => {},
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
}

const initialFormData = {
  name: '',
  price: 0,
  description: '',
  category: 'men',
  deliveryInfo: '',
  onSale: 'no',
  sizes: [],
  imageUrl: '',
  priceDrop: 0,
};

export default function AdminAddNewProduct() {
  const [formData, setFormData] = useState(initialFormData);
  const {
    componentLevelLoader,
    setComponentLevelLoader,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
    pageLevelLoader,
    setPageLevelLoader,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (currentUpdatedProduct !== null) setFormData(currentUpdatedProduct);
  }, [currentUpdatedProduct]);

  console.log(currentUpdatedProduct);

  const router = useRouter();

  async function handleImage(ev) {
    const extractImageURL = await helperForUploadingImageToFirebase(
      ev.target.files[0]
    );

    if (extractImageURL !== '') {
      setFormData({
        ...formData,
        imageUrl: extractImageURL,
      });
    }
  }

  function handleTileClick(getCurrentItem) {
    let copySizes = [...formData.sizes];
    const index = copySizes.findIndex((item) => item.id === getCurrentItem.id);

    if (index === -1) {
      copySizes.push(getCurrentItem);
    } else {
      copySizes = copySizes.filter((item) => item.id !== getCurrentItem.id);
    }

    setFormData({
      ...formData,
      sizes: copySizes,
    });
  }

  async function handleAddProduct() {
    setComponentLevelLoader({ loading: true, id: '' });

    const res =
      currentUpdatedProduct !== null
        ? await updateProduct(formData)
        : await addNewProduct(formData);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: '' });

      toast.success(res.message, {
        position: toast.POSITION.TOP_LEFT,
      });

      setCurrentUpdatedProduct(null);

      setFormData(initialFormData);

      setTimeout(() => {
        router.push('/admin-view/all-products');
      }, 1000);
    } else {
      setComponentLevelLoader({ loading: false, id: '' });
      toast.error(res.message, {
        position: toast.POSITION.TOP_LEFT,
      });
      setFormData(initialFormData);
    }

    console.log(res);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPageLevelLoader(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="w-full mt-5 mr-0 mb-0 ml-0 relative">
      {pageLevelLoader && (
        <div className="my-2 w-full h-screen flex justify-center items-center">
          <PulseLoader
            color={'#000000'}
            loading={pageLevelLoader}
            size={30}
            data-testid="loader"
          />
        </div>
      )}
      <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
        <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
          <input
            accept="image/*"
            max="1000000"
            type="file"
            onChange={handleImage}
          />

          <div className="flex gap-2 flex-col">
            <label>Sizes Available:</label>
            <TileComponent
              selected={formData.sizes}
              onClick={handleTileClick}
              data={AvailableSizes}
            />
          </div>

          {adminAddProductformControls.map((controlItem) =>
            controlItem.componentType === 'input' ? (
              <InputComponent
                type={controlItem.type}
                placeholder={controlItem.placeholder}
                label={controlItem.label}
                value={formData[controlItem.id]}
                onChange={(ev) => {
                  setFormData({
                    ...formData,
                    [controlItem.id]: ev.target.value,
                  });
                }}
              />
            ) : controlItem.componentType === 'select' ? (
              <SelectComponent
                options={controlItem.options}
                label={controlItem.label}
                value={formData[controlItem.id]}
                onChange={(ev) => {
                  setFormData({
                    ...formData,
                    [controlItem.id]: ev.target.value,
                  });
                }}
              />
            ) : null
          )}

          <button
            onClick={handleAddProduct}
            className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide hover:outline-none hover:bg-slate-200 hover:text-black rounded-md"
          >
            {componentLevelLoader && componentLevelLoader.loading ? (
              <ComponentLevelLoader
                text={
                  currentUpdatedProduct !== null
                    ? 'Updating Product'
                    : 'Adding Product'
                }
                color={'#000000'}
                loading={componentLevelLoader && componentLevelLoader.loading}
              />
            ) : currentUpdatedProduct !== null ? (
              'Update Product'
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </div>
      <Notification />
    </div>
  );
}
