const db = require("../config/db")
const Categories = require("../models/categoryModel")

// Create Category
const addCategory = async (req, res) => {
    try {
        const result = await Categories.addCategory(req.body);
        res.status(201).json({ message: 'Category added successfully', data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Categories.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Category by ID
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Categories.getCategoryById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body, category_id: id };

    try {
        const result = await Categories.updateCategory(updateData);
        res.status(200).json({ message: 'Category updated successfully', data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Category
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Categories.deleteCategory(id);
        res.status(200).json({ message: 'Category deleted successfully', data: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
