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
    const Blogcomment = await BlogPost.findById(req.params.blogId);
    if (!Blogcomment) {
      res
        .status(404)
        .send({ message: `Blog with id ${req.params.blogId} not found!` });
    } else {
      console.log(req.body);
      await BlogPost.findByIdAndUpdate(
        req.params.blogId,
        {
          $push: {
            comments: req.body,
          },
        },
        { new: true }
      );
      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
    res.send(500).send({ message: error.message });
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

blogRouter.get("/:blogId/comments/commentsId", async (req, res, next) => {
  try {
    if (req.params.blogId.length !== 24)
      return next(createHttpError(400, "Invalid Blog ID"));
    if (req.params.commentId.length !== 24)
      return next(createHttpError(400, "Invalid Comment ID"));
    const blogComments = await BlogPost.findById(req.params.blogId, {
      comments: 1,
      _id: 0,
    });
    if (!blogComments)
      return next(
        createHttpError(
          400,
          `The id ${req.params.blogId} does not match any blogs`
        )
      );
    const blogComment = blogComments.comments.find(
      ({ _id }) => _id.toString() === req.params.commentsId
    );
    if (!blogComment)
      return next(
        createHttpError(
          400,
          `The id ${req.params.commentsId} does not match any comments`
        )
      );
    res.send(blogComment);
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

blogRouter.delete("/:blogId/comments/commentsId", async (req, res, next) => {
  try {
    const blog = await BlogPost.findById(req.params.blogId);
    if (!blog) {
      res.status(404).send({ message: `blog with ${req.params.blogId} is not found!` });
    } else {
      await BlogPost.findByIdAndUpdate(
        req.params.id,
        { $pull: { comments: { _id: req.params.commentsId } } },
        { new: true }
      );
      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
    res.send(500).send({ message: error.message });
  }
});

export default blogRouter;
