import {
  Controller,
  Post,
  Session,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthorizedGuard } from './authorized.guard';
import { CredentialsDTO } from './credentials.dto';
import { CredentialsChecker } from './password-checker.provider';

@Controller('/auth')
export class AuthController {
  constructor(private readonly credsChecker: CredentialsChecker) {}

  @HttpCode(201)
  @Post('/login')
  async login(
    @Body() creds: CredentialsDTO,
    @Session() session: Record<string, any>,
  ) {
    if (session.data && session.data.loggedIn) {
      return;
    }
    const credentialsCorrect = await this.credsChecker.check({ ...creds });
    if (!credentialsCorrect) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    session.data = { loggedIn: true };
  }

  @HttpCode(201)
  @Post('/logout')
  @UseGuards(AuthorizedGuard)
  async logout(@Session() session: Record<string, any>) {
    session.data.loggedIn = false;
  }
}
