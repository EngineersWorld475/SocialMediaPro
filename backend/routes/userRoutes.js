import express from 'express';
import {
  followUnFollowUser,
  getUser,
  getUserProfile,
  loginUser,
  logoutUser,
  searchUsers,
  signupUser,
  updateUser,
} from '../controllers/userController.js';
import protectRoute from '../middlewares/protectRoute.js';
const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/follow/:id', protectRoute, followUnFollowUser);
router.put('/update/:id', protectRoute, updateUser);
router.get('/profile/:username', getUserProfile);
router.get('/get-user/:id', getUser);
router.get('/search-user/:keyword', searchUsers);

export default router;
