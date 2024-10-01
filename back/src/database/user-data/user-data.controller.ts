import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserDataService } from './user-data.service';
import { CreateUserDatumDto } from './dto/create-user-datum.dto';
import { UpdateUserDatumDto } from './dto/update-user-datum.dto';

@Controller('user-data')
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}

  @Post()
  create(@Body() createUserDatumDto: CreateUserDatumDto) {
    return this.userDataService.create(createUserDatumDto);
  }

  @Get()
  findAll() {
    return this.userDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('address') address: string) {
    return this.userDataService.findOne(address);
  }

  @Patch(':address')
  update(
    @Param('address') address: string,
    @Body() updateUserDatumDto: UpdateUserDatumDto,
  ) {
    return this.userDataService.update(address, updateUserDatumDto);
  }

  @Delete(':address')
  remove(@Param('address') address: string) {
    return this.userDataService.remove(address);
  }

  @Delete()
  removeAll() {
    return this.userDataService.removeAll();
  }
}
