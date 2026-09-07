import customerModel from "../models/customers.js";

const customerController = {};

// GET ALL Obtener todos los clientes
customerController.getCustomers = async (req, res) => {
  try {
    const customers = await customerModel.find().select("-password");
    return res.status(200).json(customers);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET BY ID  Obtener cliente por id
customerController.getCustomerById = async (req, res) => {
  try {
    const customer = await customerModel.findById(req.params.id).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.status(200).json(customer);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST Crear cliente
customerController.createCustomer = async (req, res) => {
  try {
    const { full_name, name, email, phone_number, phone, user, password, image, status } = req.body;
    const customerFullName = (full_name || name || "").trim();
    const customerPhone = phone_number || phone || "";

    // Validaciones
    if (!customerFullName || !email || !password) {
      return res.status(400).json({ message: "Fields full_name, email and password are required" });
    }

    // Verificar que el email no exista
    const exists = await customerModel.findOne({ email: email.trim() });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newCustomer = new customerModel({
      full_name: customerFullName,
      name: customerFullName,
      email: email.trim(),
      phone_number: customerPhone,
      phone: customerPhone,
      user: user || customerFullName,
      password,
      image: image || null,
      status: status !== undefined ? status : true,
    });

    await newCustomer.save();
    return res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PUT - Actualizar cliente
customerController.updateCustomer = async (req, res) => {
  try {
    const { full_name, name, email, phone_number, phone, user, image, status } = req.body;

    const updateData = {};
    if (full_name !== undefined) {
      updateData.full_name = full_name;
      updateData.name = full_name;
    } else if (name !== undefined) {
      updateData.name = name;
      updateData.full_name = name;
    }

    if (email !== undefined) updateData.email = email.trim();
    
    if (phone_number !== undefined) {
      updateData.phone_number = phone_number;
      updateData.phone = phone_number;
    } else if (phone !== undefined) {
      updateData.phone = phone;
      updateData.phone_number = phone;
    }

    if (user !== undefined) updateData.user = user;
    if (image !== undefined) updateData.image = image;
    if (status !== undefined) updateData.status = status;

    const customerUpdated = await customerModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!customerUpdated) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({
      message: "Customer updated successfully",
      customer: customerUpdated,
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE - Eliminar cliente 
customerController.deleteCustomer = async (req, res) => {
  try {
    const customerDeleted = await customerModel.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );

    if (!customerDeleted) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(200).json({ message: "Customer deactivated successfully" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


customerController.countCustomers = async (req, res) => {
  try {
    const count = await customerModel.countDocuments({ status: true });
    return res.status(200).json({ count });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default customerController;