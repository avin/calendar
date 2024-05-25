import '../lib/DatePicker.scss';
import { DatePicker } from '../lib';
import { generalCalendarOptions } from './calendar.ts';

export const renderDatePicker = (parentElement: HTMLElement) => {
  const calendar = new DatePicker({
    closeCalendarOnSelectDate: true,
    calendarOptions: {
      ...generalCalendarOptions,
    }
  });

  parentElement.append(calendar.element);
};
