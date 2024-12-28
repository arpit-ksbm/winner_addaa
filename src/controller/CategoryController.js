const { Category } = require("../model/index")

class CategoryController {
    static async createCategory(req, res) {
        try {
            const { category_name, win } = req.body
            const category = new Category({ category_name, win })
            await category.save()
            return res.status(201).json({ message: "Category created successfully", category })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    static async getCategories(req, res) {
        try {
            const categories = await Category.find()
            return res.status(200).json({ categories })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    static async getCategoryById(req, res) {
        try {
            const { id } = req.params
            const category = await Category.findById(id)
            return res.status(200).json({ category })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    static async updateCategory(req, res) {
        try {
            const { id } = req.params
            const { category_name, win } = req.body
            const category = await Category.findByIdAndUpdate(id, { category_name, win }, { new: true })
            return res.status(200).json({ message: "Category updated successfully", category })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    static async deleteCategory(req, res) {
        try {
            const { id } = req.params
            await Category.findByIdAndDelete(id)
            return res.status(200).json({ message: "Category deleted successfully" })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = CategoryController;