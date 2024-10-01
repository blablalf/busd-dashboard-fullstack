import { Injectable } from '@nestjs/common';
import { CreateUserDatumDto } from './dto/create-user-datum.dto';
import { UpdateUserDatumDto } from './dto/update-user-datum.dto';
import { UserData } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserDataService {
  constructor(private prisma: PrismaService) {}

  create(createUserDatumDto: CreateUserDatumDto): Promise<UserData> {
    return this.prisma.userData.create({
      data: createUserDatumDto,
    });
  }

  findAll() {
    return this.prisma.userData.findMany();
  }

  findOne(address: string) {
    return this.prisma.userData.findUnique({
      where: { userAddress: address },
    });
  }

  update(address: string, updateUserDatumDto: UpdateUserDatumDto) {
    return this.prisma.userData.update({
      where: { userAddress: address },
      data: updateUserDatumDto,
    });
  }

  remove(address: string) {
    return this.prisma.userData.delete({
      where: { userAddress: address },
    });
  }

  removeAll() {
    return this.prisma.userData.deleteMany();
  }
}
