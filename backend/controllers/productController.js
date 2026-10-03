const Product = require("../models/Product");


// ========================================
// GET ALL PRODUCTS
// ========================================

const getProducts = async (req, res, next) => {

    try {

        const {
            category,
            search
        } = req.query;


        let query = {
            isActive: true
        };


        if (category) {

            query.category = category;
        }


        if (search) {

            query.$or = [

                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    brand: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];
        }


        const products =
            await Product.find(query)
                .sort({
                    createdAt: -1
                });


        res.status(200).json({

            success: true,

            count:
                products.length,

            data:
                products
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// GET SINGLE PRODUCT
// ========================================

const getProductById = async (req, res, next) => {

    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"
            });
        }


        res.status(200).json({

            success: true,

            data:
                product
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// CREATE PRODUCT
// ========================================

const createProduct = async (req, res, next) => {

    try {

        const {
            name,
            description,
            category,
            price,
            originalPrice,
            stock,
            image,
            brand
        } = req.body;


        if (
            !name ||
            !description ||
            !category ||
            price === undefined ||
            stock === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, description, category, price and stock are required"
            });
        }


        const product =
            await Product.create({

                name,

                description,

                category,

                price,

                originalPrice:
                    originalPrice || 0,

                stock,

                image:
                    image || "",

                brand:
                    brand || ""
            });


        res.status(201).json({

            success: true,

            message:
                "Product created successfully",

            data:
                product
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// UPDATE PRODUCT
// ========================================

const updateProduct = async (req, res, next) => {

    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"
            });
        }


        const {
            name,
            description,
            category,
            price,
            originalPrice,
            stock,
            image,
            brand,
            isActive
        } = req.body;


        if (name !== undefined)
            product.name = name;

        if (description !== undefined)
            product.description = description;

        if (category !== undefined)
            product.category = category;

        if (price !== undefined)
            product.price = price;

        if (originalPrice !== undefined)
            product.originalPrice = originalPrice;

        if (stock !== undefined)
            product.stock = stock;

        if (image !== undefined)
            product.image = image;

        if (brand !== undefined)
            product.brand = brand;

        if (isActive !== undefined)
            product.isActive = isActive;


        const updatedProduct =
            await product.save();


        res.status(200).json({

            success: true,

            message:
                "Product updated successfully",

            data:
                updatedProduct
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// DELETE PRODUCT
// ========================================

const deleteProduct = async (req, res, next) => {

    try {

        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"
            });
        }


        await product.deleteOne();


        res.status(200).json({

            success: true,

            message:
                "Product deleted successfully"
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {

    getProducts,

    getProductById,

    createProduct,

    updateProduct,

    deleteProduct
};