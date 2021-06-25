const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express();
const port = process.env.PORT || 3000; // the port number we fetch it from environment if available

// Define path for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// set up handlebar location and view paths
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'DK'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'DK'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        helperMessage: 'This is some helpful text',
        title: 'Help',
        name: 'DK'
    });
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }
    // res.send({
    //     forecast:'It is snowing',
    //     location: 'philadelphia'
    // });

    geocode(req.query.address, (error, { latitude, longitude, location }={}) => {
        if (error) {
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                location,
                forecastData,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    });
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found.',
        title: 'Help',
        name: 'DK'
    });
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found.',
        title: 'Help',
        name: 'DK'
    });
})

app.listen(port, ()=> {
    console.log("Server is up and running on port ", port)
})