import { pool } from "../config/db.js";
import pg from "pg";
import bcrypt from 'bcrypt';
 
export const profile = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      `SELECT id, anrede, vorname, nachname, geburtstag, email, stadt, land, profile_image FROM users WHERE id=$1`,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
 
export const updateProfile = async (req, res) => {
  try {
    const { anrede, vorname, nachname, geburtstag, email, stadt, land } = req.body;
    const userId = req.userId;
    const profileImage = req.file?.filename;
 
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE id=$1`, [userId]
    );
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
 
    const finalProfileImage = profileImage || existingUser.rows[0].profile_image;
 
    const result = await pool.query(
      `UPDATE users SET
<<<<<<< HEAD
        anrede=$1,
        nachname=$2,
        geburtstag=$3,
        email=$4,
        stadt=$5,
        land=$6,
        password=$7,
        profile_image=$8
      WHERE id=$9
      RETURNING
        anrede,
        nachname,
        geburtstag,
        stadt,
        land,
        email,
        profile_image`,
      [
        anrede,
        nachname,
        geburtstag,
        email,
        stadt,
        land,
        hashedPassword,
        finalProfileImage,
        userId,
      ]
=======
        anrede=$1, vorname=$2, nachname=$3,
        geburtstag=$4, email=$5, stadt=$6,
        land=$7, profile_image=$8
      WHERE id=$9
      RETURNING id, anrede, vorname, nachname, geburtstag, email, stadt, land, profile_image`,
      [anrede, vorname, nachname, geburtstag, email, stadt, land, finalProfileImage, userId]
>>>>>>> origin/sahar
    );
 
    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
export const changePwd = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

<<<<<<< HEAD
    try {
      const {
        currentPassword,
        newPassword,
        confirmPassword,
      } = req.body;

      if ( !currentPassword || !newPassword || !confirmPassword ) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          message: "Passwords do not match",
        });
      }
      const userResult = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [req.userId]
      );
      const user = userResult.rows[0];
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isMatch) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }
      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );
      await pool.query(
        "UPDATE users SET password = $1 WHERE id = $2",
        [hashedPassword, user.id]
      );
      res.status(200).json({
        message: "Password changed successfully",
      })
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Server error",
      });
=======
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
>>>>>>> origin/sahar
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const userResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [req.userId]
    );
    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, user.id]
    );

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
<<<<<<< HEAD
//-------------------------------

export const updateProfileP = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const avatarPath = req.file.filename;

    console.log("FILE:", req.file);
    console.log("USER:", userId);

    await pool.query(
      "UPDATE users SET profile_image = $1 WHERE id = $2",
      [avatarPath, userId]
    );

    return res.json({
      success: true,
      avatar: avatarPath,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
=======
};

 
>>>>>>> origin/sahar
