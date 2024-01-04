'use client';

import InputComponent from '@/components/FormElements/InputComponent';
import { GlobalContext } from '@/context';
import { loginUser } from '@/services/login';
import { loginFormControls } from '@/utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import ComponentLevelLoader from '@/components/Loader/ComponentLevel';
import { toast } from 'react-toastify';
import Notification from '@/components/Notification';

const initialFormData = {
  email: '',
  password: '',
};

export default function Login() {
  const [formData, setFormData] = useState(initialFormData);

  const {
    isAuthUser,
    setIsAuthUser,
    user,
    setUser,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  const router = useRouter();

  console.log(formData);

  function isFormValid() {
    return formData &&
      formData.email &&
      formData.email.trim() !== '' &&
      formData.password &&
      formData.password.trim() !== ''
      ? true
      : false;
  }

  async function handleLogin() {
    setComponentLevelLoader({ loading: true, id: '' });
    const response = await loginUser(formData);

    console.log(response);

    if (response.success) {
      toast.success(response.message, {
        position: toast.POSITION.TOP_LEFT,
      });
      setIsAuthUser(true);
      setUser(response?.finalData?.user);
      setFormData(initialFormData);
      Cookies.set('token', response?.finalData?.token);
      localStorage.setItem('user', JSON.stringify(response?.finalData?.user));
      setComponentLevelLoader({ loading: false, id: '' });
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_LEFT,
      });
      setIsAuthUser(false);
      setComponentLevelLoader({ loading: false, id: '' });
    }
  }

  console.log(isAuthUser, user);

  useEffect(() => {
    if (isAuthUser) {
      router.push('/');
    }
  }, [isAuthUser]);

  return (
    <div className="bg-white relative">
      <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 mr-auto xl:px-5 lg:flex-row">
        <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
          <div className="w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
            <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
              <p className="w-full text-4xl font-medium text-center font-serif">
                Login
              </p>

              <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                {loginFormControls.map((controlItem) =>
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
                  ) : null
                )}
                <button
                  className={`${
                    !isFormValid()
                      ? 'opacity-50'
                      : 'hover:outline-none hover:bg-slate-200 hover:text-black'
                  } inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide  rounded-md`}
                  disabled={!isFormValid()}
                  onClick={handleLogin}
                >
                  {componentLevelLoader && componentLevelLoader.loading ? (
                    <ComponentLevelLoader
                      text={'Logging In'}
                      color={'#000000'}
                      loading={
                        componentLevelLoader && componentLevelLoader.loading
                      }
                    />
                  ) : (
                    'Login'
                  )}
                </button>

                <div className="flex flex-col gap-2">
                  <p>New to website?</p>
                  <button
                    className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide hover:outline-none hover:bg-slate-200 hover:text-black rounded-md"
                    onClick={() => router.push('/register')}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}
