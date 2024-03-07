/**--------------------------------------------------------------------------------------------------- **/
/**                                          IMPORT DOTENV                                             **/
/**--------------------------------------------------------------------------------------------------- **/
require('dotenv').config();



/**--------------------------------------------------------------------------------------------------- **/
/**                                       IMPORT MIDDLEWARE                                            **/
/**--------------------------------------------------------------------------------------------------- **/
const methodOverride = require('method-override');
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');






const app = express();

/**--------------------------------------------------------------------------------------------------- **/
/**                                             DB CONNECTION                                          **/
/**--------------------------------------------------------------------------------------------------- **/
const connectDB = require('./server/config/db');
connectDB();

/**--------------------------------------------------------------------------------------------------- **/
/**                                        MIDDLE WARE CONFIG                                          **/
/**--------------------------------------------------------------------------------------------------- **/
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));



// app.use(session ({
//     secret: 'keyboardcat',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//         mongoUrl: process.env.MONGO_URI
//     }),
// }));

// app.use(
//     session({
//       secret: 'keyboard cat',
//       resave: false,
//       saveUninitialized: false,
//       store: MongoStore.create({
//         clientOptions: { 
//           useNewUrlParser: true,
//           useUnifiedTopology: true,
//           serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
//         },
//         uri: process.env.MONGO_URI
//       }),
//       cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
//     })
//   );


app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
      }),
      cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    })
);




app.use(express.static('public'));


/**--------------------------------------------------------------------------------------------------- **/
/**                                          TEMPLATING ENGINE                                         **/
/**--------------------------------------------------------------------------------------------------- **/
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


/**--------------------------------------------------------------------------------------------------- **/
/**                                                 ROUTES                                             **/
/**--------------------------------------------------------------------------------------------------- **/
app.use('/', require('./server/routes/mainRoutes'));
app.use('/', require('./server/routes/adminRoutes'));


/**--------------------------------------------------------------------------------------------------- **/
/**                                          RUN EXPRESS SERVER                                        **/
/**--------------------------------------------------------------------------------------------------- **/
app.listen(process.env.PORT || 8000, () =>{
    console.log(`App is running on port ${process.env.PORT}`);
})