const express = require('express');
const path = require('path');
const fs = require('fs');


// Create an Express application
const app = express();
const PORT = 5500;

// Static files directory
app.use(express.static(path.join(__dirname, 'styles')));

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded bodies
app.use(express.json()); // Middleware for parsing JSON

// Custom middleware
const logger = (req, res, next) => {
  console.log(req.originalUrl);
  next();
};
app.use(logger);

// EJS template engine setup
app.engine('ejs', (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);

    const rendered = content
      .toString()
      .replace(/#title#/g, options.title || '')
      .replace(/#content#/g, options.content || '')
      .replace(/#href#/g, options.href || '')
      .replace(/#text#/g, options.text || '');

    return callback(null, rendered);
  });
});

app.set('views', path.join(__dirname, 'views')); // Set the views directory
app.set('view engine', 'ejs'); // Set the template engine to EJS

// Routes
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');

app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/users', userRoutes);

// Route handlers
app.get('/', (req, res) => {
  const options = {
    title: 'Rendering Views with Express',
    content: 'Express API',
  };
  res.render('index', options);
});

app.get('/newpage', (req, res) => {
  const options = {
    title: 'Hey Ohio!',
    content: 'Hey Ohio! is your go-to website for discovering the best of Ohio. Whether you\'re a local Ohioan or a new visitor, we’re here to help you explore exciting and enjoyable destinations across the state. Find amazing places to visit and fun activities for yourself, your family, or your friends.',
  };
  res.render('newpage', options);
});

// POST route to create a new post
app.post('/posts', (req, res) => {
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
app.get('/posts/:id', (req, res) => {
  const post = post.find(p => p.id === parseInt(req.params.id, 10));
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(post);
});

// PUT route to update an existing post
app.put('/posts/:id', (req, res) => {
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
app.delete('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex !== -1) {
    posts.splice(postIndex, 1);
    res.status(204).send(); // 204 No Content
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

// Error handling middleware for 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Resource Not Found' });
});

// Error handling middleware for other errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
