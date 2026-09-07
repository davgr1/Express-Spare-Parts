import customerModel from "../models/customers.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

import { config } from "../../config.js";

//Array de funciones
const loginCustomersController = {};

// Store recovery codes in memory (in production use Redis or DB)
const recoveryCodes = new Map();

loginCustomersController.login = async (req, res) => {
  //#1- Solicito los datos
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  try {
    //#1-Buscar el correo electrónico en la base de datos
    const customerFound = await customerModel.findOne({ email });

    //Si no existe el correo en la base de datos
    if (!customerFound) {
      return res.status(400).json({ message: "Customer not found" });
    }

    //Verificar si el usuario está bloqueado
    if (customerFound.timeOut && customerFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    //Validar la contraseña
    const isMatch = await bcrypt.compare(password, customerFound.password);

    if (!isMatch) {
      customerFound.loginAttemps = (customerFound.loginAttemps || 0) + 1;

      //Si llega a 5 intentos fallidos se bloquea la cuenta
      if (customerFound.loginAttemps >= 5) {
        customerFound.timeOut = Date.now() + 5 * 60 * 1000;
        customerFound.loginAttemps = 0;

        await customerFound.save();

        return res
          .status(403)
          .json({ message: "Cuenta bloqueda por multiples intentos fallidos" });
      }

      await customerFound.save();

      return res.status(401).json({message: "Contraseña incorrecta"})

    }
    

    //Resetear intentos si login correcto
    customerFound.loginAttemps = 0;
    customerFound.timeOut = null;

    //Generar el token
    const token = jsonwebtoken.sign(
      //#1- Que datos vamos a guardar
      { id: customerFound._id, userType: "Customer" },
      //#2- secret key
      config.JWT.secret,
      //#3- Cuando expira
      { expiresIn: "30d" },
    );

    //El token lo guardamos en una cookie
    res.cookie("authCookie", token);

    return res.status(200).json({
      message: "Login exitoso",
      token,
      customer: {
        _id: customerFound._id,
        full_name: customerFound.full_name || customerFound.name || "",
        name: customerFound.name || customerFound.full_name || "",
        email: customerFound.email,
        phone_number: customerFound.phone_number || customerFound.phone || "",
        phone: customerFound.phone || customerFound.phone_number || "",
        user: customerFound.user || "",
        image: customerFound.image || null,
        status: customerFound.status,
      },
    });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Enviar código de recuperación por correo
loginCustomersController.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const customerFound = await customerModel.findOne({ email });

    if (!customerFound) {
      return res.status(404).json({ message: "No se encontró una cuenta con ese correo." });
    }

    // Generar código de 6 caracteres
    const recoveryCode = crypto.randomBytes(3).toString("hex");

    // Guardar código con expiración de 15 minutos
    recoveryCodes.set(email, {
      code: recoveryCode,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    // Enviar correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Recuperación de contraseña - Express Spare Parts",
      text: `Tu código de recuperación es: ${recoveryCode}\n\nEste código expira en 15 minutos.\n\nSi no solicitaste este cambio, ignora este correo.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending recovery email:", error);
        return res.status(500).json({ message: "Error al enviar el correo." });
      }
      return res.status(200).json({ message: "Código enviado al correo." });
    });
  } catch (error) {
    console.log("forgotPassword error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Restablecer contraseña con código válido
loginCustomersController.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const storedData = recoveryCodes.get(email);

    if (!storedData) {
      return res.status(400).json({ message: "No hay código de recuperación para este correo." });
    }

    if (Date.now() > storedData.expiresAt) {
      recoveryCodes.delete(email);
      return res.status(400).json({ message: "El código ha expirado. Solicita uno nuevo." });
    }

    if (code !== storedData.code) {
      return res.status(400).json({ message: "Código incorrecto." });
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await customerModel.findOneAndUpdate({ email }, { password: hashedPassword });

    // Eliminar código usado
    recoveryCodes.delete(email);

    return res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.log("resetPassword error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default loginCustomersController;