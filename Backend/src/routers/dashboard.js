import {pool} from '../config/db.js';


export const createPost = async (req, res) => {
  try {
    const { title, category, color, season, clean} = req.body;

    const image = req.file?.filename || null;

    const result = await pool.query(
      `
      INSERT INTO posts
      (
        user_id,
        title,
        category,
        color,
        season,
        clean,
        image,
        text
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      [req.userId, title, category, color, season, clean, image, "" ]
    );

    res.json({
      success: true,
      post: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
//   console.log("BODY:", req.body);
// console.log("FILE:", req.file);
// console.log("USER:", req.user);
};
//
export const getMyAlbums = async(req, res)=>{
    try{
        const userId = req.userId;

        const result = await pool.query(
            `SELECT * FROM posts WHERE user_id= $1
            ORDER BY created_at DESC`, [userId]
        );
        res.status(200).json({
            success:true,
            posts:result.rows
        });

    }catch(error){
        return res.status(400).json({
            message:'Sever error',
            error: error.message,
        })
    }
};

export const deletePost = async(req, res)=>{
    try{
        const { id } = req.params;
        const userId = req.userId;
        const result = await pool.query(
            `DELETE FROM posts
            WHERE id=$1 AND user_id=$2
            RETURNING *`,
            [id, userId]
        );
        if (result.rows.length === 0){
            return res.status(404).json({
                success: false,
                message:'Post not found',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Post deleted successfuly',
            user : result.rows[0],
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message:error.message,
        })
    }
}