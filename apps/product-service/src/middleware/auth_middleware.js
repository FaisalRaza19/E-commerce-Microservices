import { getAuth } from "@clerk/express"

export const userAuth = (req,res,next)=>{
    const { userId } = getAuth(req)

    // If user isn't authenticated, return a 401 error
    if (!userId) {
        return res.status(401).json({ message: 'User not logged in' })
    }

    req.userId = userId
    return next()
}