import express from 'express';
import {
  renderHtml,
  getAllUsers,
  addUser,
  updataUser,
  deleteUser,
  getCountUsers,
} from '../controllers/data_controllers.js';

const router = express.Router();

router.get('/', renderHtml);

// https://express.js.cn/en/api.html#router.route
router.route('/data').get(getAllUsers).post(addUser);
router.route('/data/:id').post(updataUser).delete(deleteUser);
router.route('/data/count').get(getCountUsers);

export default router;
