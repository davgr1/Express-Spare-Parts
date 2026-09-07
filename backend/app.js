import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import customerRoutes from "./src/routers/customer.js";
import employeerRoutes from "./src/routers/employees.js";
import adminRoutes from "./src/routers/admin.js";
import cartRoutes from "./src/routers/cart.js";
import finanzaRoutes from "./src/routers/finanzas.js"
import historialRoutes from "./src/routers/historial.js";
import productRoutes from "./src/routers/productos.js";
import registerAdminRoutes from "./src/routers/registerAdmin.js";
import registeremployeerRoutes from "./src/routers/registerEmployeer.js";
import registerCustomerRoutes from "./src/routers/registerCustomer.js";
import ventaRoutes from "./src/routers/venta.js";
import suppliderRoutes from "./src/routers/supplider.js";
import promocionRoutes from "./src/routers/promocion.js";
import loginCustomerRoutes from "./src/routers/loginClientes.js";
import loginAdminRoutes from "./src/routers/loginAdmin.js";



// Nuevos Routers añadidos para compatibilidad / nuevas pantallas
import customersRouter from "./src/routers/customers.js";
import reviewsRouter from "./src/routers/reviews.js";

const app = express();

app.use(
  cors({
    origin: true,
    // permitir el envío de cookies y credenciales
    credentials: true,
  }),
);

//Usando cookie Parser
app.use(cookieParser());

//Que acepte los json desde postman
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rutas remotas y unificadas
app.use("/api/customer", customerRoutes);
app.use("/api/customers", customersRouter); // Plural
app.use("/api/employeer", employeerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/finanza", finanzaRoutes);
app.use("/api/historial", historialRoutes); // Unificado
app.use("/api/product", productRoutes);
app.use("/api/registerAdmin", registerAdminRoutes);
app.use("/api/registerEmployeer", registeremployeerRoutes);
app.use("/api/registerCustomer", registerCustomerRoutes);
app.use("/api/venta", ventaRoutes);
app.use("/api/reviews", reviewsRouter); // Plural
app.use("/api/supplider", suppliderRoutes);
app.use("/api/promocion", promocionRoutes);
app.use("/api/loginCliente", loginCustomerRoutes);
app.use("/api/loginAdmin", loginAdminRoutes);



export default app;