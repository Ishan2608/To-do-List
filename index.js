const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { render } = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://<user-name>:<password>@cluster0.g6nae.mongodb.net/<db-name>");
const itemsSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemsSchema);

app.set("view engine", "ejs");

// let list_is_empty = true
app.get("/", function (req, res) {

  let today = new Date();
  let options = { weekday: "long", day: "numeric", month: "long" };
  let day = today.toLocaleDateString("en-US", options);

  Item.find({}, function(err, foundItems){
    if (err){
      console.log(err)
    }

     else {
      res.render("list", { currday: day, newListItems: foundItems });
    }
  })

});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  if(itemName){

    const item = new Item({
      name: itemName,
    });
    item.save().then(()=>{
      res.redirect('/')
    });
  } else{
    res.redirect("/");
    
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server running at port 3000");
});
