import type { InvoiceChartResponse } from "@/api";

type RevenueChartDataItem = {
  xAxis: string;
  revenue: number;
};

export const mapDataToDailyChart = (
  data: InvoiceChartResponse[],
): RevenueChartDataItem[] => {
  // should be ordered by hours from 0 to 23
  const dailyChart = Array.from({ length: 24 }).map((_, idx) => {
    return { xAxis: String(idx), revenue: 0 };
  });

  data.forEach((d) => {
    const hoursIdx = new Date(d.date).getHours();
    dailyChart[hoursIdx].revenue = dailyChart[hoursIdx].revenue + d.paidAmount;
  });

  return dailyChart;
};

export const mapDataToWeeklyChart = (
  data: InvoiceChartResponse[],
): RevenueChartDataItem[] => {
  const weeklyMap = new Map();
  const today = new Date();

  // create a Map with each date from 'last 7 day' as keys
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    weeklyMap.set(String(date.getDate()), 0);
  }

  data.forEach((d) => {
    const day = new Date(d.date).getDate().toString();
    weeklyMap.set(day, weeklyMap.get(day) + d.paidAmount);
  });

  return Array.from(weeklyMap, ([key, value]) => ({
    xAxis: key,
    revenue: value,
  }));
};

export const mapDataToMonthlyChart = (
  data: InvoiceChartResponse[],
): RevenueChartDataItem[] => {
  const monthlyMap = new Map();
  const today = new Date();

  // create a Map with each date from 'last 30 days' as keys
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    monthlyMap.set(String(date.getDate()), 0);
  }

  data.forEach((d) => {
    const day = new Date(d.date).getDate().toString();
    monthlyMap.set(day, monthlyMap.get(day) + d.paidAmount);
  });

  return Array.from(monthlyMap, ([key, value]) => ({
    xAxis: key,
    revenue: value,
  }));
};
