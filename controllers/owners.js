const mongodb = require('../db/database');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');
const { checkId } = require('../utils/errorChecks');


const getAll = async (req, res, next) => {
    //#swagger.tags=['Owners']
    //#swagger.summary='Retrieve a list of all owners'
    //#swagger.description='This endpoint retrieves all owners available in the database.'
    try {
        const result = await mongodb.getDatabase().db().collection('owners').find().toArray();

        if (!result.length) {
            return next(createError(400, 'No owners found in the database'));
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    //#swagger.tags=['Owners']
    //#swagger.summary='Get an owner by ID'
    //#swagger.description='This endpoint retrieves a specific owner by its ID.'    
    /* #swagger.parameters['id'] = {
            in: 'path',
            required: 'true',
            value: '650c5812c06bc031e32200a1',
    } */
    try {
        const ownerId = req.params.id;

        if (!ObjectId.isValid(ownerId)) {
            return next(createError(400, 'Invalid Owner ID format. Must be a valid ObjectId'));
        }

        const objectId = new ObjectId(ownerId);
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('owners')
            .findOne({ _id: objectId });

        if (!result) {
            return next(createError(404, 'Owner not found with the given ID'));
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const createOwner = async (req, res, next) => {
    //#swagger.tags=['Owners']
    //#swagger.summary='Create a new owner'
    //#swagger.description='This endpoint creates a new owner in the database.'    
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new user.',
        schema: { $ref: '#/definitions/CreateOwner' }
    } */    
    try {
        const owner = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        };
        const response = await mongodb.getDatabase().db().collection('owners').insertOne(owner);

        if (response.acknowledged) {
            res.status(201).send();
        } else {
            res.status(500).json(response.error || 'Failed to create owner. Please try again.');
        }
    } catch (error) {
        next(error);
    }
};

const updateOwner = async (req, res, next) => {
    //#swagger.tags=['Owners']
    //#swagger.summary='Update an existing owner'
    //#swagger.description='This endpoint updates an existing owner in the database.'    
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new user.',
        schema: { $ref: '#/definitions/UpdateOwner' }
    } */
    try {
        const ownerId = req.params.id;

        if (!ObjectId.isValid(ownerId)) {
            return next(createError(400, 'Invalid Owner ID format. Must be a valid ObjectId'));
        }

        const objectId = new ObjectId(ownerId);

        const owner = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        };

        await checkId(ownerId, "owners", "Owner");
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('owners')
            .replaceOne({ _id: objectId }, owner);

        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            return next(createError(500, 'Failed to update owner. Please try again.'));
        }
    } catch (error) {
        next(error);
    }
};

const deleteOwner = async (req, res, next) => {
    //#swagger.tags=['Owners']
    //#swagger.summary='Delete an owner'
    //#swagger.description='This endpoint deletes a specific owner by its ID from the database.'    
    console.log('entering deleteOwner controller')
    try {
        const ownerId = req.params.id;

        if (!ObjectId.isValid(ownerId)) {
            return next(createError(400, 'Invalid Owner ID format. Must be a valid ObjectId'));
        }

        const objectId = new ObjectId(ownerId);

        await checkId(ownerId, "owners", "Owner");

        const result = await mongodb
            .getDatabase()
            .db()
            .collection('owners')
            .deleteOne({ _id: objectId });

        console.log('result')
        console.table(result)

        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            return next(createError(500, 'Failed to delete owner. Please try again.'));
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    createOwner,
    updateOwner,
    deleteOwner
};
