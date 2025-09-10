// src/data.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Quest, Prisma } from '@prisma/client';

@Injectable()
export class QuestDataService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.QuestCreateInput): Promise<Quest> {
    return this.prisma.quest.create({ data });
  }

  async getAll(search?: string): Promise<Quest[]> {
  if (!search) {
    return this.prisma.quest.findMany();
  }

  const isNumeric = !isNaN(Number(search));
  const numericValue = Number(search);

  const orConditions: any[] = [];

  if (isNumeric) {
    orConditions.push({ duration: numericValue });
  }

  orConditions.push(
    { title: { contains: search, mode: 'insensitive' } },
    { category: { contains: search, mode: 'insensitive' } },
    { players: { contains: search, mode: 'insensitive' } },
    { level: { contains: search, mode: 'insensitive' } }
  );

  return this.prisma.quest.findMany({
    where: {
      OR: orConditions,
    },
  });
}

  async getById(id: number): Promise<Quest | null> {
    return this.prisma.quest.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    data: Prisma.QuestUpdateInput,
  ): Promise<Quest> {
    return this.prisma.quest.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.quest.delete({
      where: { id },
    });
  }
}
