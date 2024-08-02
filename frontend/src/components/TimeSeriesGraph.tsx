import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
import { useEffect, useState } from "react";
import {
  fetchInvoicesByPeriod,
  selectChartInvoices,
} from "@/app/slice/invoice";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { formatDayToThisMonth } from "@/utils/chart";

type Period = "daily" | "monthly" | "weekly";

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
  daily: {
    label: "Daily",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function TimeSeriesGraph() {
  const dispatch = useAppDispatch();
  const chartInvoices = useAppSelector(selectChartInvoices);
  const [period, setPeriod] = useState<Period>("daily");

  useEffect(() => {
    dispatch(fetchInvoicesByPeriod(period));
  }, [dispatch, period]);

  return (
    <Card className="space-y-6">
      <CardHeader className="flex w-full flex-row items-center justify-between">
        <CardTitle>Revenue</CardTitle>
        <Select
          value={period}
          onValueChange={(val) => setPeriod(val as Period)}
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
          className="aspect-auto h-[250px] w-full pl-0"
        >
          <LineChart
            accessibilityLayer
            data={chartInvoices}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              type="number"
              domain={[0, "dataMax"]}
              axisLine={false}
              tickLine={false}
            />
            <XAxis
              reversed={period !== "daily"}
              dataKey="xAxis"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return period === "daily"
                  ? `${value.padStart(2, "0")}:00`
                  : `${value.padStart(2, "0")}/${formatDayToThisMonth(value)}`;
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="xAxis"
                  labelFormatter={(value) => {
                    return period === "daily"
                      ? `${value.padStart(2, "0")}:00`
                      : `${value.padStart(2, "0")}/${formatDayToThisMonth(value)}`;
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
