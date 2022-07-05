import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { saveShippingAddress } from "../utils/CartSlice";

const shippingScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.cart);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  useEffect(() => {
    setValue("fullName", state.shippingAddress.fullName);
    setValue("address", state.shippingAddress.address);
    setValue("city", state.shippingAddress.city);
    setValue("postalCode", state.shippingAddress.postalCode);
    setValue("country", state.shippingAddress.country);
  }, [state.shippingAddress]);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    dispatch(
      saveShippingAddress({ fullName, address, city, postalCode, country })
    );
    router.push("/payment");
  };

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="mx-auto max-w-screen-md"
      >
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            className="w-full"
            autoFocus
            {...register("fullName", { required: "Please enter full name" })}
          />
          {errors.fullName && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            className="w-full"
            autoFocus
            {...register("address", {
              required: "Please enter address",
              minLength: {
                value: 3,
                message: "Address is more than 3 characters",
              },
            })}
          />
          {errors.address && (
            <div className="text-red-500">{errors.address.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            id="city"
            className="w-full"
            autoFocus
            {...register("city", { required: "Please enter city" })}
          />
          {errors.city && (
            <div className="text-red-500">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            id="postalCode"
            className="w-full"
            autoFocus
            {...register("postalCode", {
              required: "Please enter postal code",
            })}
          />
          {errors.postalCode && (
            <div className="text-red-500">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            className="w-full"
            autoFocus
            {...register("country", {
              required: "Please enter country",
            })}
          />
          {errors.country && (
            <div className="text-red-500">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
};

export default shippingScreen;

shippingScreen.auth = true;
