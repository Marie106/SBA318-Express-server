const express = require('express');
const router = express.Router();

// Mock Data
let posts = [
  { id: 1, title: 'First Post', content: 'This is the content of the first post.' },
  { id: 2, title: 'Second Post', content: 'This is the content of the second post.' }
];

// POST route to create a new post
router.post('/', (req, res) => {
  const { title, content } = req.body;
  if (title && content) {
    const newPost = {
      id: posts.length ? posts[posts.length - 1].id + 1 : 1,
      title,
      content
    };
    posts.push(newPost);
    res.status(201).json(newPost);
  } else {
    res.status(400).json({ error: 'Title and content are required' });
  }
});

// GET route to retrieve a single post
router.get('/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id, 10));
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

// PUT route to update an existing post
router.put('/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex !== -1) {
    const { title, content } = req.body;
    posts[postIndex] = { id: postId, title, content };
    res.json(posts[postIndex]);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// DELETE route to remove a post
router.delete('/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex !== -1) {
    posts.splice(postIndex, 1);
    res.status(204).send(); // 204 No Content
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

module.exports = router;
