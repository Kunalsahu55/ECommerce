const Product = require("../model/product.model");

// 1. Get All Products
const getProducts = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category && req.query.category !== 'All') {
      filters.category = req.query.category;
    }
    if (req.query.search) {
      filters.title = { $regex: req.query.search, $options: 'i' };
    }

    const products = await Product.find(filters)
      .populate('createdBy', 'name email')
      .lean();

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 2. Get Single Product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email')
      .lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 3. Create Product (Bina stock / quantity ke)
const createProduct = async (req, res) => {
  try {
    const { title, description, category, image, url, price, createdBy } = req.body;

    const product = await Product.create({
      title,
      description,
      category,
      image,
      url,
      price: price || 0,
      createdBy: createdBy || req.user?._id
    });

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 4. Update Product
const updateProduct = async (req, res) => {
  try {
    // req.body me se stock aur quantity safe-side strip kar rahe hain
    const { quantity, stock, ...updateData } = req.body;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// 5. Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};