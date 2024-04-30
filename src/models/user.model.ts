import mongoose, {Schema, Document} from "mongoose";


export interface Message extends Document {
    content : string,
    createdAt : Date
}

export interface UserInterface extends Document {
    userName: string,
    email: string,
    password: string,
    isVerified: boolean,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isAcceptingMessage: boolean,
    messages: Message[]
}

const userMessageSchema: Schema<Message> = new Schema({
    content: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now}
});

const userSchema: Schema<UserInterface> = new Schema({
    userName:{
        type: String,
        required: [true,"Username required"],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: [true,"Email required"],
        match:[/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, "please usr valid email"]
    },
    password:{
        type: String,
        required: [true,"Password required"]
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    verifyCode:{
        type: String,
        required: [true,"Verify code required"]
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true,"Verify code expiry required"],
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true
    },
    messages:[userMessageSchema]
});

const UserModel = ( mongoose.models.User as mongoose.Model<UserInterface> )|| mongoose.model<UserInterface>("User", userSchema)

export default UserModel