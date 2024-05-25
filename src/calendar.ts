import '../lib/Calendar.scss';
import {Calendar, CalendarOptions} from '../lib';

export const generalCalendarOptions: CalendarOptions = {
  daysOfWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  firstDayOfWeek: 1,
  yearRange: 20,
  showTimePicker: true,
  showSeconds: true,
  onDateChange: (selectedDate: Date) => {
    console.log('Выбранная дата:', selectedDate);
  },
  dateCellClass: (date: Date) => {
    let result = '';
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      result += ' Calendar__cell--today';
    }
    if (date.getDay() === 0 || date.getDay() === 6) {
      result += ' Calendar__cell--weekend';
    }
    return result;
  },
}

export const renderCalendar = (parentElement: HTMLElement) => {
  const calendar = new Calendar({
    ...generalCalendarOptions
  });

  parentElement.append(calendar.element);
};
