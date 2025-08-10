import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  signup(@Body() dto: UserDto) {
    return this.userService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: UserDto) {
    return this.userService.signin(dto);
  }
}
