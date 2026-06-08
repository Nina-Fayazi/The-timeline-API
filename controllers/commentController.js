const db = require('../config/database');


exports.getAllCommentsPost = async (req, res) => {
    const { id } = req.params;
    try {
        const [comments] = await db.query('SELECT * FROM comments WHERE message_id = ? ORDER BY created_at ASC', [id]);
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
};


exports.postOneComment = async (req, res) => {
    const { id } = req.params;
    const { comment, user_id } = req.body;

    if (!comment || !user_id) {
        return res.status(400).json({ message: "Comment content and user_id are required." });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO comments (message_id, user_id, comment, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            [id, user_id, comment]
        );
        return res.status(201).json({ message: "Comment posted successfully", commentId: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: "Error posting comment", error: error.message });
    }
};