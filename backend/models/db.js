const mongoose= require('mongoose');

const mango_url = process.env.MONGO_URL;

mongoose.connect(mango_url)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log('Error connecting to MongoDB', err);
});

 