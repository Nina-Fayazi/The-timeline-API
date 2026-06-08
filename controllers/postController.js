const Message = require('../models/Message');


exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Message.find()
            .populate('user_id', 'first_name last_name')
            .sort({ createdAt: -1 });
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
};


exports.postOnePost = async (req, res) => {
    const { message } = req.body;
    const user_id = req.user.id; 

    if (!message) {
        return res.status(400).json({ message: "Message content is required." });
    }

    try {
        const newMessage = new Message({ message, user_id });
        await newMessage.save();
        return res.status(201).json({ message: "Post created successfully", post: newMessage });
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
        const updatedPost = await Message.findByIdAndUpdate(id, { message }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found." });
        }
        return res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        return res.status(500).json({ message: "Error updating post", error: error.message });
    }
};


exports.deletePost = async (req, res) => {
    const { id } = req.params; 

    try {
        const deletedPost = await Message.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found." });
        }
        return res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting post", error: error.message });
    }
};