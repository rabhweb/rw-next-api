const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/'), // Adjust according to your folder structure
        },
        extensions: ['.ts', '.js', '.jsx', '.json'], // Add other extensions as needed
    },
};
