const express = require('express');
const router = express.Router();

// Mock Data
let comments = [
  { id: 1, text: 'Great post!', postId: 1 },
  { id: 2, text: 'Thanks for sharing.', postId: 1 }
];

// GET all comments
router.get('/', (req, res) => {
  res.json(comments);
});

// POST a new comment
router.post('/', (req, res) => {
  const { text, postId } = req.body;
  const newComment = { id: comments.length + 1, text, postId };
  comments.push(newComment);
  res.json(newComment);
});

module.exports = router;