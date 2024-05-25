import { Calendar, CalendarOptions } from './Calendar';
import { isSameDate } from './utils/date.ts';

interface DatePickerOptions {
  placeholder?: string;
  defaultDate?: Date;
  closeCalendarOnSelectDate?: boolean;
  calendarOptions?: Omit<CalendarOptions, 'onDateChange'>;
}

export class DatePicker {
  public element: HTMLElement;
  private selectedDate: Date | null;
  private placeholder: string;
  private closeCalendarOnSelectDate: boolean;
  private calendar: Calendar;
  private calendarContainer: HTMLElement;
  private button: HTMLButtonElement;

  constructor(options: DatePickerOptions = {}) {
    this.selectedDate = options.defaultDate || null;
    this.placeholder = options.placeholder || 'Выберите дату';
    this.closeCalendarOnSelectDate = options.closeCalendarOnSelectDate || false;

    this.calendar = new Calendar({
      ...options.calendarOptions,
      onDateChange: (date: Date) => {
        const prevSelectedDate = this.selectedDate;
        this.selectedDate = new Date(date);
        this.updateButtonLabel();
        this.calendar.updateCalendar();

        if (this.closeCalendarOnSelectDate) {
          if (!prevSelectedDate || !isSameDate(prevSelectedDate, date)) {
            this.hideCalendar();
          }
        }
      },
      dateCellClass: (date: Date) => {
        console.log(this.selectedDate && isSameDate(this.selectedDate, date));
        if (this.selectedDate && isSameDate(this.selectedDate, date)) {
          return 'Calendar__cell--selected-day';
        }
        return '';
      },
    });

    this.button = document.createElement('button');
    this.button.className = 'DatePicker__button';
    this.updateButtonLabel();

    this.calendarContainer = document.createElement('div');
    this.calendarContainer.className = 'DatePicker__calendar-container';
    this.calendarContainer.style.display = 'none';
    this.calendarContainer.appendChild(this.calendar.element);

    this.element = document.createElement('div');
    this.element.className = 'DatePicker';
    this.element.appendChild(this.button);
    this.element.appendChild(this.calendarContainer);

    this.addEventListeners();
  }

  private updateButtonLabel() {
    if (this.selectedDate) {
      this.button.textContent = this.selectedDate.toLocaleDateString();
    } else {
      this.button.textContent = this.placeholder;
    }
  }

  private showCalendar() {
    this.calendarContainer.style.display = 'flex';
  }

  private hideCalendar() {
    this.calendarContainer.style.display = 'none';
  }

  private addEventListeners() {
    this.button.addEventListener('click', () => {
      if (this.calendarContainer.style.display === 'none') {
        this.showCalendar();
      } else {
        this.hideCalendar();
      }
    });

    document.addEventListener(
      'click',
      (event) => {
        if (!this.element.contains(event.target as Node)) {
          this.hideCalendar();
        }
      },
      true,
    );
  }
}
