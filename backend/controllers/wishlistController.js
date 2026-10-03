const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");


// ========================================
// GET USER WISHLIST
// ========================================

const getWishlist = async (
    req,
    res,
    next
) => {

    try {

        let wishlist =
            await Wishlist.findOne({

                user:
                    req.user._id

            }).populate(
                "products"
            );


        if (!wishlist) {

            wishlist =
                await Wishlist.create({

                    user:
                        req.user._id,

                    products: []
                });
        }


        res.status(200).json({

            success: true,

            count:
                wishlist.products.length,

            data:
                wishlist.products
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// ADD PRODUCT TO WISHLIST
// ========================================

const addToWishlist = async (
    req,
    res,
    next
) => {

    try {

        const {
            productId
        } = req.params;


        // ========================================
        // CHECK PRODUCT
        // ========================================

        const product =
            await Product.findById(
                productId
            );


        if (
            !product ||
            !product.isActive
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"
            });
        }


        // ========================================
        // FIND USER WISHLIST
        // ========================================

        let wishlist =
            await Wishlist.findOne({

                user:
                    req.user._id
            });


        // ========================================
        // CREATE NEW WISHLIST
        // ========================================

        if (!wishlist) {

            wishlist =
                await Wishlist.create({

                    user:
                        req.user._id,

                    products: [
                        productId
                    ]
                });

        } else {

            // ========================================
            // AVOID DUPLICATE
            // ========================================

            const alreadyExists =
                wishlist.products.some(

                    product =>
                        product.toString() ===
                        productId.toString()
                );


            if (!alreadyExists) {

                wishlist.products.push(
                    productId
                );

                await wishlist.save();
            }
        }


        // ========================================
        // UPDATED WISHLIST
        // ========================================

        const updatedWishlist =
            await Wishlist.findOne({

                user:
                    req.user._id

            }).populate(
                "products"
            );


        res.status(200).json({

            success: true,

            message:
                "Product added to wishlist",

            data:
                updatedWishlist.products
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// REMOVE PRODUCT FROM WISHLIST
// ========================================

const removeFromWishlist = async (
    req,
    res,
    next
) => {

    try {

        const {
            productId
        } = req.params;


        let wishlist =
            await Wishlist.findOne({

                user:
                    req.user._id
            });


        if (!wishlist) {

            return res.status(404).json({

                success: false,

                message:
                    "Wishlist not found"
            });
        }


        // ========================================
        // REMOVE PRODUCT
        // ========================================

        wishlist.products =
            wishlist.products.filter(

                product =>
                    product.toString() !==
                    productId.toString()
            );


        await wishlist.save();


        // ========================================
        // UPDATED WISHLIST
        // ========================================

        const updatedWishlist =
            await Wishlist.findOne({

                user:
                    req.user._id

            }).populate(
                "products"
            );


        res.status(200).json({

            success: true,

            message:
                "Product removed from wishlist",

            data:
                updatedWishlist.products
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {

    getWishlist,

    addToWishlist,

    removeFromWishlist
};