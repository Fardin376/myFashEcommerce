'use client';

import InputComponent from '@/components/FormElements/InputComponent';
import SelectComponent from '@/components/FormElements/SelectComponent';
import { GlobalContext } from '@/context';
import { registerNewUser } from '@/services/register';
import { registrationFormControls } from '@/utils';
import { useRouter } from 'next/navigation';
import { useContext, useState, useEffect } from 'react';
import ComponentLevelLoader from '@/components/Loader/ComponentLevel';
import { toast } from 'react-toastify';
import Notification from '@/components/Notification';

const initialFormData = {
  name: '',
  email: '',
  password: '',
  role: 'customer',
};

export default function Register() {
  const [formData, setFormData] = useState(initialFormData);
  const [isRegistered, setIsRegistered] = useState(false);
  const { componentLevelLoader, setComponentLevelLoader, isAuthUser } =
    useContext(GlobalContext);

  const router = useRouter();

  console.log(formData);

  function isFormValid() {
    return formData &&
      formData.name &&
      formData.name.trim() !== '' &&
      formData.email &&
      formData.email.trim() !== '' &&
      formData.password &&
      formData.password.trim() !== ''
      ? true
      : false;
  }

  console.log(isFormValid());

  async function handleRegister() {
    setComponentLevelLoader({ loading: true, id: '' });

    const data = await registerNewUser(formData);

    if (data.success) {
      toast.success(data.message, {
        position: toast.POSITION.TOP_LEFT,
      });
      setIsRegistered(true);
      setComponentLevelLoader(false);
      setFormData(initialFormData);
    } else {
      toast.error(data.message, {
        position: toast.POSITION.TOP_LEFT,
      });
      setComponentLevelLoader({ loading: false, id: '' });
      setFormData(initialFormData);
    }

    console.log(data);
  }

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
                {isRegistered
                  ? 'Registration Successfull!'
                  : 'Sign up for an account'}
              </p>
              {isRegistered ? (
                <button
                  onClick={() => router.push('/login')}
                  className="inline-flex mt-1.5 w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide hover:outline-none hover:bg-slate-200 hover:text-black rounded-md"
                >
                  Login
                </button>
              ) : (
                <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                  {registrationFormControls.map((controlItem) =>
                    controlItem.componentType === 'input' ? (
                      <InputComponent
                        type={controlItem.type}
                        placeholder={controlItem.placeholder}
                        label={controlItem.label}
                        onChange={(ev) => {
                          setFormData({
                            ...formData,
                            [controlItem.id]: ev.target.value,
                          });
                        }}
                        value={formData[controlItem.id]}
                      />
                    ) : controlItem.componentType === 'select' ? (
                      <SelectComponent
                        options={controlItem.options}
                        label={controlItem.label}
                        onChange={(event) => {
                          setFormData({
                            ...formData,
                            [controlItem.id]: event.target.value,
                          });
                        }}
                        value={formData[controlItem.id]}
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
                    onClick={handleRegister}
                  >
                    {componentLevelLoader && componentLevelLoader.loading ? (
                      <ComponentLevelLoader
                        text={'Registering'}
                        color={'#000000'}
                        loading={
                          componentLevelLoader && componentLevelLoader.loading
                        }
                      />
                    ) : (
                      'Register'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}
