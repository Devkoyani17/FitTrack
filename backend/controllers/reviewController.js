const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");


// ========================================
// ADD / UPDATE PRODUCT REVIEW
// ========================================

const addProductReview = async (
    req,
    res,
    next
) => {

    try {

        const {
            rating,
            comment
        } = req.body;

        const productId =
            req.params.id;


        // ========================================
        // VALIDATION
        // ========================================

        if (
            rating === undefined ||
            !comment
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Rating and comment are required"
            });
        }


        if (
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Rating must be between 1 and 5"
            });
        }


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
        // VERIFY PURCHASE
        // ========================================

        const hasPurchased =
            await Order.findOne({

                user:
                    req.user._id,

                "orderItems.product":
                    productId,

                orderStatus: {
                    $in: [
                        "Delivered",
                        "Shipped",
                        "Processing",
                        "Confirmed"
                    ]
                }
            });


        // Admin can review without purchase
        if (
            !hasPurchased &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can only review products you have purchased"
            });
        }


        // ========================================
        // CHECK EXISTING REVIEW
        // ========================================

        let review =
            await Review.findOne({

                user:
                    req.user._id,

                product:
                    productId
            });


        if (review) {

            // ========================================
            // UPDATE EXISTING REVIEW
            // ========================================

            review.rating =
                Number(rating);

            review.comment =
                comment;

            await review.save();

        } else {

            // ========================================
            // CREATE NEW REVIEW
            // ========================================

            review =
                await Review.create({

                    user:
                        req.user._id,

                    product:
                        productId,

                    order:
                        hasPurchased
                            ? hasPurchased._id
                            : null,

                    rating:
                        Number(rating),

                    comment
                });
        }


        // ========================================
        // RECALCULATE PRODUCT RATING
        // ========================================

        const reviews =
            await Review.find({

                product:
                    productId
            });


        const totalRating =
            reviews.reduce(

                (total, currentReview) =>
                    total +
                    currentReview.rating,

                0
            );


        const averageRating =
            totalRating /
            reviews.length;


        product.rating =
            parseFloat(
                averageRating.toFixed(1)
            );

        product.numReviews =
            reviews.length;


        await product.save();


        res.status(201).json({

            success: true,

            message:
                "Review submitted successfully",

            data:
                review
        });

    } catch (error) {

        next(error);
    }
};


// ========================================
// GET PRODUCT REVIEWS
// ========================================

const getProductReviews = async (
    req,
    res,
    next
) => {

    try {

        const reviews =
            await Review.find({

                product:
                    req.params.id

            })
                .populate(
                    "user",
                    "name profileImage"
                )
                .sort({

                    createdAt: -1

                });


        res.status(200).json({

            success: true,

            count:
                reviews.length,

            data:
                reviews
        });

    } catch (error) {

        next(error);
    }
};


module.exports = {

    addProductReview,

    getProductReviews
};