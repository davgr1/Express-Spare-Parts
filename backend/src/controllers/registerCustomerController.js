import nodemailer from "nodemailer"; //Enviar correo
import crypto from "crypto"; //Generar codigo aleatorio
import jsonwebtoken from "jsonwebtoken"; // Token
import bcryptjs from "bcryptjs"; //Encriptar

import customerModel from "../models/customers.js";

import { config } from "../../config.js";

//array de funciones
const registerCustomerController = {};

registerCustomerController.register = async (req, res) => {
  //#1- Solicitar los datos
  const { name, full_name, email, phone, phone_number, user, password, status, isVerified, image } = req.body;
  const customerName = (name || full_name || "").trim();
  const customerPhone = phone || phone_number || "";

  try {
    //Validar que el correo no exista en la base de datos
    const existsCustomer = await customerModel.findOne({ email });
    if (existsCustomer) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    //Encriptar la contraseña
    const passwordHashed = await bcryptjs.hash(password, 10);

    //generar un código aleatorio
    const randomNumber = crypto.randomBytes(3).toString("hex");

    //Guardamos en un token la información
    const token = jsonwebtoken.sign(
      //#1- ¿Qué vamos a guardar?
      {
        randomNumber,
        name: customerName,
        full_name: customerName,
        email,
        phone: customerPhone,
        phone_number: customerPhone,
        user,
        password: passwordHashed,
        image: image || null,
        isVerified,
      },
      //#2- Secret Key
      config.JWT.secret,
      //#3- cuando expira
      { expiresIn: "15m" },
    );

    res.cookie("resgistrationCookie", token, { maxAge: 15 * 60 * 1000 });

    //ENVIAMOS EL CÓDIGO ALEATORIO POR CORREO ELECTRÓNICO
    let emailSent = false;
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: config.email.user_email,
          pass: config.email.user_password,
        },
      });

      const mailOptions = {
        from: config.email.user_email,
        to: email,
        subject: "Verificación de cuenta - Express Spare Parts",
        text:
          "Para verificar tu cuenta, utiliza este código: " +
          randomNumber +
          " expira en 15 minutos",
      };

      await transporter.sendMail(mailOptions);
      emailSent = true;
    } catch (emailError) {
      console.log("Error enviando email (continuando sin verificación):", emailError.message);
      emailSent = false;
    }

    if (emailSent) {
      // Si el email se envió, devolver token para verificación
      return res.status(200).json({ 
        message: "Email sent", 
        registrationToken: token,
        requiresVerification: true 
      });
    } else {
      // Si el email falla, registrar directamente sin verificación
      const NewCustomer = new customerModel({
        name: customerName,
        full_name: customerName,
        email,
        phone: customerPhone,
        phone_number: customerPhone,
        user,
        password: passwordHashed,
        image: image || null,
        isVerified: false,
      });

      await NewCustomer.save();

      return res.status(200).json({ 
        message: "Cuenta creada exitosamente (sin verificación de email)",
        requiresVerification: false 
      });
    }
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//VERIFICAR EL CÓDIGO QUE ACABAMOS DE ENVIAR
registerCustomerController.verifyCode = async (req, res) => {
  try {
    //Solicitamos el código que escribieron en el frontend
    const { verificationCodeRequest, registrationToken } = req.body;

    //Obtener el token de las cookies O del body (para apps móviles)
    const token = req.cookies.resgistrationCookie || registrationToken;

    if (!token) {
      return res.status(400).json({ message: "Token de registro no encontrado. Intenta registrarte de nuevo." });
    }

    //extraer toda la información del token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const {
      randomNumber: storedCode,
      name,
      full_name,
      email,
      phone,
      phone_number,
      user,
      password,
      image,
      isVerified,
    } = decoded;

    //Comparar lo que el usuario escribió con el código que está en el token
    if (verificationCodeRequest !== storedCode) {
      return res.status(400).json({ message: "Código inválido" });
    }

    //Si todo está bien, y el usuario escribe el código, lo registramos en la BD
    const NewCustomer = new customerModel({
      name: full_name || name,
      full_name: full_name || name,
      email,
      phone: phone_number || phone,
      phone_number: phone_number || phone,
      user,
      password,
      image: image || null,
      isVerified: true,
    });

    await NewCustomer.save();

    res.clearCookie("resgistrationCookie")

    return res.status(200).json({message: "Customer registered"})

  } catch (error) {
    console.log("error"+error)
    return res.status(500).json({message: "Internal server error"})
  }
};

export default registerCustomerController