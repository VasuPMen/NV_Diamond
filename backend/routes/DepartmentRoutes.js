import express from "express";
import Department from "../models/DepartmentSchema.js";

const router = express.Router();

router.post("/departments", async (req, res) => {
    try {
        const { name, shortName, managerName } = req.body;

        if(!name || !shortName || !managerName) {
            return res.status(400).json({
                success: false,
                message: "Name, Short Name, and Manager Name are required"
            });
        }

        const existingDepartment = await Department.findOne({ name });
        if (existingDepartment) {
            return res.status(400).json({
                success: false,
                message: "Department with this name already exists"
            });
        }

        const department = await Department.create({
            name,
            shortName,
            managerName
        });

        res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: department
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/departments", async (req, res) => {
    try {
        const departments = await Department.find()
            .populate("managerName");

        res.status(200).json({
            success: true,
            data: departments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


router.put("/departments/:id", async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: department
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.delete("/departments/:id", async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Department deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

export default router;