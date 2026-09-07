import promocionModel from "../models/promocion.js";

const promocionController = {
    getPromociones: async (req, res) => {
        try {
            const promociones = await promocionModel.find();
            res.status(200).json(promociones);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    insertPromocion: async (req, res) => {
        try {
            const { titulo, descripcion, status } = req.body;
            let imagenUrl = "";
            
            if (req.file) {
                imagenUrl = req.file.path; // Cloudinary URL
            }

            const nuevaPromocion = new promocionModel({
                titulo,
                descripcion,
                imagen: imagenUrl,
                status: status !== undefined ? (status === 'true' || status === true) : true
            });

            const savedPromocion = await nuevaPromocion.save();
            res.status(201).json(savedPromocion);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updatePromocion: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };
            
            if (req.file) {
                updateData.imagen = req.file.path;
            }

            if (updateData.status !== undefined) {
                updateData.status = updateData.status === 'true' || updateData.status === true;
            }

            const promocionActualizada = await promocionModel.findByIdAndUpdate(id, updateData, { new: true });
            if (!promocionActualizada) return res.status(404).json({ message: "Promocion no encontrada" });
            
            res.status(200).json(promocionActualizada);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deletePromocion: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await promocionModel.findByIdAndDelete(id);
            if (!deleted) return res.status(404).json({ message: "Promocion no encontrada" });
            
            res.status(200).json({ message: "Promocion eliminada correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default promocionController;
