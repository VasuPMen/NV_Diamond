import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connect from './config/dbconnect.js';

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
import assignRoutes from './routes/AssignRoutes.js';
import employeeRoutes from './routes/EmployeeRoutes.js';
import processRoutes from './routes/ProcessRoutes.js';

// CONFIG
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DATABASE
await connect();

// ROUTE MOUNTING
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
app.use('/master', employeeRoutes);
app.use('/master', processRoutes);
app.use('/assign', assignRoutes);
app.use('/', purchaseRoutes);
app.use('/', packetRoutes);

// TEST ROUTE
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
