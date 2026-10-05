import fetch from "node-fetch";
import {config} from "../../config.js";

//array de funciones
const wompiController = {};

//generar el token
wompiController.generaToken = async (req, res) => {
   try {
       
        const response = await fetch("https://id.wompi.sv/connect/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: config.wompi.grant_type,
                audience: config.wompi.audience,
                client_id: config.wompi.client_id,
                client_secret: config.wompi.client_secret,
            })
        })

        if(!response){
            const error = await response.text({error})
            return res.status(500).json({error})
        }

        const data = await response.json();
        return res.status(200).json(data)

    } catch (error) {
       console.log("error" +error)
       return res.status(500).json({message: "interna server error"})
    }
};

//transsaccion de prueba
wompiController.paymentTest = async (req, res) => {
    try {
        //solicito los datos
        const {token, formData} = req.body;

        //hago fetch
        const response = await fetch(
            "https://api.wompi.sv/TransaccionCompra/TokenizadaSin3Ds", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData)
            }
        )

        if(!response){
            const error = await response.text({error})
            return res.status(500).json({error})
        }

        const data = await response.json()
        return res.status(200).json(data)
    } catch (error) {
        console.log("error" +error)
        return res.status(500).json({message: "interna server error"})
    }
};

//transacciones reales
wompiController.payment3DS = async (req, res) => {
    try {
        const {token, formData} = req.body;

        const response = await fetch(
            "https://api.wompi.sv/TransaccionCompra/3Ds", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData)
            }
        )

        if(!response){
            const error = await response.text({error})
            return res.status(500).json({error})
        }

        const data = await response.json()
        return res.status(200).json(data) 
    } catch (error) {
        console.log("error" +error)
        return res.status(500).json({message: "interna server error"})
    }
}

export default wompiController;