var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
 placeName: {type: String},
 category: {type: String},
 continent: {type: String},
 country: {type: String},
 city: {type: String},
 imageFilename: {type: String},
 caption: {type: String}
 
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;
