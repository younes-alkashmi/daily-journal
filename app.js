//
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

const data = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

mongoose.connect('mongodb://localhost:27017/postsDB');

const postsSchema = {
  title: String,
  post: String
};
const Post = mongoose.model('Post',postsSchema);

app.set('view engine', ejs);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

app.get('/', (req, res) => {

  Post.find((err,posts)=>{
    if(err)
      console.log(err);
    else
    res.render('home.ejs', {
      data: data,
      posts: posts
    });
  });
})

app.get('/about', (req,res)=>{
  res.render('about.ejs',{data:data});
})


app.get('/contact', (req,res)=>{
  res.render('contact.ejs',{data:data});
})

app.get('/compose', (req,res)=> {

  res.render('compose.ejs')
}
);

app.post('/compose',(req,res)=>{

  const post = new Post({
    title: req.body.title,
    post: req.body.post
  });
  post.save();
  res.redirect('/');
});

app.get('/posts/:post',(req,res)=>{
  Post.find((err,posts)=>{
    if(err){
      console.log(err);
    }else{
      posts.forEach(post=>{
        if(_.lowerCase(req.params.post) === _.lowerCase(post._id)){
          res.render('post.ejs',{id:post._id,title:post.title, post:post.post})
        } });
      }
  });
  // posts.forEach(function(post){
  //   if( _.lowerCase(post.postTitle) === _.lowerCase(req.params.post)){
  //     res.render('post.ejs',{title:post.postTitle, post:post.postBody})
  //   }
  });

app.get('/delete/:id', (req,res) => {
   Post.findOneAndRemove({_id: req.params.id}, (err)=>{
     if(!err) console.log("Deleted succefully!");
   });
  res.redirect('/');
});

app.listen(3000, _ => console.log('server is up on port 3000'));
