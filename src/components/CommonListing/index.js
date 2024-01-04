'use client';

import { useRouter } from 'next/navigation';
import ProductButton from './ProductButton';
import ProductTile from './ProductTile';
import { useContext, useEffect, useState } from 'react';
import Notification from '../Notification';
import { GlobalContext } from '@/context';
import { PulseLoader } from 'react-spinners';

export default function CommonListing({ data }) {
  const [pageLeveLoader, setPageLevelLoader] = useState(true);

  const router = useRouter();

  useEffect(() => {
    router.refresh();
    const timeoutId = setTimeout(() => {
      setPageLevelLoader(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {pageLeveLoader && (
          <div className="my-2 w-full h-screen flex justify-center items-center">
            <PulseLoader
              color={'#000000'}
              loading={pageLeveLoader}
              size={30}
              data-testid="loader"
            />
          </div>
        )}
        <div className="my-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16">
          {data && data.length
            ? data.map((item) => (
                <article
                  className="relative flex flex-col justify-between overflow-hidden border rounded-md shadow-sm cursor-pointer"
                  key={item._id}
                >
                  <ProductTile item={item} />

                  <ProductButton item={item} />
                </article>
              ))
            : null}
        </div>
        <Notification />
      </div>
    </section>
  );
}
