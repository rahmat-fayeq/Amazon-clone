import React, { useEffect, useState } from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import axios from "axios";
import { cartReset } from "../utils/CartSlice";

const Placeorder = () => {
  const { cartItems, cartTotalAmmount, shippingAddress, paymentMethod } =
    useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //12.4567 => 12.46

  const itemsPrice = round2(cartTotalAmmount);
  const shippingPrice = itemsPrice < 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const router = useRouter();
  useEffect(() => {
    if (paymentMethod.length == 0) {
      router.push("/payment");
    }
  }, [router, paymentMethod]);

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch(cartReset());
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      <h1 className="text-2xl mb-4">Place Order</h1>
      {cartItems.length == 0 ? (
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="text-xl mb-2">Shipping Address</h2>
              <div className="mb-4">
                {shippingAddress.fullName} , {shippingAddress.address} ,{" "}
                {shippingAddress.city} , {shippingAddress.postalCode} ,{" "}
                {shippingAddress.postalCode}
              </div>
              <div>
                <Link href="/shipping">
                  <a className="default-button">Edit</a>
                </Link>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="text-xl mb-2">Payment Method</h2>
              <div className="mb-4">{paymentMethod}</div>
              <div>
                <Link href="/payment">
                  <a className="default-button">Edit</a>
                </Link>
              </div>
            </div>
            <div className="card p-5 overflow-x-auto">
              <h2 className="text-xl mb-2">Order Items</h2>
              <table className="max-w-full mb-4">
                <thead className="border-b">
                  <tr>
                    <th className="p-5 text-left">Item</th>
                    <th className="p-5 text-right">Quantity</th>
                    <th className="p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                      </td>
                      <td className="p-5 text-center">{item.cartQuantity}</td>
                      <td className="p-5 text-center">$ {item.price}</td>
                      <td className="p-5 text-center">
                        $ {item.price * item.cartQuantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href="/cart">
                  <a className="default-button">Edit</a>
                </Link>
              </div>
            </div>
          </div>
          <div className="card mb-4">
            <h2 className="text-xl mb-2 ml-5">Order Summary</h2>
            <ul className="mx-5">
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Items</div>
                  <div>$ {itemsPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Tax</div>
                  <div>$ {taxPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>ShippingPrice</div>
                  <div>$ {shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Total</div>
                  <div>$ {totalPrice}</div>
                </div>
              </li>
              <li>
                <button
                  disabled={loading}
                  className="primary-button w-full"
                  onClick={handlePlaceOrder}
                >
                  {loading ? "Loading..." : "Place Order"}
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Placeorder;
Placeorder.auth = true;
