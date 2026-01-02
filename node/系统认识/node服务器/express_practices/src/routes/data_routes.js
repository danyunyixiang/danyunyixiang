import express from 'express';
import {
  renderHtml,
  Routing,
  dataPost,
} from '../controllers/data_controllers.js';

const router = express.Router();

router.get('/', renderHtml);

// https://express.js.cn/en/api.html#router.route
// router.route('/data').get(Routing).post(dataPost);
router.get('/:Routing', Routing);
router.post('/data', dataPost);

export default router;
