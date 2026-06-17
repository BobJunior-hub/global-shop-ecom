type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

type StatusBadgeProps = {
  status: OrderStatus;
};

const statusConfig: Record<OrderStatus, { label: string; classes: string }> = {
  pending: {
    label: "Kutilmoqda",
    classes: "bg-yellow-100 text-yellow-800",
  },
  processing: {
    label: "Jarayonda",
    classes: "bg-blue-100 text-blue-800",
  },
  shipped: {
    label: "Jo'natildi",
    classes: "bg-purple-100 text-purple-800",
  },
  delivered: {
    label: "Yetkazildi",
    classes: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Bekor qilindi",
    classes: "bg-red-100 text-red-800",
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { label, classes } = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
};
