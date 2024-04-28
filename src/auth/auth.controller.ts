import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Tokens } from './types';
import { CookieGetter } from 'src/common/decorators/cookie-gettor.decorators';
import { AccessTokenGuard } from 'src/common/guards';
import { Public } from 'src/common/decorators';
import { CreateAuthDto, LoginAuthDto, UpdateAuthDto } from './dto';





// @UseGuards(AccessTokenGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


//  @Public()
  @Post('signUp')
  async singup(@Body() createAuthDto: CreateAuthDto,
  @Res({passthrough:true}) res:Response) :Promise<Tokens>
  {
    return this.authService.signUp(createAuthDto,res);
  }


  
  @Post('signIn')
   async singin(@Body() createAuthDto: LoginAuthDto,
  @Res({passthrough:true}) res:Response) :Promise<Tokens>{
    console.log("sinin");
    return this.authService.signIn(createAuthDto,res);
  }


  @Post('logout/:userId')
  async logout(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true })
    res: Response,
  ) {
    return this.authService.logout(refreshToken, res);
  }


  @Post('/:id/refresh')
  async refresh(
    @Param('id') id: number,
    @CookieGetter('refresh_token')
    refreshToken: string,
    @Res({ passthrough: true })
    res: Response,
  ) {
    return this.authService.refreshToken(id, refreshToken, res);
  }
  

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
