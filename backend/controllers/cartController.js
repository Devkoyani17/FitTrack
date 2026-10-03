const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ========================================
// GET CART
// ========================================

const getCart = async (req, res, next) => {

    try {

        let cart =
            await Cart.findOne({
                user: req.user._id
            }).populate(
                "items.product"
            );


        if (!cart) {

            cart =
                await Cart.create({
                    user: req.user._id,
                    items: []
                });

            cart =
                await Cart.findById(
                    cart._id
                ).populate(
                    "items.product"
                );
        }


        let totalItems = 0;
        let totalPrice = 0;


        cart.items.forEach(item => {

            if (item.product) {

                totalItems +=
                    item.quantity;

                totalPrice +=
                    item.product.price *
                    item.quantity;
            }
        });


        res.status(200).json({

            success: true,

            data: {

                cart,

                totalItems,

                totalPrice:
                    parseFloat(
                        totalPrice.toFixed(2)
                    )
            }
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// ADD TO CART
// ========================================

const addToCart = async (req, res, next) => {

    try {

        const {
            productId,
            quantity
        } = req.body;


        if (!productId) {

            return res.status(400).json({

                success: false,

                message:
                    "Product ID is required"
            });
        }


        const product =
            await Product.findById(
                productId
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"
            });
        }


        if (!product.isActive) {

            return res.status(400).json({

                success: false,

                message:
                    "Product is not available"
            });
        }


        const requestedQuantity =
            quantity || 1;


        if (
            requestedQuantity <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Quantity must be at least 1"
            });
        }


        if (
            requestedQuantity >
            product.stock
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Insufficient product stock"
            });
        }


        let cart =
            await Cart.findOne({

                user: req.user._id

            });


        if (!cart) {

            cart =
                await Cart.create({

                    user:
                        req.user._id,

                    items: [
                        {
                            product:
                                productId,

                            quantity:
                                requestedQuantity
                        }
                    ]
                });

        } else {

            const existingItem =
                cart.items.find(

                    item =>
                        item.product.toString() ===
                        productId.toString()
                );


            if (existingItem) {

                const newQuantity =
                    existingItem.quantity +
                    requestedQuantity;


                if (
                    newQuantity >
                    product.stock
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Requested quantity exceeds available stock"
                    });
                }


                existingItem.quantity =
                    newQuantity;

            } else {

                cart.items.push({

                    product:
                        productId,

                    quantity:
                        requestedQuantity
                });
            }


            await cart.save();
        }


        cart =
            await Cart.findById(
                cart._id
            ).populate(
                "items.product"
            );


        res.status(200).json({

            success: true,

            message:
                "Product added to cart",

            data:
                cart
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// UPDATE CART ITEM
// ========================================

const updateCartItem = async (
    req,
    res,
    next
) => {

    try {

        const {
            quantity
        } = req.body;


        if (
            quantity === undefined ||
            quantity < 1
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Valid quantity is required"
            });
        }


        const cart =
            await Cart.findOne({

                user:
                    req.user._id

            });


        if (!cart) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart not found"
            });
        }


        const item =
            cart.items.id(
                req.params.itemId
            );


        if (!item) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart item not found"
            });
        }


        const product =
            await Product.findById(
                item.product
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"
            });
        }


        if (
            quantity >
            product.stock
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Quantity exceeds available stock"
            });
        }


        item.quantity =
            quantity;


        await cart.save();


        const updatedCart =
            await Cart.findById(
                cart._id
            ).populate(
                "items.product"
            );


        res.status(200).json({

            success: true,

            message:
                "Cart item updated",

            data:
                updatedCart
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// REMOVE CART ITEM
// ========================================

const removeFromCart = async (
    req,
    res,
    next
) => {

    try {

        const cart =
            await Cart.findOne({

                user:
                    req.user._id

            });


        if (!cart) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart not found"
            });
        }


        const item =
            cart.items.id(
                req.params.itemId
            );


        if (!item) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart item not found"
            });
        }


        item.deleteOne();


        await cart.save();


        const updatedCart =
            await Cart.findById(
                cart._id
            ).populate(
                "items.product"
            );


        res.status(200).json({

            success: true,

            message:
                "Product removed from cart",

            data:
                updatedCart
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// CLEAR CART
// ========================================

const clearCart = async (
    req,
    res,
    next
) => {

    try {

        const cart =
            await Cart.findOne({

                user:
                    req.user._id

            });


        if (!cart) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart not found"
            });
        }


        cart.items = [];


        await cart.save();


        res.status(200).json({

            success: true,

            message:
                "Cart cleared successfully",

            data:
                cart
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {

    getCart,

    addToCart,

    updateCartItem,

    removeFromCart,

    clearCart
};