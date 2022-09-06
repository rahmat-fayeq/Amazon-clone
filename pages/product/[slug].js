import React from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import Page404 from "../Page404";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "../../utils/CartSlice";
import db from "../../utils/db";
import Product from "../../models/Product";

const ProductScreen = (props) => {
  const dispatch = useDispatch();
  const { product } = props;
  if (!product) {
    return <Page404 />;
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <Layout title={product.name}>
      <div className="bg-amber-300 py-3 px-5 w-40 rounded  mb-3 hover:bg-amber-400">
        <Link href="/">Back To Products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </div>
        <div className="font-semibold">
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} review
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5 font-semibold">
            <div className="flex justify-between mb-2">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="flex justify-between mb-5">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "In Stock" : "Unavailable"}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={() => handleAddToCart(product)}
            >
              Add To Card
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductScreen;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug: slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
