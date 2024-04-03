const express =require('express')
const router=express.Router()
const {testing,signup,signin,about,update,auth,balance,transfer}=require('../controllers/unipay')



router.route('/signup').get(testing).post(signup)
router.route('/signin').get(testing).post(signin)
router.route('/user').get(testing)
router.route('/user/getBalance').get(testing)
router.route('/user/update').get(testing).put(auth,update)
router.route('/user/about').get(about)
router.route('/user/transfer').get(testing)
router.route('/user/notification').get(testing)
router.route('/account/balance').get(auth,balance)
router.route('/account/transfer').get(testing).post(auth,transfer)

module.exports=router

