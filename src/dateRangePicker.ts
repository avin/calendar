import { format } from 'date-fns';
import '../lib/DateRangePicker.scss';
import { DateRangePicker } from '../lib';
import { generalCalendarOptions } from './calendar.ts';

export const renderDateRangePicker = (parentElement: HTMLElement) => {
  const calendar = new DateRangePicker({
    renderButtonLabel: (val: [Date, Date] | null) => {
      if (val) {
        return `${format(val[0], 'dd.MM.yyyy HH:mm:ss')} - ${format(val[1], 'dd.MM.yyyy HH:mm:ss')}`;
      }
      return 'Выбрать временной диапазон';
    },
    onSelect: (v: [Date, Date] | null) => {
      console.log('Selected date range', v);
    },
    calendarOptions: {
      ...generalCalendarOptions,
    },
  });

  parentElement.append(calendar.element);
};
