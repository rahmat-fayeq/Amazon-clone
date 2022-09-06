import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";

const Unauthorized = () => {
  const router = useRouter();
  const { message } = router.query;
  return (
    <Layout title="Unauthorized Page">
      <h1 className="text-xl mb-5 text-center">Access Denied</h1>
      {message && (
        <div className="mb-4 text-red-500 text-center">{message}</div>
      )}
    </Layout>
  );
};

export default Unauthorized;
