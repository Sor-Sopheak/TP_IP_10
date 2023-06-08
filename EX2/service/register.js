const users = require('../models/users');
const {encryptData} = require('../config/encrypt');
const moment = require('moment');

const register = async (param) => {
    const {email, username, firstName, lastName, password } = param;
    
    try{
        var existed = await users.findOne({email})
        if(existed){
            throw "Email is already used";
        }
        existed = await users.findOne({username})
        if(existed){
            throw "username is already used";
        }

        //encryptjs: encrypt password
        var hash = encryptData(password);

        //create a new user
        const currentDate = moment().format('DD-MM-YYYY hh:mm:ss A');
        const newUser = new users ({
            email: email,
            username: username,
            firstName: firstName,
            lastName: lastName,
            password: hash,
            createdAt: currentDate,
            updatedAt: currentDate
        })
        // const createUser = await users.create(newUser)
        const createUser = await users.create(newUser)
        console.log(createUser);

        return {
            success: true,
            data: createUser
        }
    }catch(err){
        return {
            success: false,
            err: err
        }
        
    }
}

module.exports = {
    register
}