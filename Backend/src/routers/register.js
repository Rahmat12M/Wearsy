
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';


export const register = async (req, res) => {
  try {
    const { anrede, vorname, nachname, geburtstag, email, stadt, land, password, confirmPassword } = req.body;
    const profileImage = req.file?.filename;

    if (!anrede || !vorname || !nachname || !geburtstag || !email || !stadt || !land || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await pool.query(
      "SELECT * from users WHERE email = $1",
      [email]
    );
  if (existingUser.rows.length >0){
    return res.status(400).json({
      success: false,
      message:"Email already exists"
    })
  };
  const hashedPassword = await bcrypt.hash(password, 10);

 const newUser = await pool.query(
  `INSERT INTO users
  (anrede, vorname, nachname, geburtstag, email, stadt, land, password, profile_image) 
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
  RETURNING id, anrede, vorname, nachname, geburtstag, email, stadt, land, profile_image`,
  [
    anrede,
    vorname,
    nachname,
    geburtstag,
    email, 
    stadt, 
    land,
    hashedPassword,
    profileImage,
  ]
);
  const user = newUser.rows[0];
  await pool.query(`INSERT INTO notifications (user_id, text) VALUES ($1,$2)`,
    [user.id, `Welcome ${user.vorname} ${user.nachname}`]
  );

  res.status(201).json({
    message: "User registered successfully",
    user: newUser.rows[0],
    success :true,
  });
}catch(error){
  console.log(error)
  return res.status(500).json({
    success : false,
    message : error.message,
  })
};
}