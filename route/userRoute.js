const express = require("express")
const router = express.Router()
const { registerController, loginController, updatePasswordController, updateProfileController, getUserProfileController, updateProfilePhotoController, getAuthorProfileController,getAllAuthorConroller } = require("../controller/userController")
const { auth } = require('../middleware/auth');


router.post('/register', registerController);
router.post('/login', loginController);
router.get('/getAllAuthor',getAllAuthorConroller);
router.post('/authorProfile', getAuthorProfileController);
router.post('/userProfile', auth, getUserProfileController);
router.put('/updateProfilePhoto', auth, updateProfilePhotoController);
router.put('/updatePassword', auth, updatePasswordController);
router.put('/updateProfile', auth, updateProfileController);

module.exports = router
