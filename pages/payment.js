import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { savePaymentMethod } from "../utils/CartSlice";

const paymentScreen = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const { shippingAddress, paymentMethod } = useSelector((state) => state.cart);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      return toast.warning("Payment method is required");
    } else {
      dispatch(savePaymentMethod(selectedPaymentMethod));
      router.push("/placeorder");
    }
  };

  useEffect(() => {
    if (shippingAddress.length == 0) {
      router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod);
  }, [router, paymentMethod, shippingAddress]);

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {["PayPal", "Stripe", "CashOnDelivery"].map((payment) => (
          <div key={payment}>
            <input
              type="radio"
              id={payment}
              className="p-2 mr-2 mb-3 outline-none focus:ring-0"
              checked={selectedPaymentMethod === payment}
              onChange={() => setSelectedPaymentMethod(payment)}
            />
            <label htmlFor={payment}>{payment}</label>
          </div>
        ))}
        <div className="flex justify-between my-4">
          <button
            type="button"
            className="default-button"
            onClick={() => router.push("/shipping")}
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
};

export default paymentScreen;

paymentScreen.auth = true;
