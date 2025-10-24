import express from 'express';
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateProduct,
  addReview
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Add
router.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  addProduct
);

// Update
router.post(
  '/update',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  updateProduct
);

router.post('/remove', adminAuth, removeProduct);
router.post('/single', singleProduct);
router.get('/list', listProducts);
router.post('/addReview', addReview);

export default router;
