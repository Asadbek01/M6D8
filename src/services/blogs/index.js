import express from "express";
import createHttpError from "http-errors";
import BlogPost from "./schema.js";
import CommentSchema from "../comment/schema.js";

const blogRouter = express.Router();

blogRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new BlogPost(req.body);
    const { _id } = await newBlog.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await BlogPost.find();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;

    const blog = await BlogPost.findById(blogId);
    if (blog) {
      res.send(blog);
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const UpdateBlog = await BlogPost.findByIdAndUpdate(blogId, req.body);
    if (UpdateBlog) {
      res.send(UpdateBlog);
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const deleteBlog = await BlogPost.findByIdAndDelete(blogId);
    if (deleteBlog) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Blog with id ${blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

// *************** comments Router started from here ************//

blogRouter.post("/:blogId/comments", async (req, res, next) => {
  try {
    const Blogcomment = await BlogPost.findById(req.body.commentId)
    if (Blogcomment) {
      const commentToInsert = {
        ...Blogcomment.toObject(),
        wrotenDate: new Date(),
      };
      console.log(commentToInsert);

      const modifiedBlog = await BlogPost.findByIdAndUpdate(
        req.params.blogId,
        { $push: { comment: commentToInsert } },
        { new: true }
      );
      if (modifiedBlog) {
        res.send(modifiedBlog);
      } else {
        // next(createHttpError(404, `Blog with id ${req.params.blogId} not found!`))
      }
    } else {
      next(
        createHttpError(404, `Comment with id ${req.body.commentId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/:blogId/comments", async (req, res, next) => {
  try {
    const blog = await BlogPost.findById(req.params.blogId);
    if (blog) {
      res.send(blog.comments);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

blogRouter.put("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

blogRouter.delete("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default blogRouter;
