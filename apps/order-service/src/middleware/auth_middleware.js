import { getAuth } from "@clerk/fastify";

export const userAuth = async (req, res) => {
  const { userId } = getAuth(req);
  console.log(userId)

  if (!userId) {
    return res.status(401).send({ message: "User not logged in" });
  }

  req.userId = userId;
};

export const shouldBeAdmin = async (req, res) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    return res.status(401).send({ message: "You are not logged in!" });
  }

  const claims = auth?.sessionClaims;
  if (claims?.metadata?.role !== "admin") {
    return res.status(403).send({ message: "Unauthorized!" });
  }

  req.userId = auth.userId;
};
