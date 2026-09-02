import adminModel from "../models/admin.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";

//Array de funciones
const loginAdminController = {};

loginAdminController.login = async (req, res) => {
  //#1- Solicito los datos
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  try {
    //#1-Buscar el correo electrónico en la base de datos
    const adminFound = await adminModel.findOne({ email });

    //Si no existe el correo en la base de datos
    if (!adminFound) {
      return res.status(400).json({ message: "Admin not found" });
    }

    //Verificar si el usuario está bloqueado
    if (adminFound.timeOut && adminFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    //Validar la contraseña
    const isMatch = await bcrypt.compare(password, adminFound.password);

    if (!isMatch) {
      adminFound.loginAttemps = (adminFound.loginAttemps || 0) + 1;

      //Si llega a 5 intentos fallidos se bloquea la cuenta
      if (adminFound.loginAttemps >= 5) {
        adminFound.timeOut = Date.now() + 5 * 60 * 1000;
        adminFound.loginAttemps = 0;

        await adminFound.save();

        return res
          .status(403)
          .json({ message: "Cuenta bloqueda por multiples intentos fallidos" });
      }

      await adminFound.save();

      return res.status(401).json({message: "Contraseña incorrecta"})

    }
    

    //Resetear intentos si login correcto
    adminFound.loginAttemps = 0;
    adminFound.timeOut = null;

    //Generar el token
    const token = jsonwebtoken.sign(
      //#1- Que datos vamos a guardar
      { id: adminFound._id, userType: "Admin" },
      //#2- secret key
      config.JWT.secret,
      //#3- Cuando expira
      { expiresIn: "30d" },
    );

    //El token lo guardamos en una cookie
    res.cookie("authCookie", token);

    return res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default loginAdminController;