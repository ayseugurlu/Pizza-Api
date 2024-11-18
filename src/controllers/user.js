'use strict'

const User = require('../models/user')

module.exports = {
    list: async (req,res) => {

        const result = await res.getModelList(User)

        res.status(200).send({
            error:false,
            result,
            detail: await res.getModelListDetails(User)
        })
    },
    create: async (req,res) => {

        const result = await User.create(req.body)

        res.status(201).send({
            error:false,
            result
        })
    },
    read: async (req,res) => {
        const result = await User.findOne({_id: req.params.id})

        res.status(200).send({
            error:false,
            result
        })


    },
    update: async (req,res) => {
        const result = await User.updateOne({_id: req.params.id}, req.body, { runValidators: true})

        res.status(202).send({
            error:false,
            result,
            new: await User.findOne({_id: req.params.id})
        })


    },
    deleteUser: async (req, res) => {
        const result = await User.deleteOne({_id: req.params.id})

        res.status(result.deletedCount ? 204: 404).send({
            error: !result.deletedCount,
            result
        })

    },

}