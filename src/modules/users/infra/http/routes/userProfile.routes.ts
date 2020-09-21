import { Router } from 'express';

import UserProfileController from '../controllers/UserProfileController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const userProfileRouter = Router();
const userProfileController = new UserProfileController();

userProfileRouter.use(ensureAuthenticated);

userProfileRouter.get('/', userProfileController.show);
userProfileRouter.put('/', userProfileController.update);

export default userProfileRouter;
