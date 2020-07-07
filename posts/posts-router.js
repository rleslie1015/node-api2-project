const express = require('express');
const Joi = require('joi');

const router = express.Router(); // notice the Uppercase R
const posts = require('../data/db');

// this file will only be used when the route begins with "/posts"
router.post('/', (req, res) => {
  // validate
   const { error, value } = validatePost(req.body);

   //if invalid return 400, bad req
   console.log(posts)
   if (!req.body.title || !req.body.contents) {
     res.status(400).json({errorMessage: "Please provide title and contents for the post." })
   } 
  posts.addPost(value)
  .then((post) => {
    res.status(201).json(post);
  })
  .catch((err) => {
    res.status(500).json({message: "There was an error while saving the post to the database" })
  })

});

router.post('/:id/comments', (req, res) => {
  posts.findById(req.params.id)
  .then(post => {
    if(!post) {
      return res.status(404).json({ message: "The post with the specified ID does not exist."});
    }
  })
  const newComment = req.body;
  newComment.post_id = req.params.id;

  if (!req.body.text) {
  return res.status(400).json({ errorMessage: "Please provide text for comment."})
}
  posts.insertComment(newComment)
  .then((comment) => {
    return res.status(201).json(newComment)
  })
  .catch((err) => res.status(500).json({ error: "There was an error while saving the comment to the database."}))
})

router.get('/', (req, res) => {
  posts.find()
  .then((posts) => {
    res.status(200).json(posts)
  })
  .catch((err) => {
    res.status(500).json({ error: "The posts information could not be retrieved."})
  })
});

router.get('/:id', (req, res) => {
  posts.findById(req.params.id)
  .then(post => {
    if (!post) {
      return res.status(404).json({message: "The post with the specified ID does not exist." })
    } else {
      return res.status(200).json(post)
    }
  })
  .catch((err) => res.status(500).json({ error:  "The post information could not be retrieved."}))
});

router.get('/:id/comments', (req, res) => {
  posts.findById(req.params.id)
  .then(post => {
    if (!post) {
      res.status(404).json({message: "The post with the specified ID does not exist." })
    } else {
      return posts.findPostComments(req.params.id)
    }
  })
  .then((comments) => {
    res.status(200).json(comments)
  })
  .catch((err) => res.status(500).json({ error:  "The comments information could not be retrieved."}))
});

router.delete('/:id', (req, res) => {
  posts.remove(req.params.id)
  .then(post => {
    if(post < 1) {
      return res.status(404).json({message: "The post with the specified ID does not exist." })
    } else {
      return res.status(200).json({message: `${post} post deleted with id of ${req.params.id}`})
    }
  })
  .catch(err => res.status(500).json({ error: "The post could not be removed" }))
})

router.put('/:id', (req, res) => {
  const changes = req.body;
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    })
  }
  posts.update(req.params.id, changes)
  .then(post => {
    if (!post) {
      return res.status(404).json({message: "The post information could not be modified." })
    } else {
      return posts.findById(req.params.id)
    }
  })
  .then(post => res.status(200).json(post))
  .catch(err => res.status(500).json({ error: "The post could not be updated" }))
})
function validatePost(post) {
     // validate
     const schema = {
        title: Joi.string().required(),
        contents: Joi.string().required(),
    };

    return Joi.validate(post, schema);
}

function validateComment(comment) {
  // validate
  const schema = {
     text: Joi.string().required(),
 };

 return Joi.validate(comment, schema);
}

module.exports = router;