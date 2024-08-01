import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
  daily: {
    label: "Daily",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const chartData = [
  { xAxis: "0", revenue: 100 },
  { xAxis: "1", revenue: 300 },
  { xAxis: "2", revenue: 200 },
  { xAxis: "3", revenue: 350 },
  { xAxis: "4", revenue: 330 },
  { xAxis: "5", revenue: 130 },
  { xAxis: "7", revenue: 10 },
  { xAxis: "8", revenue: 100 },
];

const chartDataWeekly = [
  { xAxis: "0", revenue: 1000 },
  { xAxis: "1", revenue: 3020 },
  { xAxis: "2", revenue: 2030 },
  { xAxis: "3", revenue: 2350 },
  { xAxis: "4", revenue: 3330 },
  { xAxis: "5", revenue: 1230 },
  { xAxis: "7", revenue: 130 },
  { xAxis: "8", revenue: 110 },
];

export default function TimeSeriesGraph() {
  const [period, setPeriod] = useState<"daily" | "monthly" | "weekly">("daily");

  return (
    <Card className="space-y-6">
      <CardHeader className="flex w-full flex-row items-center justify-between">
        <CardTitle>Revenue</CardTitle>
        <Select
          value={period}
          onValueChange={(val) =>
            setPeriod(val as "daily" | "monthly" | "weekly")
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Last 24 hours</SelectItem>
            <SelectItem value="weekly">Last 7 days</SelectItem>
            <SelectItem value="monthly">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={period === "daily" ? chartData : chartDataWeekly}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="xAxis"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return period === "daily"
                  ? `0${value}:00`
                  : `0${value}/${new Date().getMonth()}`;
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="revenue"
                  labelFormatter={(value) => {
                    return period === "daily"
                      ? `0${value}:00`
                      : `${new Date().toLocaleDateString("id-ID")}`;
                  }}
                />
              }
            />
            <Line
              dataKey="revenue"
              type="monotone"
              stroke={`red`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
