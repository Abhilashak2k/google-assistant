const winston = require("winston"),
    logDir = `${__dirname}/log_files`,
    fs = require("fs"),
    winstonDaily = require("winston-daily-rotate-file");

(function() {
    "use strict";

    if (!fs.existsSync(logDir)) {
        // create the directory if it does not exist
        fs.mkdirSync(logDir);
    }
    const tsFormat = () => new Date().toLocaleTimeString(),
        
        nlpHistory = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [
             
            new winston.transports.File({ filename: `${logDir}/nlp_history.log` })
            ]
        });
 
      
        

    
    
    



    

    module.exports = {
        
        nlpHistory: nlpHistory
        
    };
})();
