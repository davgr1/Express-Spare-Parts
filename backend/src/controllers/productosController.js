//Import el Schema de la colección que
//vamos a utilizar
import productsModel from "../models/productos.js";

const productsController = {};

//SELECT
productsController.getProducts = async (req, res) => {
  try {
    const products = await productsModel.find().populate('supplider_id', 'name email');
    res.json(products);
  } catch (error) {
    console.log('error getProducts:', error);
    res.status(500).json({ message: 'internal server error' });
  }
};

//INSERT
productsController.insertProducts = async (req, res) => {
  try {
    const { name, description, price, stock, image, supplider_id } = req.body;
    const newProduct = new productsModel({ name, description, price, stock, image, supplider_id });
    await newProduct.save();
    res.json({ message: 'Product saved' });
  } catch (error) {
    console.log('error insertProducts:', error);
    res.status(500).json({ message: 'internal server error' });
  }
};

//ELIMINAR
productsController.deleteProducts = async (req, res) => {
  await productsModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};

//ACTUALIZAR
productsController.updateProducts = async (req, res) => {
  try {
    const { name, description, price, stock, image, supplider_id } = req.body;
    const updateData = { name, description, price, stock, supplider_id };
    if (image) updateData.image = image;
    await productsModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: 'product updated' });
  } catch (error) {
    console.log('error updateProducts:', error);
    res.status(500).json({ message: 'internal server error' });
  }
};

//select por id
productsController.getProductById = async (req, res) => {
  try {
    const producto = await productsModel.findById(req.params.id)
    if(!producto){
      return res.status(404).json({message: "product not found"})
    }
    return res.status(200).json(producto);
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "internal server error"})
  }
};

//select de productos con stock bajos
productsController.getLowStock = async (req, res) => {
  try {
    const productos = await productsModel.find({stock: {$lt: 5}})

    if(!productos){
      return res.status(404).json({message: "there are not product whit low stock"})
    }

    return res.status(200).json(productos);
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "internal server error"})
  }
};

//select con diltro
productsController.getProductsByPriceRange = async (req, res) => {
  try {
    //solicitar datos
    const {min, max} = req.body;

    const products = await productsModel.find({
      price: {$gte: min, $lte: max}
    })

    if(!products){
      return res.status(404).json({message: "not product with this price range"})
    }

    return res.status(200).json(products)
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "internal server error"})
  }
};

//contar cuantos elementos hay en una colecion
productsController.countProduct = async (req, res) => {
  try {
    const count = await productsModel.countDocuments();

    return res.status(200).json(count)
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "internal server error"})
  }
};

//buscar por nombre
productsController.searchByName = async (req, res) => {
  try {
    //nombre a buscar
    const { name } = req.body;

    const products = await productsModel.find({
      name: {$regex: name, $options: "i"}
    })

    if(!products){
      return res.status(404).json({message: "not product found"})
    }

    return res.status(200).json(products)
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "internal server error"})
  }
};

export default productsController;