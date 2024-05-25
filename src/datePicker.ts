import { format } from 'date-fns';
import '../lib/DatePicker.scss';
import { DatePicker } from '../lib';
import { generalCalendarOptions } from './calendar.ts';

export const renderDatePicker = (parentElement: HTMLElement) => {
  const calendar = new DatePicker({
    closeCalendarOnSelectDate: true,
    renderButtonLabel: (val: Date | null) => {
      if (val) {
        return format(val, 'dd.MM.yyyy HH:mm:ss');
      }
      return 'Выбрать дату и время';
    },
    onSelect: (v: Date | null) => {
      console.log('Selected dateTime:', v);
    },
    calendarOptions: {
      ...generalCalendarOptions,
    },
  });

  parentElement.append(calendar.element);
};
