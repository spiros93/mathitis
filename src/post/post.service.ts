import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './post.schema';
import { Model } from 'mongoose';
import { PostDto, UpdatePostDto } from './post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>){}

    // find methods

    async findAllPosts(query : any): Promise<Post[]>{
      console.log(query)
      return await this.postModel.find(query).sort( { "createdAt": -1 }).exec();
    }

    async findPostBypostTitle(postTitle: string): Promise<Post> {
      return await this.postModel.findOne({postTitle}).exec();
    }

    async findPostByPostTitleUserId(postTitle: string, userId : string): Promise<Post> {
      return await this.postModel.findOne({postTitle, userId}).exec();
    }

    async findPostByUserId(userId: string): Promise<Post[]>{
      return await this.postModel.find({userId}).sort( { "createdAt": -1 }).exec();
    }

    // create methods

    async createPost(post: PostDto): Promise<Post> {
      const newPost = new this.postModel(post);
      return await newPost.save();
    }

    async createPosts(posts: PostDto[]): Promise<Post[]>{
      const newPosts = posts.map((post) => new this.postModel({post}));
      return await this.postModel.insertMany(newPosts);
    }

    async updatePost(id: string, updatePosrDto: UpdatePostDto): Promise<Post> {
      return await this.postModel.findByIdAndUpdate(id, updatePosrDto, { new: true });
    }

    async deletePost(postId: string): Promise<Post> {
    return await this.postModel.findByIdAndDelete(postId);
  }
  }
