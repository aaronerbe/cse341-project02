const mongodb = require('../db/database');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');
//const errorChecks = require('../utils/errorChecks')
const { checkId } = require('../utils/errorChecks');

const getAll = async (req, res, next) => {
    //#swagger.tags=['Boats']
    //#swagger.summary='Retrieve a list of all boats'
    //#swagger.description='This endpoint retrieves all boats available in the database.'
    try {
        const result = await mongodb.getDatabase().db().collection('boats').find().toArray();

        if (!result.length) {
            return next(createError(400, 'No boats found in the database'));
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    //#swagger.tags=['Boats']
    //#swagger.summary='Get a boat by ID'
    //#swagger.description='This endpoint retrieves a specific boat by its ID.'
/* #swagger.parameters['id'] = {
        in: 'path',
        required: 'true',
        value: '650c5812c06bc031e32200b1',
} */
    try {
        const boatId = req.params.id;

        if (!ObjectId.isValid(boatId)) {
            return next(createError(400, 'Invalid Boat ID format. Must be a valid ObjectId'));
        }

        const objectId = new ObjectId(boatId);
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('boats')
            .findOne({ _id: objectId });

        if (!result) {
            return next(createError(404, 'Boat not found with the given ID'));
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        console.error(error.message);
        next(error);
    }
};

const createBoat = async (req, res, next) => {
    //todo need to validate that the ownerId is valid when creating and updating
    //todo move the checkOwnerId function into a utility middleware
    //#swagger.tags=['Boats']
    //#swagger.summary='Create a new boat'
    //#swagger.description='This endpoint creates a new boat in the database.'    
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new user.',
        schema: { $ref: '#/definitions/CreateBoat' }
    } */
    try {
        const boat = {
            ownerId: new ObjectId(req.body.ownerId),
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            location: req.body.location,
            pricePerDay: req.body.pricePerDay,
            features: req.body.features,
            amenities: req.body.amenities
        };
        //ERROR HANDLING Check OwnerID
        await checkId(boat.ownerId, "owners", "Owner");

        const response = await mongodb.getDatabase().db().collection('boats').insertOne(boat);

        if (response.acknowledged) {
            res.status(201).send();
        } else {
            res.status(500).json(response.error || 'Failed to create boat. Please try again.');
        }
    } catch (error) {
        next(error);
    }
};

const updateBoat = async (req, res, next) => {
    //#swagger.tags=['Boats']
    //#swagger.summary='Update an existing boat'
    //#swagger.description='This endpoint updates an existing boat in the database.'    
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new user.',
        schema: { $ref: '#/definitions/UpdateBoat' }
    } */    
    try {
        const boatId = req.params.id;

        if (!ObjectId.isValid(boatId)) {
            return next(createError(400, 'Invalid Boat ID format. Must be a valid ObjectId'));
        }

        const objectId = new ObjectId(boatId);
        const boat = {
            ownerId: new ObjectId(req.body.ownerId),
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            location: req.body.location,
            pricePerDay: req.body.pricePerDay,
            features: req.body.features,
            amenities: req.body.amenities
        };

        await checkId(boat.ownerId, "owners", "Owner");
        await checkId(boatId, "boats", "Boat");

        const result = await mongodb
            .getDatabase()
            .db()
            .collection('boats')
            .replaceOne({ _id: objectId }, boat);

        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            return next(createError(500, 'Failed to update boat. Please try again.'));
        }
    } catch (error) {
        next(error);
    }
};

const deleteBoat = async (req, res, next) => {
    //#swagger.tags=['Boats']
    //#swagger.summary='Delete a boat'
    //#swagger.description='This endpoint deletes a specific boat by its ID from the database.'    
    try {
        const boatId = req.params.id;

        if (!ObjectId.isValid(boatId)) {
            return next(createError(400, 'Invalid Boat ID format. Must be a valid ObjectId'));
        }

        const objectId = new ObjectId(boatId);

        await checkId(boatId, "boats", "Boat");

        const result = await mongodb
            .getDatabase()
            .db()
            .collection('boats')
            .deleteOne({ _id: objectId });

        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            return next(createError(500, 'Failed to delete boat. Please try again.'));
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    createBoat,
    updateBoat,
    deleteBoat
};
