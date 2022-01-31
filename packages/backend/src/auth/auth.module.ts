import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthorizedGuard } from './authorized.guard';
import { CredentialsChecker } from './password-checker.provider';

@Module({
  imports: [],
  providers: [CredentialsChecker, AuthorizedGuard],
  controllers: [AuthController],
  exports: [AuthorizedGuard],
})
export class AuthModule {}
