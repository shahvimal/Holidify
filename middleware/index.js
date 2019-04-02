var Comment = require('../models/comment');
var Place = require('../models/place');
module.exports = {
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      req.flash('error', 'You must be signed in to do that!');
      res.redirect('/login');
  },
  checkUserPlace: function(req, res, next){
    Place.findById(req.params.id, function(err, foundPlace){
      if(err || !foundPlace){
          console.log(err);
          req.flash('error', 'Sorry, that place does not exist!');
          res.redirect('/places');
      } else if(foundPlace.author.id.equals(req.user._id) || req.user.isAdmin){
          req.place = foundPlace;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/places/' + req.params.id);
      }
    });
  },
  checkUserComment: function(req, res, next){
    Comment.findById(req.params.commentId, function(err, foundComment){
       if(err || !foundComment){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/places');
       } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
            req.comment = foundComment;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/places/' + req.params.id);
       }
    });
  },
  isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'This site is now read only thanks to spam and trolls.');
      res.redirect('back');
    }
  },
  isSafe: function(req, res, next) {
    // if(req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) 
    if(1){
      next();
    }else {
      req.flash('error', 'Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.');
      res.redirect('back');
    }
  }
}