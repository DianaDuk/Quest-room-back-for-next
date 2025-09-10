import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { QuestService } from './quest.service';
import { Quest, Quest as QuestModel } from '@prisma/client';

@Controller('quests')
export class QuestController {
  constructor(
    private readonly questService: QuestService,
  ) {}

  @Post()
  async createQuest(@Body() data: Omit<Quest, 'id'>): Promise<Quest> {
    return this.questService.createQuest(data);
  } 

  @Get()
  async getAllQuests(@Query('search') search?: string): Promise<Quest[]> {
    return this.questService.getAllQuests(search);
  }

  @Get(':id')
  async getQuestById(@Param('id', ParseIntPipe) id: number): Promise<Quest | null> {
    return this.questService.getQuestById(id);
  }

  @Patch(':id')
  async updateQuest(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Omit<Quest, 'id'>>,
  ): Promise<Quest> {
    return this.questService.updateQuest(id, data);
  }

@Delete(':id')
async deletePost(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
  return this.questService.deleteQuest(id);
}
}
