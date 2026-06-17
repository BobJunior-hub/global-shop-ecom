import type { Branch } from "@/src/types/branch";

export const BRANCHES: Branch[] = [
  {
    id: "1",
    name: "Chilanzar Store",
    address: "12 Chilanzar Street, Tashkent",
    phone: "+998 71 123 45 67",
    hours: "Mon–Sat 09:00–20:00",
    categories: [],
  },
  {
    id: "2",
    name: "Yunusabad Store",
    address: "34 Amir Temur Avenue, Yunusabad, Tashkent",
    phone: "+998 71 234 56 78",
    hours: "Mon–Sat 09:00–19:00",
    categories: [],
  },
  {
    id: "3",
    name: "Mirzo Ulugbek Store",
    address: "8 Mirzo Ulugbek Road, Tashkent",
    phone: "+998 71 345 67 89",
    hours: "Mon–Fri 10:00–19:00, Sat 10:00–17:00",
    categories: [],
  },
];

export const getBranchById = (id: string) =>
  BRANCHES.find((b) => b.id === id) ?? null;
