import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: createEventDto,
    });
  }

  createMany(createEventDtos: CreateEventDto[]) {
    return this.prisma.event.createMany({
      data: createEventDtos,
    });
  }

  findAll() {
    return this.prisma.event.findMany();
  }

  findOne(id: number) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  findMany(ids: number[]) {
    return this.prisma.event.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  remove(id: number) {
    return this.prisma.event.delete({
      where: { id },
    });
  }

  removeAll() {
    return this.prisma.event.deleteMany();
  }
}
