import express from 'express'
const router = express.Router()
import 
    { deleteProduct, 
      getProductById, 
      getProducts,
      createProduct,
      updateProduct, 
      createProductReview, 
      getTopProducts,
      getElectronics,
      getSmartPhones,
      getComputers,
} from '../controllers/productController.js'
import { protect , admin } from '../middleware/authMiddleware.js'


router.route('/')
        .get(getProducts)
        .post(protect, admin, createProduct)
     
router.route('/:id/reviews')
        .post(protect, createProductReview)

router.get('/top', getTopProducts)

router.get('/electronics', getElectronics)
router.get('/smartphones', getSmartPhones)
router.get('/computers', getComputers)

router.route('/:id')
        .get(getProductById)
        .delete(protect, admin, deleteProduct)
        .put(protect, admin, updateProduct)
  


export default router