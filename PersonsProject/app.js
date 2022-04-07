const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB", {useNewUrlParser: true});

const fruitSchema = mongoose.Schema ({
    name: String,
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    review: String
});

const personSchema = ({
    name: String,
    age: Number,
    favouriteFruit: fruitSchema
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const Person = mongoose.model("Person", personSchema);


const apple = new Fruit (
    {
        name:"Apple",
        rating: 10,
        review: "Great fruit."
    });
const kiwi = new Fruit(
    {
        name:"Kiwi",
        rating: 9,
        review: "Nice."
    });
const orange = new Fruit (
    {
        name:"Orange",
        rating: 5,
        review: "Not nice."
    });
const banana = new Fruit (
    {
        name:"Bananae",
        rating: 9.9,
        review: "Good."
    }
) ;

const peach = new Fruit (
    {
        rating: 10,
        review: "Great"
    }
)

const pineapple = new Fruit ({
    name: "Pineapple",
    rating: 9
});

pineapple.save();

const John = new Person ({
    name: "John Doe",
    age: 25,
    favouriteFruit: banana
})

John.save();

// peach.save();

// Fruit.insertMany([apple,kiwi,orange,banana], function(err) {
//     if(err){
//         console.log(err);
//     } else {
//     console.log("Successfully added to fruitsDB");
// }
// });


Fruit.find(function (err,fruits) {
    if(err){
        console.log(err);
    } else {
        mongoose.connection.close();

        
        fruits.forEach(element => {
            console.log(element.name);
        });
    }
});



// Fruit.updateOne ({_id: "61d33d8cd9f4fbf1d4a7df85"}, {name: "Peach"}, function(err){
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Successfully updated!");
//     }
// });


// Fruit.deleteOne ({name:"Peach"}, function(err){
//     if (err) {
//         console.log(err); 
//     } else {
//         console.log("Successfully deleted!");
//         }
// });