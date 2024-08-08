const express = require('express');
const router = express.Router();


// GET and POST routes for /users
router.route('/')
  .get((req, res) => {
    res.json(usersData);
  })
  .post((req, res) => {
    const { fname, lname, uname } = req.body;
    if (fname && lname && uname) {
      if (usersData.find(u => u.uname === uname)) {
        return res.json({ error: 'Username Already Taken' });
      }

      const newId = usersData.length ? usersData[usersData.length - 1].id + 1 : 1;
      const user = {
        id: newId,
        fname,
        lname,
        uname
      };

      usersData.push(user);
      res.json(usersData[usersData.length - 1]);
    } else {
      res.json({ error: 'No Data Provided' });
    }
  });

// GET, PATCH, and DELETE routes for /users/:id
router.route('/:id')
  .get((req, res) => {
    const user = usersData.find(u => u.id === parseInt(req.params.id, 10));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  })
  .patch((req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = usersData.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      const updatedUser = { ...usersData[userIndex], ...req.body };
      usersData[userIndex] = updatedUser;
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  })
  .delete((req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = usersData.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      usersData.splice(userIndex, 1);
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

module.exports = router;
