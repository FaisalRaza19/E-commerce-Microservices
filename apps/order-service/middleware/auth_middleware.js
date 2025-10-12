import { getAuth } from "@clerk/fastify";

export const userAuth = async(req, res) => {
    const { userId } = getAuth(req);

    // If user isn't authenticated, return a 401 error
    if (!userId) {
        return res.send({ message: 'User not logged in' })
    }

    req.userId = userId
}