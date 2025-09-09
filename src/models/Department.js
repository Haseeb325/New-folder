import mongoose,{Schema} from "mongoose";

const DepartmentSchema = new Schema({

    name:{
        type:String,
        enum:["WebDeveloper", "UI/UX", "HR", "Designer"],
        unique:true
    }

},{timestamps:true})

export default mongoose.models.Department || mongoose.model("Department",DepartmentSchema)
