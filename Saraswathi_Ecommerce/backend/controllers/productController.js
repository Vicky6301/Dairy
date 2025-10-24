import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// Add Product (with variants & optional video)
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      tabDescription,
      category,
      subCategory,
      bestseller
    } = req.body;

    // ✅ SAFE: Check if variants exist
    if (!req.body.variants) {
      console.error("Missing variants in request body");
      return res.status(400).json({
        success: false,
        message: "Variants are required"
      });
    }

    let variants;
    try {
      // ✅ Parse safely
      variants = JSON.parse(req.body.variants);
    } catch (parseError) {
      console.error("Failed to parse variants:", req.body.variants, parseError);
      return res.status(400).json({
        success: false,
        message: "Invalid variants format. Expected JSON array."
      });
    }

    // Validate structure
    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one variant is required"
      });
    }

    for (const v of variants) {
      if (!v.size || typeof v.price !== 'number' || v.price <= 0) {
        return res.status(400).json({
          success: false,
          message: "Each variant must have a valid size and positive price"
        });
      }
    }

    // Upload images
    const imageFiles = ['image1', 'image2', 'image3', 'image4']
      .map(name => req.files?.[name]?.[0])
      .filter(Boolean);

    const imagesUrl = [];
    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(file =>
        cloudinary.uploader.upload(file.path, { resource_type: 'image' })
          .then(r => r.secure_url)
      );
      const urls = await Promise.all(uploadPromises);
      imagesUrl.push(...urls);
    }

    // ✅ Upload optional video
    let videoUrl = "";
    if (req.files?.video?.[0]) {
      try {
        const result = await cloudinary.uploader.upload(req.files.video[0].path, {
          resource_type: 'video'
        });
        videoUrl = result.secure_url;
      } catch (err) {
        console.error("Video upload failed:", err);
      }
    }

    // Save product
    const product = new productModel({
      name,
      description,
      tabDescription: tabDescription || "",
      category,
      subCategory,
      bestseller: bestseller === "true",
      variants, 
      image: imagesUrl,
      video: videoUrl, // <-- new field
      date: Date.now()
    });

    await product.save();
    res.json({
      success: true,
      message: "Product added successfully",
      product
    });

  } catch (error) {
    console.error("🔥 Add Product Server Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Update Product (with video support and file replacement)
const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      tabDescription,
      category,
      subCategory,
      bestseller,
      variants: variantsStr
    } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Parse variants
    let parsedVariants = null;
    if (variantsStr) {
      try {
        parsedVariants = JSON.parse(variantsStr);
        if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) throw new Error();
        parsedVariants.forEach(v => {
          if (!v.size || typeof v.price !== "number" || v.price <= 0) throw new Error();
        });
        product.variants = parsedVariants;
      } catch {
        return res.status(400).json({ success: false, message: "Invalid variants format" });
      }
    }

    // Update basic fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (tabDescription !== undefined) product.tabDescription = tabDescription;
    if (category !== undefined) product.category = category;
    if (subCategory !== undefined) product.subCategory = subCategory;
    if (bestseller !== undefined) product.bestseller = bestseller === "true";

    // Handle images (1-4)
    let newImages = [...product.image]; // copy existing
    for (let i = 1; i <= 4; i++) {
      const file = req.files?.[`image${i}`]?.[0];
      const urlFromBody = req.body[`image${i}`];

      if (file) {
        // Delete old file from Cloudinary if exists
        if (newImages[i - 1]) {
          try {
            const publicId = newImages[i - 1].split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
          } catch (err) { console.log("Old image deletion failed:", err); }
        }
        // Upload new
        const result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
        newImages[i - 1] = result.secure_url;
      } else if (urlFromBody !== undefined) {
        newImages[i - 1] = urlFromBody; // keep old if exists
      }
    }
    product.image = newImages.slice(0, 4);

    // Handle video
    let videoUrl = product.video || "";
    if (req.files?.video?.[0]) {
      // Delete old video
      if (videoUrl) {
        try {
          const publicId = videoUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
        } catch (err) { console.log("Old video deletion failed:", err); }
      }
      const result = await cloudinary.uploader.upload(req.files.video[0].path, { resource_type: "video" });
      videoUrl = result.secure_url;
    } else if (req.body.video) {
      videoUrl = req.body.video; // keep old
    }
    product.video = videoUrl;

    await product.save();
    res.json({ success: true, message: "Product updated successfully", product });

  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};


// Add Review
const addReview = async (req, res) => {
  try {
    const { productId, user, rating, comment } = req.body;
    if (!productId || !user?.trim() || !comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "User name, comment, and product ID are required"
      });
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5"
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const newReview = {
      user: user.trim(),
      rating: ratingNum,
      comment: comment.trim()
    };

    product.reviews.push(newReview);
    await product.save();

    res.json({
      success: true,
      message: "Review added successfully",
      reviews: product.reviews
    });

  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review"
    });
  }
};

// Other existing functions
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.body.productId);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateProduct,
  addReview
};
