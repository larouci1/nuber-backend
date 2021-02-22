import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    // hash password

    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return {
          ok: false,
          error: 'sorry this user already exists',
        };
      }
      await this.users.save(this.users.create({ email, password, role }));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Sorry can't create this user",
      };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // check user
    // check password
    // JWT

    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'The user with this Email is not registered',
        };
      }
      const correctPassword = await user.checkPassword(password);
      if (!correctPassword) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      return {
        ok: true,
        token: 'iosrh',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
