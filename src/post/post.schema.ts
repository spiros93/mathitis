import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose';

@Schema()
export class Post{
  @Prop({type: String, required:true}) userId: string;
  @Prop({type: String, required:true}) postTitle: string;
  @Prop({type: String, required:true}) text: string;
  @Prop({type: String, default:''}) photoURL: string;
}

export type PostDocument = HydratedDocument<Post>;
export const PostSchema = SchemaFactory.createForClass(Post);