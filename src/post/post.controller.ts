import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, ValidationPipe, Put, Delete, Req, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto, PostQueryDto} from './post.dto';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('posts')
export class PostController {
  constructor(private postService: PostService){}

  // GET endpoints

  @Get()
  async findAllPosts(@Query() query: PostQueryDto){
    return await this.postService.findAllPosts(query);
  }

  @Get(':postTitle')
  @UseGuards(AuthGuard)
  async findPostBypostTitle(@Param('postTitle') postTitle: string){
    return await this.postService.findPostBypostTitle(postTitle);
  }

  @Get('userId/:userId')
  @UseGuards(AuthGuard)
  async findPostsByUserID(@Req() req: any){
    const posts = await this.postService.findPostByUserId(req.user.id);
    if (posts) {
      return posts;
    } else {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }

  // POST endpoints

  @Post()
  @UseGuards(AuthGuard)
  async createPost(@Body(new ValidationPipe()) post: PostDto){
    try{
      return await this.postService.createPost(post);
    } catch (error){
      if (error.code == 11000){
        throw new HttpException('postTitle exists', HttpStatus.CONFLICT);
      }else{
        throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  @Post('bulk')
  async createPosts(@Body(new ValidationPipe()) posts: PostDto[]){
    return await this.postService.createPosts(posts);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() body: any) {
    const updatePost: any = await this.postService.updatePost(id, body);
    if (!updatePost) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return updatePost;
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    const deletePost = await this.postService.deletePost(id);
    if (!deletePost) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('Post deleted successfully', HttpStatus.OK);
  }
}