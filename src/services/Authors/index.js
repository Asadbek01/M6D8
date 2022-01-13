import { Router } from 'express'
import AuthorModal from '../db-models/userSchema.js'
import createHttpError from 'http-errors'

const AuthorModal = Router()

AuthorModal.get("/", async(req, res, next) => {
    try {
        const author = await AuthorModal.find()
        res.send(author)
    } catch (error) {
        next(error)
    }
})
AuthorModal.post("/", async (req, res, next) => {
    try {
        const newAuthor = new AuthorModal(req.body)
        newAuthor.save()
        res.send(newAuthor)
    } catch (error) {
        next(error)
    }
})

AuthorModal.get('/:authorId', async (req, res, next) => {
    try {
        const author = await AuthorModal.findById(req.params.authorId)
        if (!author) return next(createHttpError(404, `The AuthorId ${req.params.authorId} is wrong id`))
        res.send(author)
    } catch (error) {
        console.log(error)
        next(error)
    }
})
AuthorModal.put('/:authorId', async (req, res, next) => {
    try {
        const updatedUser = await AuthorModal.findByIdAndUpdate(req.params.authorId, req.body, { new: true })
        if (!updatedUser) returnnext(createHttpError(404, `The AuthorId ${req.params.authorId} is wrong id`))
        res.send(updatedUser)
    } catch (error) {
        next(error)
    }
})
AuthorModal.delete('/:authorId', async (req, res, next) => {
    try {
        // if (req.params.authorId.length !== 24) return next(createHttpError(404, 'Could not find'))
        const result = await AuthorModal.findByIdAndDelete(req.params.authorId)
        if (!result) return next(createHttpError(404, `The AuthorId ${req.params.authorId} is wrong id`))
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default userRouter