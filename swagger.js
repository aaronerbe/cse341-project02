const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Boat Rental API',
        description: 'API Assignment CSE341 - Project02'
    },
    host: 'localhost:8080',
    definitions: {
        CreateOwner: {
            firstName: 'Aaron',
            lastName: 'Erbe', 
            email: 'aerbe@example.com',
            password: 'Password1!',
        },
        UpdateOwner: {
            firstName: 'A-Aron',
            lastName: 'Erbe', 
            email: 'aerbe@example.com',
            password: 'NewPassword1!',
        },
        CreateBoat: {
            ownerId: '650c5812c06bc031e32200a1',
            name: 'Leopard Catamaran',
            type: 'Sailboat',
            description: 'Blue Water Sailing Catamaran',
            location: 'Annapolis',
            pricePerDay: 800,
            features: ['GPS','Anchor', 'Code Zero', 'Dingy'],
            amenities: ['Kitchen', '3 Bath', 'Master Suite', '3 Bedroom']
        },
        UpdateBoat: {
            ownerId: '650c5812c06bc031e32200a1',
            name: 'Leopard Catamaran',
            type: 'Sailboat',
            description: 'Coastal Sailing Catamaran',
            location: 'Miami',
            pricePerDay: 800,
            features: ['GPS','Anchor', 'Code Zero', 'Dingy'],
            amenities: ['Kitchen', '3 Bath', 'Master Suite', '3 Bedroom']
        }
    }
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
