const { GstTds } = require('../model');

class TrasactionController {
    static async storeGstTds(req, res) {
        try {
          const { gst, daily_bonus, id } = req.body;
    
          // Validate request
          if (!gst || !daily_bonus) {
            return res.status(422).json({
              status: 'error',
              message: 'GST and daily bonus are required',
            });
          }
    
          // Update existing GST details if id is provided, otherwise create a new entry
          if (id) {
            const gstTds = await GstTds.findByIdAndUpdate(id, { gst, daily_bonus }, { new: true });
            if (!gstTds) {
              return res.status(404).json({
                status: 'error',
                message: 'GST details not found for update',
              });
            }
            return res.json({
              status: 'success',
              message: 'GST details updated successfully',
              data: gstTds,
            });
          } else {
            const gstTds = new GstTds({ gst, daily_bonus });
            await gstTds.save();
            return res.json({
              status: 'success',
              message: 'GST details added successfully',
              data: gstTds,
            });
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            error: error.message,
          });
        }
      }
}

module.exports = TrasactionController;