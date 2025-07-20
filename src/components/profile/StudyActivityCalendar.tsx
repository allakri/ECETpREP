
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { subDays, format, getDay, startOfMonth, getDaysInMonth, addMonths } from 'date-fns';

// --- Mock Data Generation ---
// In a real app, this would come from a database.
const generateMockActivity = () => {  
  const activity: { [key: string]: number } = {};
  for (let i = 0; i < 365; i++) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    if (Math.random() > 0.4) { // ~60% of days have activity
      activity[date] = Math.floor(Math.random() * 5) + 1; // 1 to 5 activities
    }
  }
  return activity;
};

const activityData = generateMockActivity();
// -----------------------------


const getActivityColor = (count: number | undefined) => {
  if (!count || count === 0) return 'bg-muted/30';
  if (count <= 1) return 'bg-green-300/60 dark:bg-green-800/60';
  if (count <= 3) return 'bg-green-500/70 dark:bg-green-600/70';
  if (count <= 5) return 'bg-green-600/80 dark:bg-green-500/80';
  return 'bg-green-700/90 dark:bg-green-400/90';
};

const getMonthName = (monthIndex: number) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[monthIndex];
}

export function StudyActivityCalendar() {
  const today = new Date();
  const calendarMonths = [];
  let totalContributions = 0;

  for (let i = 3; i >= 0; i--) {
    const date = subDays(today, i * 30);
    const monthStart = startOfMonth(date);
    const monthIndex = monthStart.getMonth();
    const year = monthStart.getFullYear();
    const daysInMonth = getDaysInMonth(monthStart);
    const firstDayOfMonth = getDay(monthStart);

    const days = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`empty-${i}`} />);

    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, monthIndex, day);
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        const count = activityData[formattedDate];
        if(count) totalContributions += count;
        
        days.push(
            <Tooltip key={formattedDate}>
            <TooltipTrigger asChild>
                <div className={cn("h-3 w-3 rounded-sm", getActivityColor(count))} />
            </TooltipTrigger>
            <TooltipContent>
                <p className="text-xs">{count || 'No'} contributions on {format(currentDate, 'MMM d, yyyy')}</p>
            </TooltipContent>
            </Tooltip>
        );
    }
    
    calendarMonths.push(
        <div key={`${year}-${monthIndex}`}>
            <p className="text-xs text-muted-foreground mb-1">{getMonthName(monthIndex)}</p>
            <div className="grid grid-cols-7 grid-rows-5 gap-1">{days}</div>
        </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Activity</CardTitle>
        <CardDescription>{totalContributions} contributions in the last 4 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
            <div className="flex justify-start gap-3 overflow-x-auto pb-2">
                {calendarMonths}
            </div>
            <div className="flex justify-end items-center gap-2 mt-2 text-xs text-muted-foreground">
                Less
                <div className="h-3 w-3 rounded-sm bg-muted/30" />
                <div className="h-3 w-3 rounded-sm bg-green-300/60 dark:bg-green-800/60" />
                <div className="h-3 w-3 rounded-sm bg-green-500/70 dark:bg-green-600/70" />
                <div className="h-3 w-3 rounded-sm bg-green-600/80 dark:bg-green-500/80" />
                <div className="h-3 w-3 rounded-sm bg-green-700/90 dark:bg-green-400/90" />
                More
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
