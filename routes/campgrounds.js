var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/campgrounds",function(req,res){
	//GET ALL DATA FROM DB
	Campground.find({},function(err,campgrounds){
		if(err)
			console.log(err);
		else{
			res.render("campgrounds",{campgrounds:campgrounds, currentUser: req.user});
		}
	});
	//res.render("campgrounds",{campgrounds:campgrounds});
});	

router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var img = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username,
	};
	var price = req.body.price;
	var newCampground = {name:name, price:price, image:img, description: description, author:author};
	console.log(newCampground);
	//campgrounds.push({name:name, image:img});
	//Create a new campground and save it to the DB
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err);
		}
		else{
			//console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
	//redirect to campground page
	//res.redirect("/campgrounds");
});

router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

// show more info about one campground
router.get("/campgrounds/:id",function(req,res){
	//find the campground with id
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err)
			console.log(err);
		else{
			//render show page
			res.render("campgrounds/show",{campground:foundCampground});
		}
	})

});

//edit 	campground
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("./campgrounds");
		}
		else{
			res.render("campgrounds/edit",{campground:campground});
		}
	});
		   
});
//update campground
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	// find and update the correct the campground

	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err)
			res.redirect("/campgrounds");
		else{
			res.redirect("/campgrounds/" + req.params.id );
		}
	} );
	// redirect
});

//delete campgronud
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err)
			res.redirect("/campgrounds");
		else
			res.redirect("/campgrounds");
	});
});

// our middle ware




module.exports = router; 