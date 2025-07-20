"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

const chartConfig = {
  score: {
    label: "Score",
  },
  correct: {
    label: "Correct",
    color: "hsl(var(--chart-1))",
  },
  incorrect: {
    label: "Incorrect",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface ScoreChartProps {
    score: number;
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
    totalQuestions: number;
}

export function ScoreChart({ score, correctCount, incorrectCount, unansweredCount, totalQuestions }: ScoreChartProps) {
  const chartData = [
    { name: "correct", value: correctCount, fill: "var(--color-correct)" },
    { name: "incorrect", value: incorrectCount + unansweredCount, fill: "var(--color-incorrect)" },
  ]

  const id = "pie-interactive"

  return (
    <Card data-chart={id} className="flex flex-col h-full shadow-lg bg-secondary">
      <CardHeader className="items-center pb-0">
        <CardTitle>Exam Performance</CardTitle>
        <CardDescription>A breakdown of your results</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full max-h-[300px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold font-headline"
                        >
                          {score.toFixed(1)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground"
                        >
                          Score
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardContent className="flex-1 pt-4 flex flex-col items-center justify-center text-sm">
        <div className="w-full max-w-[200px] space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[--color-correct]"></span>
                    <span>Correct</span>
                </div>
                <span>{correctCount}/{totalQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[--color-incorrect]"></span>
                    <span>Incorrect</span>
                </div>
                <span>{incorrectCount}/{totalQuestions}</span>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-muted"></span>
                    <span>Unanswered</span>
                </div>
                <span>{unansweredCount}/{totalQuestions}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
