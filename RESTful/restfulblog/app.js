var express = require("express"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    app = express();
//APP configuration

mongoose.connect("mongodb://localhost/restful_blog", { useMongoClient: true });
app.set("view engine", 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer);
app.use(methodOverride("_method"));
//Mongoose Schema Configuration
var blogSchema = new mongoose.Schema({
    title: String,
    image: { type: String, default: 'http://hdimages.org/wp-content/uploads/2017/03/placeholder-image4.jpg' },
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

//Restful Routes
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//Index
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { blogs: blogs });
        }
    });
});
//NEW ROUTE
app.get('/blogs/new', function(req, res) {
    res.render('new');
});

//CREATE ROUTE
app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("/blogs");
        }
    });
});
//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err)
            res.redirect("/blogs");
        else
            res.render("show", { blog: foundBlog });
    });
});
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err)
            res.redirect("/blogs");
        else
            res.render("edit", { blog: foundBlog });
    });
});
//update route
app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err) {
        if (err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs/" + req.params.id);
    });
});
//delete route
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, req.body.blog, function(err) {
        if (err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs");
    });
});
//Server Test
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server is running");
});
