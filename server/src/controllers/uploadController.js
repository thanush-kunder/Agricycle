/**
 * Upload Controller
 * Handles image file uploads for crop residue listings & verification
 * Author: Samarth (Member 4 - AI + Images + Testing)
 */

export const uploadImages = (req, res) => {
  try {
    let uploadedFiles = [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      uploadedFiles = req.files;
    } else if (req.file) {
      uploadedFiles = [req.file];
    } else {
      return res.status(400).json({
        success: false,
        message: 'No image files provided for upload.',
      });
    }

    const fileDetails = uploadedFiles.map((file) => ({
      url: `/uploads/${file.filename}`,
      publicId: file.filename,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    return res.status(200).json({
      success: true,
      message: `${fileDetails.length} image(s) uploaded successfully`,
      count: fileDetails.length,
      data: fileDetails,
    });
  } catch (error) {
    console.error('Image upload controller error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing file upload',
    });
  }
};
