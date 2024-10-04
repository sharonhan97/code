import mongoose from "mongoose";
import { Password } from "../services/password";

// an interface that describe the property that required to create a new User
interface UserAttrs{
    email: string;
    password: string;
}

//an interface that describe the property user model has
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc;
}

//an interface that describe the properties that a user document has
interface UserDoc extends mongoose.Document{
    email: string;
    password: string;    
}

//create schema
const userSchema = new mongoose.Schema({
    email:{
        //capital S because this is mongodb schema type not ts type
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }

},{
    //adjust the saved json structure in db and will reflect on returned body
    toJSON: {
       transform(doc,ret){
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
       }
    }
})

//before save data, hash password
userSchema.pre('save', async function(done){
    //"this" is the document. after the first build, password will be recognized as modified 
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password',hashed);
    }
    //we need to use done cause mongoose doesn't support async very well so we need to use done to remind  
    done();
});

//define a static func of schema, used to add user and meanwhile ensure the attributes is correct
userSchema.statics.build = (attrs:UserAttrs)=>{
    return new User(attrs);
}

//use schema to construct model used to add remove ... data in mongodb, model will extend build func
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


export{User};
