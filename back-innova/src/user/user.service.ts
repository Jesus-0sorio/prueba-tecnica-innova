import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ResponseRequest } from 'src/interfaces/Response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<ResponseRequest<User[] | null>> {
    try {
      const res = await this.userRepository.find().then((users: User[]) => {
        users.forEach((user: User) => delete user.password);
        return users;
      });

      if (res.length === 0) {
        return {
          status: 404,
          message: 'Users not found',
          data: null,
        };
      }

      return {
        status: 200,
        message: 'Users found',
        data: res || [],
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findUsersByRole(role: string): Promise<ResponseRequest<User[]>> {
    try {
      const res = await this.userRepository
        .find({ where: { role } })
        .then((users: User[]) => {
          users.forEach((user: User) => delete user.password);
          return users;
        })
        .catch(() => {
          throw new Error('Users not found');
        });

      return {
        status: 200,
        message: 'Users found',
        data: res,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: number): Promise<ResponseRequest<User>> {
    try {
      const res = await this.userRepository
        .findOne({ where: { id } })
        .then((user: User) => {
          delete user.password;
          return user;
        })
        .catch(() => {
          throw new Error('User not found');
        });

      return {
        status: 200,
        message: 'User found',
        data: res,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(user: User): Promise<ResponseRequest<User | null>> {
    try {
      const isUserExist = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (isUserExist) {
        return {
          status: 400,
          message: 'User already exists',
          data: null,
        };
      }

      const encryptedPassword = await this.encryptPassword(user.password);

      const newUser = await this.userRepository.save({
        ...user,
        password: encryptedPassword,
      });

      delete newUser.password;

      return {
        status: 201,
        message: 'User created',
        data: newUser,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(
    id: number,
    updateUser: Partial<User>,
  ): Promise<ResponseRequest<User | null>> {
    try {
      const pastUser = await this.userRepository.findOne({ where: { id } });

      if (!pastUser) {
        return {
          status: 404,
          message: 'User not found',
          data: null,
        };
      }

      const updatedUser = await this.userRepository.save({
        ...pastUser,
        ...updateUser,
      });

      delete updatedUser.password;

      return {
        status: 200,
        message: 'User updated',
        data: updatedUser,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: number): Promise<ResponseRequest<null>> {
    try {
      await this.userRepository.delete(id);
      return {
        status: 204,
        message: 'User removed',
        data: null,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findByEmail(email: string): Promise<ResponseRequest<User | null>> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        return {
          status: 404,
          message: 'User not found',
          data: null,
        };
      }

      return {
        status: 200,
        message: 'User found',
        data: user,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
