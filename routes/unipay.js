const express =require('express')
const router=express.Router()
const {testing,signup,signin,about,update,auth,balance,transfer,listOfUsers,transactions,generateQRCode}=require('../controllers/unipay')



router.route('/user/signup').get(testing).post(signup)
router.route('/user/signin').get(testing).post(signin)
// router.route('/user').get(testing) (frontend)
// router.route('/user/getBalance').get(testing) (ahref)
router.route('/user/update').get(testing).put(auth,update)
router.route('/user/listOfUsers').get(listOfUsers)
router.route('/user/about/:userId').get(about)
// router.route('/user/transfer').get(testing) (ahref)
// router.route('/user/notification').get(testing) (aws)
router.route('/account/balance').get(balance)
router.route('/account/transfer').post(auth,transfer)

// Transactions
router.route('/user/transactions/:userId').get(transactions);
router.route('/user/qr/:userId').get(generateQRCode);

module.exports=router

