import React, { useState, useEffect } from "react";
import { client, fetchProduct } from "./utils";
import { IProduct } from "./types";
import { AiOutlineShopping } from "react-icons/ai";
import { useCart } from "react-use-cart";

export default function App() {
  const [products, setProducts] = useState<Array<IProduct> | null>(null);
  const { isEmpty, totalItems, addItem, items, emptyCart } = useCart();

  const getProducts = async () => {
    await client
      .fetch(fetchProduct)
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const updateQty = async (id: string, qty: number | any) => {
    await client
      .patch(id)
      .dec({ quantity: qty })
      .commit()
      .then(() => {
        window.location.reload();
      });
  };

  const checkout = async () => {
    items?.forEach((item) => {
      updateQty(item?._id, item?.quantity);
    });
    emptyCart();
  };
  return (
    <>
      <div className="w-full h-[10vh] flex justify-end items-center px-[10vw]">
        <div
          className="p-2 bg-gray-200 rounded-lg relative cursor-pointer"
          onClick={checkout}
        >
          <AiOutlineShopping />
          {!isEmpty && (
            <span className="bg-rose-500 rounded-full w-[20px] h-[20px] text-white absolute top-0 right-0 grid place-items-center text-[10px] translate-x-[40%] translate-y-[-40%]">
              {totalItems}
            </span>
          )}
        </div>
      </div>
      <div className="w-full h-[90vh] flex justify-center items-center gap-[100px]">
        {products?.map((product) => (
          <div
            className="w-[200px] flex justify-start items-start gap-2 flex-col"
            key={product?._id}
          >
            <img
              className="w-full h-[200px] rounded-lg object-cover"
              src={product?.image}
              alt={product?.name}
            />
            <div className="w-full flex justify-between items-center">
              <p className="font-bold text-base">{product?.name}</p>
              <p>${product?.price}</p>
            </div>
            {product?.quantity !== 0 ? (
              <button
                className="w-full py-2 bg-[#202020] text-white rounded-lg"
                onClick={() => addItem({ ...product, id: product?._id })}
              >
                Buy
              </button>
            ) : (
              <div className="w-full py-2 bg-[#202020] text-white rounded-lg text-center">
                Sold Out
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
