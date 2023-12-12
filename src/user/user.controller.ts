import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, ValidationPipe, Delete,  Put, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto, UserQueryDto } from './user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService){}

  // GET endpoints

  @Get()
  async findAllUsers(@Req() req: any, @Query() query: UserQueryDto){
    const user = await this.userService.createUser(req.user.userIid);
    if(user.isAdmin) {
      return await this.userService.findAllUsers(query);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
    } 
    
  }

  @Get(':username')
  @UseGuards(AuthGuard)
  async findUserByUsername(@Param('username') username: string, @Req() req: any){
    //let userId = req.user.userId|| '';
    //let userNameToSearch = username;
    const logInUser = await this.userService.findUserById(req.user.userId);

    //userNameToSearch = logInUser.username;
    if(logInUser && !logInUser.isAdmin) {
      username = logInUser.username;
    } 
    if (logInUser) {
      const user = await this.userService.findUserByUsername(username);
      
      if (user) {
        return user;
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
   
  }

  @Get('email/:email')
  async findUserByEmail(@Param('email') email: string){
    return await this.userService.findUserByEmail(email);
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
  async update(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    const user = await this.userService.findUserById(req.user.userIid);
    let userId ='';
    if(id && user.isAdmin) {
      userId = id;
    } else if (!user.isAdmin) {
      userId = req.user.userIid;
    } 


    const updatePost: any = await this.userService.updateUser(userId, body);
    if (!updatePost) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return updatePost;
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = await this.userService.findUserById(req.user.userIid);
    let userId ='';
    if(id && user.isAdmin) {
      userId = id;
    } else if (!user.isAdmin) {
      userId = req.user.userIid;
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
