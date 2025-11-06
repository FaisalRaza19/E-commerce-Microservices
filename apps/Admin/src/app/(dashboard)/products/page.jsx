import Columns from "./Columns.jsx";
import DataTable from "./DataTable.jsx";

const getData = async () => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`
        );
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const ProductPage = async () => {
    const data = await getData();
    return (
        <div className="">
            <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
                <h1 className="font-semibold">All Products</h1>
            </div>
            <DataTable columns={Columns} data={data} />
        </div>
    );
};

export default ProductPage;