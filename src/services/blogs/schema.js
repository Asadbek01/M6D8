import mongoose from "mongoose"

const { Schema, model } = mongoose

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    rate: {
      type: Number,
      min: [1, "Rate must be min 1"],
      max: [5, "Rate can be max 5"],
      default: 5,
    },
    user: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const blogSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String},
    content: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true},
      unit: {type: String, required: true }        
  },
  author: {
      name: {type: String, required: true},
      avatar: {type: String, required: true}        
  },
  content: { type: String, required: true},
  comments: { default: [], type: [CommentSchema] },
},
    
  {
    timestamps: true, 
  }
)

export default model("BlogPost", blogSchema) 
