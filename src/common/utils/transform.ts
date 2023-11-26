export async function transformJoinValue<T extends object>(joinData: T[]): Promise<any[]> {
  return joinData.map((data) => {
    if (data)
      return {
        ...Object.values(data)[0],
      };
  });
}
