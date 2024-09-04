import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserContoller } from './User.controller';
import { Module } from '@nestjs/common';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserContoller],
})
export class UserModule {}
