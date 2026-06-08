"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/src/types/product";
import { fetchProducts } from "@/src/features/products/api";

type UseProductsOptions = {
  category?: string | null;
  subcategory?: string | null;
  search?: string;
  skip?: boolean;
  storeId?: string;
};

export const useProducts = (options: UseProductsOptions = {}) => {
  const { category, subcategory, search, skip, storeId } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skip) {
      setLoading(false);
      setProducts([]);
      return;
    }

    setLoading(true);
    setProducts([]);
    setPage(1);
    setLastPage(1);

    const searchTerm = search?.trim() || undefined;
    const delay = searchTerm ? 350 : 0;

    const timer = setTimeout(() => {
      fetchProducts(searchTerm, category ?? undefined, subcategory ?? undefined, 1, storeId)
        .then(({ products: data, meta }) => {
          setProducts(data);
          setPage(meta.current_page);
          setLastPage(meta.last_page);
          setTotalRecords(meta.total_records);
          setPageSize(meta.page_size);
          setError(null);
        })
        .catch(() => setError("Mahsulotlarni yuklashda xatolik."))
        .finally(() => setLoading(false));
    }, delay);

    return () => clearTimeout(timer);
  }, [search, category, subcategory, skip, storeId]);

  const goToPage = useCallback(
    (targetPage: number) => {
      setLoadingMore(true);
      fetchProducts(search?.trim() || undefined, category ?? undefined, subcategory ?? undefined, targetPage, storeId)
        .then(({ products: data, meta }) => {
          setProducts((prev) => [...prev, ...data]);
          setPage(meta.current_page);
          setLastPage(meta.last_page);
          setTotalRecords(meta.total_records);
          setError(null);
        })
        .catch(() => setError("Mahsulotlarni yuklashda xatolik."))
        .finally(() => setLoadingMore(false));
    },
    [search, category, subcategory, storeId],
  );

  return {
    products,
    loading,
    loadingMore,
    error,
    page,
    lastPage,
    totalRecords,
    pageSize,
    goToPage,
  };
};
