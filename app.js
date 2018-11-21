const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const { startDB } = require('./util/database')
const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use( async (req,res,next) => {
    try {
        const user = await User.findById('5bf5b98a68c0e45d12979984')
        req.user = user
        next()
    } catch (error) {
        console.log(error);
    }
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

startDB(() => {
    app.listen(3000)
})
