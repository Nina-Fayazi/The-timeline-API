const db = require('../config/database'); 


exports.getAllPosts = async (req, res) => {
    try {
        const [posts] = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
};


exports.postOnePost = async (req, res) => {
    const { message, user_id } = req.body;

    if (!message || !user_id) {
        return res.status(400).json({ message: "Message content and user_id are required." });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO messages (message, user_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())', 
            [message, user_id]
        );
        return res.status(201).json({ message: "Post created successfully", postId: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: "Error saving post", error: error.message });
    }
};


exports.updateOnePost = async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Updated message content is required." });
    }

    try {
        const [result] = await db.query('UPDATE messages SET message = ?, updated_at = NOW() WHERE id = ?', [message, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Post not found." });
        return res.status(200).json({ message: "Post updated successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Error updating post", error: error.message });
    }
};


exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM messages WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Post not found." });
        return res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting post", error: error.message });
    }
};