// inside /api/apiRoutes.js <- this can be place anywhere and called anything
const express = require('express');

// if the other routers are not nested inside /api then the paths would change
const postRoutes = require('../posts/posts-router');

const router = express.Router(); // notice the Uppercase R

// this file will only be used when the route begins with "/api"
// so we can remove that from the URLs, so "/api/users" becomes simply "/users"
router.use('/posts', postRoutes);

// .. and any other endpoint related to the user's resource

// after the route has been fully configured, then we export it so it can be required where needed
module.exports = router; // standard convention dictates that this is the last line on the file