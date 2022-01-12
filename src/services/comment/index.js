import express from "express"
import q2m from "query-to-mongo"
import CommentsModel from "./schema.js"

const commentRouter = express.Router()

commentRouter.post("/", async (req, res, next) => {
  try {
    const newComment = new CommentsModel(req.body)
    const {_id} = await newComment.save()
    res.status(201).send({_id})
  } catch (error) {
    next(error)
  }
})

commentRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query)
    const total = await CommentsModel.countDocuments(mongoQuery.criteria)
    const books = await CommentsModel.find(mongoQuery.criteria)
      .limit(mongoQuery.options.limit || 10)
      .skip(mongoQuery.options.skip || 0)
      .sort(mongoQuery.options.sort)
    res.send({ links: mongoQuery.links("/books", total), pageTotal: Math.ceil(total / mongoQuery.options.limit), total, books })
  } catch (error) {
    next(error)
  }
})

commentRouter.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

commentRouter.put("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

commentRouter.delete("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

export default commentRouter