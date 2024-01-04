'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function CommonModal({
  mainTitle,
  mainContent,
  showButtons,
  buttonComponent,
  show,
  setShow,
  showModalTitle,
}) {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className={'relative overflow-y-auto z-50'}
        onClose={setShow}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in transition duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-out transition duration-1000"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <Transition.Child
                as={Fragment}
                enter="fade-in transition duration-[900ms]"
                enterFrom="opacity-10"
                enterTo="opacity-100"
                leave="fade-out transition duration-1000"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel className={'w-screen max-w-md'}>
                  <div className="flex flex-col bg-white rounded-lg overflow-hidden max-w-md w-full h-full mx-auto z-50">
                    <div className="flex-1 overflow-y-scroll py-4 px-6 sm:px-6">
                      {showModalTitle ? (
                        <div className="flex items-end justify-between">
                          <Dialog.Title>{mainTitle}</Dialog.Title>
                        </div>
                      ) : null}
                      <div className="mt-0">{mainContent}</div>
                    </div>
                    {showButtons ? (
                      <div className="border-t borer-gray-300 px-4 py-6 sm:px-6">
                        {buttonComponent}
                      </div>
                    ) : null}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
