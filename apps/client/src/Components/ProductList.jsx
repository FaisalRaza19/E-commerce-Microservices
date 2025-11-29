"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Categories from "./Categories";
import Filter from "./Filter";
import ProductCard from "./ProductCard";
import Link from "next/link";

const ProductList = ({ params }) => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?${category !== "all" ? `category=${category}` : ""
        }${search ? `&search=${search}` : ""}&sort=${sort}${params === "homepage" ? "&limit=8" : ""}`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category, sort, search, params]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  return (
    <div className="w-full">
      <Categories />
      {params === "products" && <Filter />}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No products found.
          </p>
        )}
      </div>

      {params === "homepage" && (
        <Link
          href={category && category !== "all" ? `/products?category=${category}` : "/products"}
          className="flex justify-end mt-4 underline text-sm text-gray-500"
        >
          View all products
        </Link>
      )}
    </div>
  );
};

export default ProductList;
