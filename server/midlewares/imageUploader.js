const express = require('express');
const User = require('../models/userModel');
const adminUser = require('../models/adminUserModel');

const adminLayout = '../views/layouts/adminLogin';







const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {new:true})
        const {_id:id, name, photourl} =updatedUser

        
    }catch {

    }
}