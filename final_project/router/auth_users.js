const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid ---------------------------------
    let userswithsamename = users.filter((user)=>{
        return user.username === username 
    });
     return (userswithsamename.length > 0);
//------------------------------------------------------------------------------
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    return (validusers.length > 0);
//------------------------------------------------------------------------------
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here -------------------------------------------------------
  const username = req.body.username;
  const password = req.body.password; 

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
  //----------------------------------------------------------------------------
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here -------------------------------------------------------
  const isbn = req.params.isbn;
  let book = books[isbn]
  if (book) { //Check is friend exists
      //---||   1: {"author": "Chinua Achebe","title": "Things Fall Apart", "reviews": {} },
      let review = req.body.review;
      const uname = req.session.username;
      if (review){
        let info = {"username":uname,
                    "review":review};
        book["reviews"] = info;
      }
      books[isbn]=book;
      res.send(`Book with the isbn  ${isbn} updated.`);
  }
  else{
      res.send("Unable to find book!");
  }
  //----------------------------------------------------------------------------
  return res.status(300).json({message: "Yet to be implemented"});
});

// DELETE request: Delete a friend by email id
regd_users.delete("/auth/delete/:isbn", (req, res) => {
    // Update the code here ---------------
    const isbn = req.params.isbn;
    console.log(req.session.username);
    if (isbn){
      delete books[isbn]
    }
    res.send(`Book with the isbn  ${isbn} deleted.`);
    //-------------------------------------
    //res.send("Yet to be implemented")//This line is to be replaced with actual return value
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
