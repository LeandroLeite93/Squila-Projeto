module.export = {
    mongodbMemoryServerOptions: {
        instance: {
            dbName: 'jest'
        },
        binary: {
            version: '4.0.3',
            skipMDS: true
        },
        autoStart: false
    }
};