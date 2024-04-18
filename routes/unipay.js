const express =require('express')
const router=express.Router()
const {testing,signup,signin,about,update,auth,balance,transfer}=require('../controllers/unipay')



router.route('/user/signup').get(testing).post(signup)
router.route('/user/signin').get(testing).post(signin)
// router.route('/user').get(testing) (frontend)
// router.route('/user/getBalance').get(testing) (ahref)
router.route('/user/update').get(testing).put(auth,update)
router.route('/user/about').get(about)
// router.route('/user/transfer').get(testing) (ahref)
// router.route('/user/notification').get(testing) (aws)
router.route('/account/balance').get(balance)
router.route('/account/transfer').post(transfer)

module.exports=router

