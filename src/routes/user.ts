import express from 'express';
import { userController } from '../controller';

const router = express.Router();

router.post('/login', userController.userLogin);
router.post('/signUp', userController.userSignUp);
router.get('/products', userController.listProducts);

export const userRoutes = router;
