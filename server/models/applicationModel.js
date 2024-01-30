const mongoose = require('mongoose');



const applicationSchema = mongoose.Schema(
{
    first_name: {
        type: String,
        require: [true, 'First Name Field can not be blank' ]
    }

})



