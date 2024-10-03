const Review = require("../models/review.model");
const Product = require("../models/product.model");
const Account = require("../models/account.model");
module.exports.addReview = async (req, res) => {
    try {
        const review = await Review.create(req.body);
        const reviews = await Review.find({ product_id: req.body.product_id });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        const product = await Product.findByIdAndUpdate(req.body.product_id, { rating: averageRating }, { new: true, runValidators: true });
        res.status(201).json({ review });
    } catch (error) {
        res.status(400).json({ error });
    }
};

module.exports.getReviewById = async (req, res) => {
    //   user_id
    //   user_name:
    //   user_avatar
    //   product_id:
    //   rating
    //   image: 
    //   content: 
    const { id } = req.params;
    try {
        const reviews = await Review.find({ product_id: id });
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ error: "Reviews not found" });
        }

        // Retrieve user information for each review
        const reviewsWithUserInfo = await Promise.all(reviews.map(async (review) => {
            const user = await Account.findById(review.user_id);
            if (user) {
                return {
                    ...review._doc,
                    user_name: user.userName,
                    user_avatar: user.avatar.url,
                };
            } else {
                return review;
            }
        }));
        console.log(reviewsWithUserInfo);
        res.status(200).json({ review: reviewsWithUserInfo });
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
        const reviews = await Review.find({ product_id: req.body.product_id });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        await Product.findByIdAndUpdate(req.body.product_id, { rating: averageRating });

        res.status(200).json({ review });
    } catch (error) {
        res.status(400).json({ error });
    }
}
module.exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    try {
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        const reviews = await Review.find({ product_id: review.product_id });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        await Product.findByIdAndUpdate(review.product_id, { rating: averageRating });

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error });
    }
}