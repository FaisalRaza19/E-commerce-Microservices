import { getAuth } from "@clerk/express"

export const userAuth = (req, res, next) => {
    const { userId } = getAuth(req)

    // If user isn't authenticated, return a 401 error
    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' })
    }

    req.userId = userId
    return next()
}

export const shouldBeAdmin = async (req, res) => {
    const auth = getAuth(req);
    if (!auth.userId) {
        return res.status(401).send({ message: "You are not logged in!" });
    }

    const claims = auth.sessionClaims;

    if (claims.metadata?.role !== "admin") {
        return res.status(403).send({ message: "Unauthorized!" });
    }

    req.userId = auth.userId;
};