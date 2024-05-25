import { Calendar, CalendarOptions } from './Calendar';

interface DateRangePickerOptions extends CalendarOptions {
  placeholder?: string;
}

export class DateRangePicker {
  public element: HTMLElement;
  private startDate: Date | null;
  private endDate: Date | null;
  private placeholder: string;
  private calendarStart: Calendar;
  private calendarEnd: Calendar;
  private calendarContainer: HTMLElement;
  private button: HTMLButtonElement;

  constructor(options: DateRangePickerOptions = {}) {
    this.startDate = null;
    this.endDate = null;
    this.placeholder = options.placeholder || 'Выберите период';

    this.calendarStart = new Calendar({
      ...options,
      onDateChange: (date: Date) => this.handleStartDateChange(date),
      dateCellClass: (date: Date) => this.getDateCellClass(date, 'start')
    });

    this.calendarEnd = new Calendar({
      ...options,
      onDateChange: (date: Date) => this.handleEndDateChange(date),
      dateCellClass: (date: Date) => this.getDateCellClass(date, 'end')
    });

    this.button = document.createElement('button');
    this.button.className = 'DateRangePicker__button';
    this.updateButtonLabel();

    this.calendarContainer = document.createElement('div');
    this.calendarContainer.className = 'DateRangePicker__calendar-container';
    this.calendarContainer.style.display = 'none';
    this.calendarContainer.appendChild(this.calendarStart.element);
    this.calendarContainer.appendChild(this.calendarEnd.element);

    this.element = document.createElement('div');
    this.element.className = 'DateRangePicker';
    this.element.appendChild(this.button);
    this.element.appendChild(this.calendarContainer);

    this.addEventListeners();
  }

  private updateButtonLabel() {
    if (this.startDate && this.endDate) {
      this.button.textContent = `${this.startDate.toLocaleDateString()} - ${this.endDate.toLocaleDateString()}`;
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

    document.addEventListener('click', (event) => {
      if (!this.element.contains(event.target as Node)) {
        this.hideCalendar();
      }
    }, true);
  }

  private handleStartDateChange(date: Date) {
    if (this.startDate && this.startDate.getTime() === date.getTime()) {
      this.startDate = null;
    } else {
      this.startDate = new Date(date);
      if (this.endDate && this.endDate < this.startDate) {
        this.endDate = null;
      }
    }
    this.updateCalendars();
    this.updateButtonLabel();
  }

  private handleEndDateChange(date: Date) {
    if (this.endDate && this.endDate.getTime() === date.getTime()) {
      this.endDate = null;
    } else {
      this.endDate = new Date(date);
      if (this.startDate && this.endDate < this.startDate) {
        this.startDate = null;
      }
    }
    this.updateCalendars();
    this.updateButtonLabel();
  }

  private updateCalendars() {
    this.calendarStart.updateCalendar();
    this.calendarEnd.updateCalendar();
  }

  private getDateCellClass(date: Date, _calendarType: 'start' | 'end'): string {
    let className = '';
    if (this.startDate && this.startDate.toDateString() === date.toDateString()) {
      className += ' Calendar__cell--selected-start';
    }
    if (this.endDate && this.endDate.toDateString() === date.toDateString()) {
      className += ' Calendar__cell--selected-end';
    }
    if (this.startDate && this.endDate && date > this.startDate && date < this.endDate) {
      className += ' Calendar__cell--in-range';
    }
    return className;
  }
}