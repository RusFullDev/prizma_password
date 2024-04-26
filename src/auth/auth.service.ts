import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto, LoginAuthDto, UpdateAuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { User } from '@prisma/client';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService:PrismaService,
    private readonly jwtService:JwtService
  ){}

/*********************************getToken******************************************** */

async getTokens(user:User):Promise<Tokens> {
  const payload:JwtPayload = {
   sub:user.id,
    email: user.email
  };

  const [accessToken, refreshToken] = await Promise.all([
    this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    }),
    this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    }),
  ]);
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}
/****************************************************************************************** */

async updateRefreshToken(user:User,refreshToken:string){
  const hashedRefreshToken = await bcrypt.hash(refreshToken,7)
  await this.prismaService.user.update({
    where:{
      id:user.id,
    },
    data:{
      hashedRefreshToken
    }
  })
}
  /***********************************************signUp************************************************ */

async signUp(createAuthDto:CreateAuthDto,res:Response):Promise<Tokens>{
  const candidate = await this.prismaService.user.findUnique({
    where:{
      email:createAuthDto.email
    }
  })

  if(candidate){
    throw new BadRequestException("User already exists !")
  }
  const hashedPassword =await bcrypt.hash(createAuthDto.password,7)
  const newUser = await this.prismaService.user.create({
    data:{
      email:createAuthDto.email,
      hashedPassword
    }
  })
const tokens = await this.getTokens(newUser)

const updateUser = await this.updateRefreshToken(newUser,tokens.refresh_token)

res.cookie("refresh_token",tokens.refresh_token,
{
  maxAge: Number(process.env.COOKIE_TIME),
   httpOnly: true,
})


return tokens
}

/************************************************signIn********************************************************* */
async signIn(loginAuthDto:LoginAuthDto,res:Response){
  const{password,email}= loginAuthDto
  const newUser = await this.prismaService.user.findUnique({
    where: {email:loginAuthDto.email}
  }  )
  if (!newUser) {
    throw new BadRequestException('User not found');
  }

  const passwordIsMatch = await bcrypt.compare(
        password,
        newUser.hashedPassword
      );

  if (!passwordIsMatch) {
    throw new BadRequestException('Password do not match');
  }

}


/********************************************************************************************************** */
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
