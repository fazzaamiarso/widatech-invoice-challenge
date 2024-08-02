export const formatDayToThisMonth = (day: string) => {
  return (
    Number(day) > new Date().getDate()
      ? new Date().getMonth() + 1 - 1
      : new Date().getMonth() + 1
  )
    .toString()
    .padStart(2, "0");
};
