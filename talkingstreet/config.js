var config = {
    production: {
        server_port_number: 9955,
        server_url: 'https://wyzechat.in:9955'
    },
    development: {
        server_port_number: 9955,
        server_url: 'http://localhost:9955'
    },
    common: {
        ga_pattern:'__GA__',
        dialogflow_id :'talking-street-c9ffc',
        main_url:'http://wyzechat.in:9955/web/message',
        
        nlp_name:'DialogFlow',
        

    }
}

const get = function (env) {
    const envSpecificConfiguration = config[env]
    const commonConfiguration = config.common
    const configuration = Object.assign({}, envSpecificConfiguration, commonConfiguration)
    return configuration
}

module.exports = get
