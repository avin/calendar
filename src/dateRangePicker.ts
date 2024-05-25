import '../lib/DateRangePicker.scss';
import { DateRangePicker } from '../lib';
import { generalCalendarOptions } from './calendar.ts';

export const renderDateRangePicker = (parentElement: HTMLElement) => {
  const calendar = new DateRangePicker({
    ...generalCalendarOptions,
  });

  parentElement.append(calendar.element);
};
