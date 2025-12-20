import { auth } from "@clerk/nextjs/server";
import Columns from "./Columns.jsx";
import DataTable from "./DataTable.jsx";

const getData = async () => {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      throw new Error("No auth token");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Order service error: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Orders service unavailable:", err.message);
    return [];
  }
};

const OrdersPage = async () => {
  const data = await getData();

  return (
    <div>
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Payments</h1>

        {data.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Order service is unavailable
          </p>
        )}
      </div>

      <DataTable columns={Columns} data={data} />
    </div>
  );
};

export default OrdersPage;
