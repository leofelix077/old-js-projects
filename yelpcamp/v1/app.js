var express = require("express"),
        app = express(),
 bodyParser = require("body-parser"),
   mongoose = require('mongoose');
      
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create({
     name: "Salmon Creek", 
    image: "https://www.sitebuilderreport.com/assets/facebook-stock-up-446fff24fb11820517c520c4a5a4c032.jpg"
    }, function(err, campground){
        if(err){
            console.log(err);
        } else {
            console.log("New Campground Created");
            console.log(campground);
        }
    }
);

var campgrounds = [
    { name: "Salmon Creek", image: "https://www.sitebuilderreport.com/assets/facebook-stock-up-446fff24fb11820517c520c4a5a4c032.jpg" },
    { name: "Bla bla bla", image: "https://image.shutterstock.com/display_pic_with_logo/64778/634117829/stock-photo-two-fidget-spinners-634117829.jpg" },
]

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", { campgrounds: campgrounds });
});

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = { name: name, image: image };
    campgrounds.push(newCampground);
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res) {
    res.render('new')
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started");
});
