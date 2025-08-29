
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format, getDay, startOfMonth, getDaysInMonth, endOfMonth } from 'date-fns';

interface StudyActivityCalendarProps {
    activityData: string[]; // Array of 'yyyy-MM-dd' date strings
}


const getActivityColor = (count: number) => {
  if (count === 0) return 'bg-muted/30';
  if (count <= 1) return 'bg-green-300/60 dark:bg-green-800/60';
  if (count <= 3) return 'bg-green-500/70 dark:bg-green-600/70';
  if (count <= 5) return 'bg-green-600/80 dark:bg-green-500/80';
  return 'bg-green-700/90 dark:bg-green-400/90';
};


export function StudyActivityCalendar({ activityData }: StudyActivityCalendarProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const daysInMonth = getDaysInMonth(today);
  const firstDayOfMonth = getDay(monthStart);

  const calendarDays = [];

  // Create a map for quick lookup of activities
  const activityMap = new Map<string, number>();
  activityData.forEach(dateStr => {
      const date = dateStr.split('T')[0]; // Handle ISO strings
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
  });
  

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-4 w-4 rounded-sm" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(today.getFullYear(), today.getMonth(), day);
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    const count = activityMap.get(formattedDate) || 0;

    calendarDays.push(
      <TooltipProvider key={formattedDate}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn("h-4 w-4 rounded-sm", getActivityColor(count))} />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{count || 'No'} contributions on {format(currentDate, 'MMM d, yyyy')}</p>
            </TooltipContent>
          </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Activity</CardTitle>
        <CardDescription>Your daily study consistency, inspired by GitHub.</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
            <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-lg">{format(today, 'MMMM yyyy')}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    Less
                    <div className="h-3 w-3 rounded-sm bg-muted/30" />
                    <div className="h-3 w-3 rounded-sm bg-green-300/60" />
                    <div className="h-3 w-3 rounded-sm bg-green-500/70" />
                    More
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-xs font-medium text-muted-foreground text-center">{day}</div>
                ))}
                {calendarDays}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
