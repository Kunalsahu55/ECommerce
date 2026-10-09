const express =require("express")
const { admin } = require("../middleware/auth.middleware")
const {getProducts,getProductById,createProduct,updateProduct,deleteProduct}= require("../controllers/product.controller")
const router = express.Router()

router.get('/',getProducts)

router.get('/:id',getProductById)

//Create Product
router.post('/',admin,createProduct)

//Update Product
router.put('/:id',admin,updateProduct)

//Delete Product
router.delete('/:id',admin,deleteProduct)



module.exports = router
