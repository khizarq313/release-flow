import { resolvers } from '../src/resolvers';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import prisma from '../src/prisma';

jest.mock('../src/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

describe('Resolvers', () => {
  it('createRelease sets status to "planned" and all steps to false', async () => {
    const mockDate = new Date();
    const mockRelease = {
      id: "123",
      name: "Test Release",
      date: mockDate,
      additionalInfo: null,
      steps: [false,false,false,false,false,false,false,false,false],
      createdAt: mockDate,
      updatedAt: mockDate
    };
    
    prismaMock.release.create.mockResolvedValue(mockRelease);

    const result = await resolvers.Mutation.createRelease(null, {
      name: "Test Release",
      date: mockDate.toISOString(),
      additionalInfo: undefined
    });

    expect(result.status).toBe('planned');
    expect(result.steps.every((s: boolean) => s === false)).toBe(true);
  });

  it('updateSteps sets status to "done" when all steps are true', async () => {
    const mockDate = new Date();
    const trueSteps = [true,true,true,true,true,true,true,true,true];
    const mockRelease = {
      id: "123",
      name: "Test Release",
      date: mockDate,
      additionalInfo: null,
      steps: trueSteps,
      createdAt: mockDate,
      updatedAt: mockDate
    };

    prismaMock.release.update.mockResolvedValue(mockRelease);

    const result = await resolvers.Mutation.updateSteps(null, {
      id: "123",
      steps: trueSteps
    });

    expect(result.status).toBe('done');
  });
});
