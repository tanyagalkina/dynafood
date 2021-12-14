const logger = (req, res, next) => {
    //console.log ("Hello, I am the logger");
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    next();
}


export default logger;