import express from "express";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import BlogPost from "./schema.js";


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
    const query = q2m(req.query)
    const blogs = await BlogPost.find(query.criteria, query.options.fields)
    .sort(query.options.sort)
    .skip(query.options.skip)
    .limit(query.options.limit)
    .populate('author')
    res.send(blogs)
} catch (error) {
    next(error)
}
})

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
    const blog = await BlogPost.findByIdAndUpdate(req.params.blogId, { $push: { comments: req.body} }, { new: true })
    if (!blog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
    res.send(blog)
} catch (error) {
    console.log(error)
    next(error)
}
})
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

blogRouter.get('/:blogId/comments/:commentId', async (req, res, next) => {
  try {
    const blogComments = await BlogPost.findById(req.params.blogId, { comments: 1, _id: 0 })
        if (!blogComments) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        const blogComment = blogComments.comments.find(({ _id }) => _id.toString() === req.params.commentId)
        if (!blogComment) return next(createHttpError(400, `The id ${req.params.commentId} does not match any comments`))
        res.send(blogComment)
    } catch (error) {
        next(error)
    }
})

blogRouter.put('/:blogId/comments/:commentId', async (req, res, next) => {
  try {
    const blogs = await BlogPost.findById(req.params.blogId)
    if (!blogs) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
    const commentIndex = blogs.comments.findIndex(({ _id }) => _id.toString() === req.params.commentId)
    if (!commentIndex) return next(createHttpError(400, `The id ${req.params.commentId} does not match any comments`))
    blogs.comments[commentIndex] = { ...blogs.comments[commentIndex].toObject(), ...req.body }
    await blogs.save()
    res.send(blogs.comments[commentIndex])
} catch (error) {
    console.log(error)
    next(error)
}
})

blogRouter.delete("/:blogId/comments/commentId", async (req, res, next) => {
  try {
    const blog = await BlogPost.findByIdAndUpdate(req.params.blogId, { $pull: { comments: { _id: req.params.commentId } } }, { new: true })
    if (!blog) return next(createHttpError(400, `The id Blog or Comment ID does not match any blogs or comments for that blog`))
    res.send(blog)
} catch (error) {
    next(error)
}
})

export default blogRouter;
