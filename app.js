const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const wikiSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', wikiSchema);

const bootStrap = new Article({
    title: 'BootStrap',
    content: 'Testez le nouveau système multiplateforme PowerShell'
});
const html = new Article({
    title: 'HTML',
    content: 'Testez le nouveau système multiplateforme PowerShell'
});
const css = new Article({
    title: 'CSS',
    content: 'Testez le nouveau système multiplateforme PowerShell'
});

// Article.insertMany([bootStrap, html, css], (err) => {
//     if (!err) {
//         console.log('no error');
//     }
// })



app.route('/articles')
    //GET ALL ARTICLES
    .get(function (req, res) {
        Article.find({}, (err, foundList) => {
            if (!err) {
                res.send(foundList);
            } else {
                res.send(err);
            }
        })
    })
    //INSERT SPECIFIC ARTICLE
    .post(function (req, res) {
        const articleTitle = req.body.title;
        const articleContent = req.body.content;

        const newArticle = new Article({
            title: articleTitle,
            content: articleContent
        });
        newArticle.save((err) => {
            if (!err) {
                res.send('ARTICLE ADDED SUCCESSFULLY');
            } else {
                res.send(err);
            }
        });
    })
    //DELETE ALL ARTICLES
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send('ALL ARTICLES ARE DELETE SUCCESSFULLY');
            } else {
                res.send(err);
            }
        });
    })

app.route('/articles/:title')
    //GET SPECIFIC ARTICLE
    .get(function (req, res) {
        Article.findOne({ title: req.params.title }, (err, article) => {
            if (!err) {
                res.send(article);
            } else {
                res.send(err);
            }
        });
    })
    //UPDATE SPECIFIC ARTICLE
    .put((req, res) => {
        const articleTitle = req.body.title;
        const articleContent = req.body.content;
        Article.updateOne({ title: req.params.title }, { title: articleTitle, content: articleContent }, (err) => {
            if (!err) {
                res.send('UPDATE SUCCESSFULLY');
            } else {
                res.send(err);
            }
        });
    })
    .patch((req, res) => {
        Article.updateOne({ title: req.params.title }, { $set: req.body }, (err) => {
            if (!err) {
                res.send('UPDATE SUCCESSFULLY USING PATCH HTTP METHOD');
            } else {
                res.send(err);
            }
        })
    })

    //DELETE SPECIFIC ARTICLE
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.title }, (err) => {
            if (!err) {
                res.send('DELETE SUCCESSFULLY');
            } else {
                res.render(err);
            }
        });
    });

app.listen(3000, () => {
    console.log('Server start well at port 3000');
}) 