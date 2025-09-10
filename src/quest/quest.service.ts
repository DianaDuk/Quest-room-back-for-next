
import { Injectable } from '@nestjs/common';
import { Quest, Prisma } from '@prisma/client';
import { QuestDataService } from './quest.data.service';

@Injectable()
export class QuestService {
  constructor(private QuestdataService: QuestDataService) {}

   async createQuest(data: Prisma.QuestCreateInput): Promise<Quest> {
    return this.QuestdataService.create(data);
  }

  async getAllQuests(search?: string): Promise<Quest[]> {
    return this.QuestdataService.getAll(search);
  }

  async getQuestById(id: number): Promise<Quest | null> {
    return this.QuestdataService.getById(id);
  }

  async updateQuest(
    id: number, 
    data: Prisma.QuestUpdateInput,
  ): Promise<Quest> {
    return this.QuestdataService.update(id, data);
  }

  async deleteQuest(id: number): Promise<{ message: string }> {
  await this.QuestdataService.delete(id);
  return { message: `Квест успешно удалён` };
}
}

