import Link from "next/link";

const ReturnPage = async ({ searchParams }) => {
  const session_id = searchParams?.session_id;

  if (!session_id) {
    return <div>No session id found!</div>;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${session_id}`
  );
  const data = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">
        Payment {data.status || "Unknown"}
      </h1>
      <p className="mt-2">Payment status: {data.paymentStatus || "Pending"}</p>
      <Link href="/orders" className="text-blue-600 underline mt-4 block">
        See your orders
      </Link>
    </div>
  );
};

export default ReturnPage;

