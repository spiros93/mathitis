import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, ValidationPipe, Delete,  Put, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto, UserQueryDto, UpdateUserDto, UserPasswordDto } from './user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import * as bcrypt from 'bcryptjs';

@Controller('users')
export class UserController {
  constructor(private userService: UserService){}

  // GET endpoints

  @Get()
  @UseGuards(AuthGuard)
  async findAllUsers(@Req() req: any, @Query() query: UserQueryDto){
    if(req.user.isAdmin ) {
      return await this.userService.findAllUsers(query);
   } else {
     throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
} 
    
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findUserById(@Param('id') id: string, @Req() req: any){

    if(!req.user.isAdmin) {
      id =req.user.userId;
    } 
    const user = await this.userService.findUserById(id);
    
    if (user) {
      return user;
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
   
  }

  @Get('username/:username')
  @UseGuards(AuthGuard)
  async findUserByEmail(@Param('username') username: string, @Req() req: any){
    console.log(req.user.username)
    console.log(username)
    if(!req.user.isAdmin && username !== req.user.username) {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    } 
    return await this.userService.findUserByUsername(username);
  }

  // POST endpoints

  @Post()
  async createUser(@Body(new ValidationPipe()) user: UserDto){
    try{
      return await this.userService.createUser(user);
    } catch (error){
      if (error.code == 11000){
        throw new HttpException('Username or Email exists', HttpStatus.CONFLICT);
      }else{
        throw new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@Body(new ValidationPipe()) body: UpdateUserDto, @Param('id') id: string, @Req() req: any) {
    let userId ='';
    if(id && req.user.isAdmin) {
      userId = id;
    } else if (!req.user.isAdmin) {
      userId = req.user.userId;
    } 

    body.photoURL = body.photoURL === undefined ? '' : body.photoURL;

    const updatePost: any = await this.userService.updateUser(userId, body);
    if (!updatePost) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return updatePost;
  }

  @Put('password/change')
  @UseGuards(AuthGuard)
  async updatePassword(@Body(new ValidationPipe()) body: UserPasswordDto, @Req() req: any) {
    let userId = req.user.userId;
    const newHashedPassword = await bcrypt.hash(body.newPassword, 10);
    const user = await this.userService.findUserById(userId);

    if (!(await bcrypt.compare(body.currentPassword, user.password))) {
      throw new HttpException('Wrong Current Password', HttpStatus.UNAUTHORIZED);
    } else if (await bcrypt.compare(body.newPassword, user.password)) {
      throw new HttpException('Current Password is the same with New Password', HttpStatus.CONFLICT);
    } else if (body.newPassword !== body.confirmPassword) {
      throw new HttpException('New Password & Confirm Password do not match', HttpStatus.NOT_ACCEPTABLE);
    } else {
      const updatePost: any = await this.userService.updateUserPassword(userId, newHashedPassword);
      if (!updatePost) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      return updatePost;
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
  
    let userId ='';
    if(id && req.user.isAdmin) {
      userId = id;
    } else if (!req.user.isAdmin) {
      userId = req.user.userId;
    } 
    const deletePost = await this.userService.deleteUser(id);
    if (!deletePost) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('Post deleted successfully', HttpStatus.OK);
  }

  @Post('bulk')
  async createUsers(@Body(new ValidationPipe()) users: UserDto[]){
    return await this.userService.createUsers(users);
  }
}
