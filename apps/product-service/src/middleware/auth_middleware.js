import { getAuth } from "@clerk/express"

export const userAuth = (req, res, next) => {
    const { userId } = getAuth(req)

    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' })
    }

    req.userId = userId
    return next()
}


export const shouldBeAdmin = (req, res, next) => {
    const {userId,sessionClaims} = getAuth(req);

    if (!userId) {
        return res.status(401).json({ message: "You are not logged in!" });
    }

    if (sessionClaims.metadata?.role !== "admin") {
        return res.status(403).json({ message: "user Unauthorized!" });
    }

    req.userId = userId; 
    
    return next();
};
