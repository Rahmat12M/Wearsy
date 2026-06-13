import { pool } from "../config/db.js";


export const getNotifications = async (req, res) => {
  try {

    const userId = req.userId;

    const result = await pool.query(
      `
      SELECT
        id,
        text,
        is_read,
        created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    const notifications = result.rows.map(item => ({
      id: item.id,
      type: "event",
      text: item.text,
      read: item.is_read,
      time: new Date(item.created_at)
        .toLocaleString("de-DE")
    }));

    res.json({
      success: true,
      notifications
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const markNotificationRead = async (req, res) => {

  const userId = req.userId;
  const { id } = req.params;

  await pool.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE id = $1
      AND user_id = $2
    `,
    [id, userId]
  );

  res.json({ success: true });
};

export const markAllNotificationsRead = async (req, res) => {

  await pool.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE user_id = $1
    `,
    [req.userId]
  );

  res.json({ success: true });
};