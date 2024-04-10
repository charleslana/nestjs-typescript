import { BusinessRuleException } from 'src/helpers/error/BusinessRuleException';
import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { PageDto } from 'src/dto/page.dto';
import { ResponseMessage } from 'src/helpers/ResponseMessage';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async createUser(dto: CreateUserDto) {
    const existingUser = await this.repository.findByEmail(dto.email);
    if (existingUser) {
      throw new BusinessRuleException('O e-mail do usuário já existe');
    }
    dto.password = await dto.hashPassword(dto.password);
    const user = await this.repository.createUser({
      data: dto,
    });
    return user;
  }

  async getUser(id: number) {
    const user = await this.repository.getUser({ id });
    if (!user) {
      throw new BusinessRuleException('Usuário não encontrado');
    }
    return user;
  }

  async getUsers() {
    const users = await this.repository.getUsers({});
    return users;
  }

  async getUsersPaginated(page: PageDto) {
    const usersPaginated = await this.repository.findAllPaginated(page);
    return usersPaginated;
  }

  async updateUser(dto: UpdateUserDto) {
    const existingUser = await this.getUser(dto.id);
    if (dto.name) {
      const existingUserWithName = await this.repository.findByName(dto.name);
      if (existingUserWithName && existingUserWithName.id !== existingUser.id) {
        throw new BusinessRuleException('Nome do usuário já existe');
      }
    }
    const user = await this.repository.updateUser({
      data: dto,
      where: {
        id: dto.id,
      },
    });
    return user;
  }

  async deleteUser(id: number) {
    await this.getUser(id);
    await this.repository.deleteUser({ where: { id } });
    return new ResponseMessage('Usuário deletado com sucesso');
  }

  async updateUserPassword(dto: UpdateUserPasswordDto) {
    const existingUser = await this.getUser(dto.id);
    const isPasswordValid = await dto.decryptPassword(dto.currentPassword, existingUser.password);
    if (!isPasswordValid) {
      throw new BusinessRuleException('Senha do usuário atual inválida');
    }
    const password = await dto.hashPassword(dto.newPassword);
    const user = await this.repository.updateUser({
      data: {
        password,
      },
      where: {
        id: dto.id,
      },
    });
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.repository.findByEmail(email);
    return user;
  }
}
