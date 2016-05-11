module.exports = {  
    entry: [    
        './app/App.js'  
        ],  
        output: {    
            path: __dirname,    
            filename: "bundle.js"  
        },  
        module: {    
            loaders: [{      
                test: /\.jsx?$/,      
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015','react']
                }   
            }]  
        } 
};
