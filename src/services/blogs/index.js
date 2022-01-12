import express from "express"
import createHttpError from "http-errors"
import BlogPost from "./schema.js"
import CommentSchema from "../comment/schema.js"

const blogRouter = express.Router()

blogRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogPost(req.body) 
    const { _id } = await newBlog.save() 

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

blogRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await BlogPost.find()
    res.send(blogs)
  } catch (error) {
    next(error)
  }
})

blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId

    const blog = await BlogPost.findById(blogId)
    if (blog) {
      res.send(blog)
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const UpdateBlog = await BlogPost.findByIdAndUpdate(blogId, req.body)
    if (UpdateBlog) {
      res.send(UpdateBlog)
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const deleteBlog = await BlogPost.findByIdAndDelete(blogId)
    if (deleteBlog) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.post("/:blogId/comments", async (req, res, next) => {
  try {
    const comment = await CommentSchema.findById(req.body.commentId, { _id: 0 })
    if(comment) {

      const articleToInsert = { ...comment.toObject(), wrotenDate: new Date()}
      console.log(articleToInsert)

      const modifiedBlog = await BlogPost.findByIdAndUpdate(req.params.blogId,
       { $push: { comment: articleToInsert }},
       {new:true}
        )
       if(modifiedBlog){
         res.send(modifiedBlog)
       }else{
        next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
      }
       }else{
        next(createHttpError(404, `Comment with id ${req.body.commentId} not found!`))
       }
    
    
  } catch (error) {
    next(error)
  }
})

blogRouter.get("/", async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error)
  }
})

blogRouter.get("/", async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error)
  }
})

blogRouter.put("/", async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error)
  }
})

blogRouter.delete("/", async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error)
  }
})


export default blogRouter