// import Pet from "../models/pet.model";
const Pet = require("../models/pet.model");
module.exports.getAllPets = async (req, res) => {
    try {
        const pets = await Pet.find();
        res.status(200).send(pets);
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports.createPet = async (req, res) => {
    const { userName} = req.body;
    try {
        const pet = await Pet.create({ userName });
        res.status(201).send(pet);
    } catch (error) {
        res.status(400).send(error);
    }
}


