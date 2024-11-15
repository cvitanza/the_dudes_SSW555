import mongoose from "mongoose";

const recipesSchema = new mongoose.Schema({ 
    name: { type: String, required: true},
})

const Recipe = mongoose.model("Recipe", recipesSchema);
export default Recipe
