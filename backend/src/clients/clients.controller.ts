import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateClientDto {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateClientDto) {
    return this.clientsService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.clientsService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.clientsService.findOne(req.user.sub, id);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: CreateClientDto) {
    return this.clientsService.update(req.user.sub, id, dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.clientsService.remove(req.user.sub, id);
  }
}