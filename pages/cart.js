import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseCart,
  getTotals,
  removeFromCart,
} from "../utils/CartSlice";
import { useEffect } from "react";
import { useRouter } from "next/router";

function CartScreen() {
  const router = useRouter();

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getTotals());
  }, [cart]);

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleDecrease = (product) => {
    dispatch(decreaseCart(product));
  };

  const handleIncrease = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl text-center m-5 text-amber-300 font-semibold">
        Shopping Cart
      </h1>
      {cart.cartItems.length === 0 ? (
        <div>
          Cart is empty.{" "}
          <Link href="/">
            <a className="text-amber-300">Go shopping {`->`} </a>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5 ">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems?.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td>
                      <Link href={`/product/${item.slug}`}>
                        <a className="flex items-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-sm"
                          ></Image>
                          &nbsp;{item.name}
                        </a>
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <button onClick={() => handleDecrease(item)}>-</button>
                      <span className="px-2 py-1 border-2 border-slate-100 rounded-md m-3">
                        {item.cartQuantity}
                      </span>
                      <button onClick={() => handleIncrease(item)}>+</button>
                    </td>
                    <td className="p-5 text-right">
                      ${item.price * item.cartQuantity}
                    </td>
                    <td className="p-5 text-center">
                      <button onClick={() => handleRemoveFromCart(item)}>
                        <span className="px-2.5 py-1 bg-red-600 rounded-full text-white">
                          X
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Subtotal: $ {cart.cartTotalAmmount}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push("login?redirect=/shipping")}
                  className="primary-button w-full"
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
