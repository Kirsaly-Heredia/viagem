//  posts routes
var express = require('express');
var router = express.Router();

var path = require('path');

var multer = require('multer');
var uploadPath = path.join(__dirname, '../public/uploads');
var upload = multer({ dest: uploadPath});

var Post = require('../models/post');

router.get('/add', function (req, res) {
  res.render('new-post');
});

router.post('/add', upload.single('image'), function (req, res) {
  var newPost = new Post({
    placeName: req.body.placeName,
    category: req.body.category,
    continent: req.body.continent,
    country: req.body.country,
    city: req.body.city,
    imageFilename: req.file.filename,
    caption: req.body.caption
  });

  newPost.save(function (err, data) {
    if (err) {
      console.log(err);
      return res.redirect(303, '/');
    }
    
    return res.redirect(303, '/');
  });
});

router.get('/', function (req, res) {
  var query = {};
  if (req.query.category) {
    query = {category: req.query.category};
  }
  Post.find(query, function (err, data) {
    console.log(data);
    var pageData = {
      posts: data
    };
    res.render('explore', pageData);
  });

});
  
module.exports = router;