const Review = require("../models/review.model");
const Product = require("../models/product.model");
module.exports.addReview = async (req, res) => {
    try {
        const review = await Review.create(req.body);
        const reviews = await Review.find({product_id: req.body.product_id });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        const product = await Product.findByIdAndUpdate(req.body.product_id, { rating: averageRating }, { new: true, runValidators: true });
        res.status(201).json({ review });
    } catch (error) {
        res.status(400).json({ error });
    }
};

module.exports.getReviewById = async (req, res) => {
    const { id } = req.params;
    try {
    const review = await Review.find({ product_id: id });        
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.status(200).json({ review });
    } catch (error) {
        res.status(400).json({ error });
    }
}

module.exports.updateReview = async (req, res) => {
    const { reviewId } = req.params;
    try {
        const review = await Review.findByIdAndUpdate(reviewId, req.body, { new: true, runValidators: true });
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        const reviews = await Review.find({product_id: req.body.product_id });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        await Product.findByIdAndUpdate(req.body.product_id, { rating: averageRating });

        res.status(200).json({ review });
    } catch (error) {
        res.status(400).json({ error });
    }
}