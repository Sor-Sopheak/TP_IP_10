const users = require('../models/users')
const {decryptData} = require('../config/encrypt')

const login = async (email, password) => {
    try {
        console.log(email,password)
        var existed = await users.findOne({email})
        if(!existed){
            throw "Email is incorrected."
        } 
        if(!decryptData(password,existed.password)){
            throw "Password is incorrected."
        }
        return {
            success: true,
            data: existed
        }
    } catch (err) {
        return {
            success: false,
            err: err
        }
    }
}

module.exports = {
    login
}