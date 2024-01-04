  'use client';

  import { GlobalContext } from '@/context';
  import { useContext, useEffect } from 'react';
  import { addToCart } from '@/services/cart';
  import { toast } from 'react-toastify';
  import ComponentLevelLoader from '../Loader/ComponentLevel';
  import Notification from '../Notification';
  import { PulseLoader } from 'react-spinners';

  export default function CommonDetails({ item }) {
    const {
      setComponentLevelLoader,
      componentLevelLoader,
      user,
      setShowCartModal,
      pageLevelLoader,
      setPageLevelLoader,
    } = useContext(GlobalContext);

    async function handleAddToCart(getItem) {
      setComponentLevelLoader({ loading: true, id: '' });
      
      
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
    
    useEffect(() => {
      setPageLevelLoader(true)
      const timeoutId = setTimeout(() => {
        setPageLevelLoader(false);
      }, 2000);
  
      return () => clearTimeout(timeoutId);
    }, []);
    
    return (
      <section className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto px-4">
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
          <div className="lg:col-gap-12 xl:col-gap-12 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-12">
            <div className="lg:col-span-3 lg:row-end-1">
              <div className="lg:flex lg:items-start">
                <div className="lg:order-2 lg:ml-5">
                  <div className="max-w-xl overflow-hidden rounded-lg">
                    <img
                      src={item && item.imageUrl}
                      className="h-full w-full max-w-full object-cover"
                      alt="Product Image"
                    />
                  </div>
                </div>
                <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
                  <div className="flex flex-row items-start lg:flex-col">
                    <button
                      type="button"
                      className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-100 text-center"
                    >
                      <img
                        src={item && item.imageUrl}
                        className="h-full w-full object-cover"
                        alt="Prduct Image"
                      />
                    </button>
                    <button
                      type="button"
                      className="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-100 text-center"
                    >
                      <img
                        src={item && item.imageUrl}
                        className="h-full w-full object-cover"
                        alt="Prduct Image"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 lg:row-span-1 lg:row-end-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {item && item.name}
              </h1>
              <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
                <div className="flex flex-col items-start">
                  <h1
                    className={`text-3xl font-bold  ${
                      item && item.onSale === 'yes' ? 'line-through' : ''
                    }`}
                  >
                    $ {item && item.price}
                  </h1>

                  {item && item.onSale === 'yes' ? (
                    <h1 className="text-3xl font-bold text-green-600">{`$ ${(
                      item.price -
                      (item.price * item.priceDrop) / 100
                    ).toFixed(2)}`}</h1>
                  ) : null}

                  {item && item.onSale === 'yes' ? (
                    <h1 className="text-3xl font-bold">{`-${item.priceDrop}% off`}</h1>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium tracking wide uppercase text-white hoverEffect"
                >
                  {componentLevelLoader && componentLevelLoader.loading ? (
                    <ComponentLevelLoader
                      text={'Adding To Cart'}
                      color={'#000000'}
                      loading={
                        componentLevelLoader && componentLevelLoader.loading
                      }
                    />
                  ) : (
                    'Add To Cart'
                  )}
                </button>
              </div>
              <ul className="mt-8 space-y-2">
                <li className="flex items-center text-left text-sm font-medium text-gray-600">
                  {item && item.deliveryInfo}
                </li>
                <li className="flex items-center text-left text-sm font-medium text-gray-600">
                  Cancel Anytime
                </li>
              </ul>
              <div className="lg:col-span-3">
                <div className="border-b border-gray-400">
                  <nav className="flex gap-4">
                    <a
                      href="#"
                      className="border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900"
                    >
                      Description
                    </a>
                  </nav>
                </div>
                <div className="mt-8 flow-root sm:mt-12">
                  {item && item.description}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Notification />
      </section>
    );
  }
