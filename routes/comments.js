// =======================
// COMMENT ROUTES
// ========================
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err)
			console.log(err);
		else{
			res.render("comments/new",{campground:foundCampground});
		}
	})	
});

router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){
	// look up campground using id
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}
		else{
			//create new comment
			Comment.create(req.body.comment,function(err,comment){
				if(err)
					console.log(err);
				else{
					//add user name and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//connect new comment to the campground
					foundCampground.comments.push(comment);
					foundCampground.save();
					console.log("Create a new comment");
					req.flash("success","Successfully added comment");
					//redirect
					res.redirect("/campgrounds/" + foundCampground._id );
				}
			});
			
		}
	});
});

// COMMENT EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
		}	
	});	
});

//COMMENT UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err)
			res.redirect("back");
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE COMMENT
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err)
			res.redirect("back");
		else{
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});


module.exports = router; 
