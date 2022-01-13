import mongoose from "mongoose";
const { Schema, model } = mongoose
const CommentSchema = new Schema({
      text: { type: String, required: true },
      
},
{
    timestamps: true
}

)
export default model("comments", CommentSchema)
 