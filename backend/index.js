import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connect from './config/dbconnect.js';
import { adminOnly } from './middleware/authMiddleware.js';

// ROUTES
import colorRoutes from './routes/ColorRoutes.js';
import cutRoutes from './routes/CutRoutes.js';
import fluorescenceRoutes from './routes/FluorescenceRoutes.js';
import heightRoutes from './routes/HeightRoutes.js';
import lengthRoutes from './routes/LengthRoutes.js';
import polishRoutes from './routes/PolishRoutes.js';
import purityRoutes from './routes/PurityRoutes.js';
import shapeRoutes from './routes/ShapeRoutes.js';
import stoneRoutes from './routes/StoneRoutes.js';
import symmetryRoutes from './routes/SymmetryRoutes.js';
import tableRoutes from './routes/TableRoutes.js';
import tensionRoutes from './routes/TensionRoutes.js';
import widthRoutes from './routes/WidthRoutes.js';
import purchaseRoutes from './routes/PurchaseRoutes.js';
import packetRoutes from './routes/PacketRoutes.js';
import managerRoutes from './routes/ManagerRoutes.js';
import partyRoutes from './routes/PartyRoutes.js';
import departmentRoutes from './routes/DepartmentRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import assignRoutes from './routes/AssignRoutes.js';
import employeeRoutes from './routes/EmployeeRoutes.js';
import processRoutes from './routes/ProcessRoutes.js';
import transactionRoutes from './routes/TransactionRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DATABASE
await connect();

// ROUTE MOUNTING
// Apply Admin Only Middleware to Master and Purchase Mutations
app.use('/master', adminOnly); 
app.use('/purchase', adminOnly); // Careful, check if purchase GET is needed by others. Purchase list is usually admin/manager?
// Wait, if Manager buys packets, they might need POST /purchase?
// User said: "only admin can create a purchase" -> OK.

app.use('/master', colorRoutes);
app.use('/master', cutRoutes);
app.use('/master', fluorescenceRoutes);
app.use('/master', heightRoutes);
app.use('/master', lengthRoutes);
app.use('/master', polishRoutes);
app.use('/master', purityRoutes);
app.use('/master', shapeRoutes);
app.use('/master', stoneRoutes);
app.use('/master', symmetryRoutes);
app.use('/master', tableRoutes);
app.use('/master', tensionRoutes);
app.use('/master', widthRoutes);
app.use('/master', managerRoutes);
app.use('/master', partyRoutes);
app.use('/master', departmentRoutes);
app.use('/auth', authRoutes);
app.use('/master', employeeRoutes);
app.use('/master', processRoutes);
app.use('/assign', assignRoutes);
app.use('/', purchaseRoutes);
app.use('/', packetRoutes);
app.use('/', transactionRoutes);

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Force Restart
