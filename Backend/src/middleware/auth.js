import jwt from 'jsonwebtoken';

export const verifyToken = (req, res,next)=>{
    try{
      
        const authHeader = req.headers.authorization;
        if(!authHeader){
            console.log('not token')
            return res.status(401).json({
                message:'not Token',
            })
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
         req.user = decoded;

        next();

    }catch(error){
        return res.status(401).json({
            message:'Invalid token',
            error: error.message,
        })
    };
};