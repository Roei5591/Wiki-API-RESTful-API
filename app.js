//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useFindAndModify: false
});

const aritclesSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", aritclesSchema);

app.route("/articles")

  .get(function(req, res) {

    Article.find(function(err, allArticles) {
      if (!err) {
        res.send(allArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {

    const title = req.body.title;
    const content = req.body.content;

    const aritcle = new Article({
      title: title,
      content: content
    });

    aritcle.save(function(err) {
      if (!err) {
        res.send("Successfully added new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {

    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all aritcles");
      } else {
        res.send(err);
      }
    });
  });


app.route("/articles/:articleTitle")

.get(function(req, res){

  const articleTitle = req.params.articleTitle;

  Article.findOne({title: articleTitle}, function(err, foundArticle){
    if (!err){
      if (foundArticle){
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    } else {
      res.send(err);
    }
  });
})

.put(function(req, res){

  const articleTitle = req.params.articleTitle;
  const title = req.body.title;
  const content = req.body.content;

  Article.findOneAndUpdate(
    {title: articleTitle},
    {
      title: title,
      content: content
    },
    {overwrite: true},
    function(err, foundArticle){
    if (!err){
      if(foundArticle){
        res.send("Successfully updated article");
      } else {
        res.send("No articles matching that title was found.");
      }
    } else {
      res.send(err);
    }
  });
})

.patch(function(req, res){

  const articleTitle = req.params.articleTitle;
  const article = req.body;

  Article.findOneAndUpdate(
    {title: articleTitle},
    {$set: article},
    function(err, foundArticle){
    if (!err){
      if(foundArticle){
        res.send("Successfully updated article");
      } else {
        res.send("No articles matching that title was found.");
      }
    } else {
      res.send(err);
    }
  })
})

  .delete(function(req, res) {

  const articleTitle = req.params.articleTitle;

    Article.findOneAndDelete(
      {title: articleTitle},
      function(err, foundArticle){
      if (!err){
        if(foundArticle){
          res.send("Successfully deleted article");
        } else {
          res.send("No articles matching that title was found.");
        }
      } else {
        res.send(err);
      }
    })


});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
