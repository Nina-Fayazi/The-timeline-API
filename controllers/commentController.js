const Comment = require('../models/Comment');


exports.getAllCommentsPost = async (req, res) => {
    const { id } = req.params; // آیدی پست

    try {
        const comments = await Comment.find({ message_id: id })
            .populate('user_id', 'first_name last_name')
            .sort({ createdAt: 1 }); // قدیمی‌ترین اول نشان داده شود
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
};


exports.postOneComment = async (req, res) => {
    const { id } = req.params; 
    const { comment } = req.body;
    const user_id = req.user.id;

    if (!comment) return res.status(400).json({ message: "Comment content is required." });

    try {
        const newComment = new Comment({ message_id: id, user_id, comment });
        await newComment.save();
        return res.status(201).json({ message: "Comment posted successfully", comment: newComment });
    } catch (error) {
        return res.status(500).json({ message: "Error posting comment", error: error.message });
    }
};