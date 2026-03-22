import prisma from "./prisma";

function computeStatus(steps: boolean[]): string {
  const done = steps.filter(Boolean).length;
  if (done === 0) return 'planned';
  if (done === steps.length) return 'done';
  return 'ongoing';
}

function formatRelease(release: any) {
  const stepsArr = release.steps as boolean[];
  return {
    ...release,
    date: release.date.toISOString(),
    createdAt: release.createdAt.toISOString(),
    steps: stepsArr,
    status: computeStatus(stepsArr)
  };
}

export const resolvers = {
  Query: {
    releases: async () => {
      const allReleases = await prisma.release.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return allReleases.map(formatRelease);
    },
    release: async (_: any, { id }: { id: string }) => {
      const release = await prisma.release.findUnique({ where: { id } });
      return release ? formatRelease(release) : null;
    }
  },
  Mutation: {
    createRelease: async (_: any, { name, date, additionalInfo }: { name: string, date: string, additionalInfo?: string }) => {
      const initialSteps = [false, false, false, false, false, false, false, false, false];
      const newRelease = await prisma.release.create({
        data: {
          name,
          date: new Date(date),
          additionalInfo,
          steps: initialSteps
        }
      });
      return formatRelease(newRelease);
    },
    updateSteps: async (_: any, { id, steps }: { id: string, steps: boolean[] }) => {
      const updated = await prisma.release.update({
        where: { id },
        data: { steps }
      });
      return formatRelease(updated);
    },
    updateAdditionalInfo: async (_: any, { id, additionalInfo }: { id: string, additionalInfo: string }) => {
      const updated = await prisma.release.update({
        where: { id },
        data: { additionalInfo }
      });
      return formatRelease(updated);
    },
    deleteRelease: async (_: any, { id }: { id: string }) => {
      try {
        await prisma.release.delete({ where: { id } });
        return true;
      } catch (err) {
        return false;
      }
    }
  }
};
