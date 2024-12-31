const { CouponDetails } = require('../model/index');

class CouponController {
    // List all coupons
    static async couponList(req, res) {
        try {
            const coupons = await CouponDetails.find().sort({ created_at: -1 }); // Sort by newest
            return res.status(200).json({ status: 'success', data: coupons });
        } catch (error) {
            console.error('Error fetching coupons:', error);
            return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }

    // Create a new coupon
    static async createCoupon(req, res) {
        try {
            const { 
                coupon_name, coupon_type, min, max, single_use, balance_type, 
                expire_on, coupon_description, coupon_amount, status 
            } = req.body;

            const newCoupon = new CouponDetails({
                coupon_name,
                coupon_type,
                min,
                max,
                single_use,
                balance_type,
                expire_on,
                coupon_description,
                coupon_amount,
                status,
            });

            await newCoupon.save();
            return res.status(201).json({ status: 'success', message: 'Coupon created successfully', data: newCoupon });
        } catch (error) {
            console.error('Error creating coupon:', error);
            return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }

    // Get a single coupon by ID
    static async getCouponById(req, res) {
        try {
            const { id } = req.params;
            const coupon = await CouponDetails.findById(id);

            if (!coupon) {
                return res.status(404).json({ status: 'error', message: 'Coupon not found' });
            }

            return res.status(200).json({ status: 'success', data: coupon });
        } catch (error) {
            console.error('Error fetching coupon:', error);
            return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }

    // Update a coupon by ID
    static async updateCoupon(req, res) {
        try {
            const { id } = req.params;
            const {
                coupon_name, coupon_type, min, max, single_use, balance_type,
                expire_on, coupon_description, coupon_amount, status
            } = req.body;

            const updatedCoupon = await CouponDetails.findByIdAndUpdate(
                id,
                {
                    coupon_name,
                    coupon_type,
                    min,
                    max,
                    single_use,
                    balance_type,
                    expire_on,
                    coupon_description,
                    coupon_amount,
                    status,
                },
                { new: true } // Return the updated document
            );

            if (!updatedCoupon) {
                return res.status(404).json({ status: 'error', message: 'Coupon not found' });
            }

            return res.status(200).json({ status: 'success', message: 'Coupon updated successfully', data: updatedCoupon });
        } catch (error) {
            console.error('Error updating coupon:', error);
            return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }

    // Delete a coupon by ID
    static async deleteCoupon(req, res) {
        try {
            const { id } = req.params;
            const deletedCoupon = await CouponDetails.findByIdAndDelete(id);

            if (!deletedCoupon) {
                return res.status(404).json({ status: 'error', message: 'Coupon not found' });
            }

            return res.status(200).json({ status: 'success', message: 'Coupon deleted successfully' });
        } catch (error) {
            console.error('Error deleting coupon:', error);
            return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }
}

module.exports = CouponController;
