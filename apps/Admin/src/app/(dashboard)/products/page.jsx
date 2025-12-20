import Columns from "./Columns.jsx";
import DataTable from "./DataTable.jsx";

const getData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Product service error: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Product service unavailable:", error.message);
    return []; 
  }
};

const ProductPage = async () => {
  const data = await getData();

  return (
    <div>
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Products</h1>

        {data.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Product service is unavailable
          </p>
        )}
      </div>

      <DataTable columns={Columns} data={data} />
    </div>
  );
};

export default ProductPage;
