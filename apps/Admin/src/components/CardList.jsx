import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { auth } from "@clerk/nextjs/server";

const CardList = async ({ title }) => {
  let products = [];
  let orders = [];

  try {
    if (title === "Popular Products") {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products?limit=5&popular=true`,
        { cache: "no-store" }
      );

      if (!res.ok) throw new Error("Product service error");

      const data = await res.json();
      products = Array.isArray(data) ? data : [];
    } else {
      const { getToken } = await auth();
      const token = await getToken();

      if (!token) throw new Error("No auth token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL}/orders?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error("Order service error");

      const data = await res.json();
      orders = Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error(`${title} card service unavailable:`, error.message);
  }

  const list = title === "Popular Products" ? products : orders;

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">{title}</h1>

      {list.length === 0 ? (
        <div className="h-[150px] flex items-center justify-center text-sm text-muted-foreground">
          Service unavailable
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {title === "Popular Products"
            ? products?.map((item) => (
              <Card
                key={item.id}
                className="flex-row items-center justify-between gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-sm relative overflow-hidden bg-muted">
                  {item.images && Object.values(item.images)[0] && (
                    <Image
                      src={Object.values(item.images)[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item.name}
                  </CardTitle>
                </CardContent>

                <CardFooter className="p-0">${item.price}K</CardFooter>
              </Card>
            ))
            : orders?.map((item) => (
              <Card
                key={item._id}
                className="flex-row items-center justify-between gap-4 p-4"
              >
                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm font-medium">
                    {item.email}
                  </CardTitle>
                  <Badge variant="secondary">{item.status}</Badge>
                </CardContent>

                <CardFooter className="p-0">
                  ${item.amount / 100}
                </CardFooter>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default CardList;
