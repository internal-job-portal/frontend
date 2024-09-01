import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';

@Pipe({
  name: 'timeAgo',
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const date = typeof value === 'string' ? parseISO(value) : value;
    const distanceString = formatDistanceToNowStrict(date, { addSuffix: true });

    // Remove "about" from the string
    return distanceString.replace('about ', '');
  }
}
