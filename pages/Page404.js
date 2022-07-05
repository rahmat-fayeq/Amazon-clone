import React from "react";
import Link from "next/link";

const Page404 = () => {
  return (
    <div className="flex flex-col">
      <Link href="/">
        <button className="rounded bg-green-300 py-3 px-6 shadow outline-none hover:bg-green-400 w-20 mx-5 my-10">
          <p className="text-white">Back</p>
        </button>
      </Link>

      <p
        className="font-extrabold text-red-500 text-center"
        style={{ fontSize: 50 }}
      >
        Page Not Found
      </p>
    </div>
  );
};

export default Page404;
