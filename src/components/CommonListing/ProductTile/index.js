'use client';

import { useRouter } from 'next/navigation';

export default function ProductTile({ item }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/product/${item._id}`)}
      className="flex flex-col justify-between"
    >
      <div className="overflow-hidden aspect-w-1 aspect-h-1 h-52">
        <img
          src={item.imageUrl}
          alt="Product Image"
          className="h-full w-80 border object-contain transition-all duration-300 group-hover:scale-125"
        />
      </div>

      {item.onSale === 'yes' ? (
        <div className="absolute top-0 m-2 rounded-full bg-black">
          <p className="rounded-full p-1 text-[8px] font-bold uppercase tracking-wide text-white sm:py-1 sm:px-3">
            Sale
          </p>
        </div>
      ) : null}

      <div className="my-4 mx-auto w-full">
        <div className="p-4 mb-2 flex flex-col ">
          <p
            className={`mb-3 text-md font-semibold ${
              item.onSale === 'yes' ? 'line-through' : ''
            }`}
          >{`$ ${item.price}`}</p>

          {item.onSale === 'yes' ? (
            <p className="mb-3 text-md font-semibold text-green-600">{`$ ${(
              item.price -
              (item.price * item.priceDrop) / 100
            ).toFixed(2)}`}</p>
          ) : null}

          {item.onSale === 'yes' ? (
            <p className="mb-3 text-md font-semibold">{`-${item.priceDrop}%`}</p>
          ) : null}

          <h3 className=" text-gray-400 text-sm">{item.name}</h3>
        </div>
      </div>
    </div>
  );
}
