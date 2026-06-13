import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const login = async(req,res)=>{
try{
    const {email, password} = req.body;
if(!email || !password){
  return res.status(400).json({
    success: false,
    message: "All fields are required",
  });
};
const userResult = await pool.query(
  "SELECT * FROM users WHERE email=$1", [email]
);
if (userResult.rows.length === 0){
  return res.status(400).json({
    success: false,
    message:"Invalid email or password",
  })
};
const user = userResult.rows[0];
const isMatch = await bcrypt.compare(
  password, user.password
);
if(!isMatch){
  return res.status(400).json({
    success: false,
    message: "Invalid User or Password",
  })
};

await pool.query(
    "INSERT INTO notifications (user_id, text) VALUES ($1,$2)",
    [user.id, `Welcome again ${user.vorname}-${user.nachname} 👋`]
  );
    const SECRET_KEY = process.env.JWT_SECRET
    const token = jwt.sign({userId: user.id}, SECRET_KEY, {expiresIn: '7d'});

res.status(201).json({
  success: true,
  message: "Login successfully",
  token,
  user:{
    id: user.id,
    email:user.email,
    vorname: user.vorname,
    image:user.profile_image,
  }
})
}catch(error){
  return res.status(500).json({
    success: false,
    message: "Server error",
    error:message.error,
  })
}

};

export const Users = async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT id, email, name, profile_image FROM users WHERE id = $1",
      [req.userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.json({
      success: true,
      user: userResult.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
