const ensureAuthenticated = require('../moddlewares/Auth');

const router= require('express').Router();
router.get('/', ensureAuthenticated, (req, res) => {
   res.status(200).json([
    {
         id: 1,
         name: "Product 1",
         description: "This is product 1"
     },
     {
         id: 2,
         name: "Product 2",
         description: "This is product2"
    },
    {
        id: 3,
        name: "Product 3",
        description: "This is product3"
    },
    {
        id: 4,
        name: "Product 4",
        description: "This is product4"
    }
   ]);
});

module.exports=router;