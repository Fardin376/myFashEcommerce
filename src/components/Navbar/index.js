'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Fragment, useContext, useEffect } from 'react';
import { adminNavOptions, navOptions } from '@/utils';
import { GlobalContext } from '@/context';
import CommonModal from '../CommonModal';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import CartModal from '../CartModal';

function NavItems({ isModalView = false, isAdminView, router }) {
  return (
    <div
      className={`md:mx-auto items-center justify-between w-full md:flex md:w-auto ${
        isModalView ? '' : 'hidden'
      }`}
      id="nav-items"
    >
      <ul
        className={`flex flex-col p-4 md:p-0 mt-4 font-medium  rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-white ${
          isModalView ? 'border-none' : 'border border-gray-100'
        }`}
      >
        {isAdminView
          ? adminNavOptions.map((item) => (
              <li
                className="cursor-pointer block py-2 pl-3 pr-4 rounded md:p-0 text-gray-900"
                key={item.id}
                onClick={() => router.push(item.path)}
              >
                {item.label}
              </li>
            ))
          : navOptions.map((item) => (
              <li
                className="cursor-pointer block py-2 pl-3 pr-4 rounded md:p-0 text-gray-900"
                key={item.id}
                onClick={() => router.push(item.path)}
              >
                {item.label}
              </li>
            ))}
      </ul>
    </div>
  );
}

export default function Navbar() {
  const { showNavModal, setShowNavModal } = useContext(GlobalContext);
  const pathName = usePathname();

  const {
    user,
    isAuthUser,
    setIsAuthUser,
    setUser,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
    showCartModal,
    setShowCartModal,
  } = useContext(GlobalContext);

  const router = useRouter();

  function handleLogout() {
    setIsAuthUser(false);
    setUser(null);
    Cookies.remove('token');
    localStorage.clear();
    router.push('/');
  }

  useEffect(() => {
    if (
      pathName !== '/admin-view/add-product' &&
      currentUpdatedProduct !== null
    ) {
      setCurrentUpdatedProduct(null);
    }
  }, [pathName]);

  console.log(pathName);

  const isAdminView = pathName.includes('admin-view');

  return (
    <>
      <nav className="relative bg-white w-full z-20 top-0 left-0 shadow-sm border-b border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
          <div className="flex items-center">
            <Link href={'/'}>
              <Image src={'/logo.svg'} width={200} height={50} alt="logo" />
            </Link>
          </div>
          <div className="flex md:order-2 gap-2">
            {!isAdminView && isAuthUser ? (
              <Fragment>
                <button
                  className="linkButton hoverEffect"
                  onClick={() => router.push('/account')}
                >
                  Account
                </button>
                <button
                  className="linkButton hoverEffect"
                  onClick={() => setShowCartModal(true)}
                >
                  Cart
                </button>
              </Fragment>
            ) : null}
            {user?.role === 'admin' ? (
              isAdminView ? (
                <button
                  onClick={() => router.push('/')}
                  className="linkButton hoverEffect "
                >
                  Client View
                </button>
              ) : (
                <button
                  onClick={() => router.push('/admin-view')}
                  className="linkButton hoverEffect "
                >
                  Admin View
                </button>
              )
            ) : null}
            {isAuthUser ? (
              <button
                onClick={handleLogout}
                className="linkButton hoverEffect "
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push('/login');
                }}
                className="linkButton hoverEffect "
              >
                Login
              </button>
            )}
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center py-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 hover:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
              onClick={() => setShowNavModal(true)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
          <NavItems isAdminView={isAdminView} router={router} />
        </div>
      </nav>
      <CommonModal
        showModalTitle={false}
        mainContent={
          <NavItems
            router={router}
            isModalView={true}
            isAdminView={isAdminView}
          />
        }
        show={showNavModal}
        setShow={setShowNavModal}
      />
      {showCartModal && <CartModal />}
    </>
  );
}
