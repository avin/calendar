import { Calendar, CalendarOptions } from './Calendar';

interface DateRangePickerOptions {
  renderButtonLabel?: (v: [Date, Date] | null) => string;
  onSelect?: (v: [Date, Date] | null) => void;
  defaultDateRange?: [Date, Date] | null;
  calendarOptions?: Omit<CalendarOptions, 'onDateChange'>;
}

export class DateRangePicker {
  public element: HTMLElement;
  private startDate: Date | null;
  private endDate: Date | null;
  private renderButtonLabel: DateRangePickerOptions['renderButtonLabel'];
  private onSelect: DateRangePickerOptions['onSelect'];
  private calendarStart: Calendar;
  private calendarEnd: Calendar;
  private calendarContainer: HTMLElement;
  private button: HTMLButtonElement;

  constructor(options: DateRangePickerOptions = {}) {
    this.startDate = options.defaultDateRange ? options.defaultDateRange[0] : null;
    this.endDate = options.defaultDateRange ? options.defaultDateRange[1] : null;
    this.renderButtonLabel = options.renderButtonLabel;
    this.onSelect = options.onSelect;

    this.calendarStart = new Calendar({
      ...options.calendarOptions,
      onDateChange: (date: Date) => {
        this.handleStartDateChange(date);
      },
      dateCellClass: (date: Date) => {
        let className = this.getDateCellClass(date, 'start');
        if (options.calendarOptions?.dateCellClass) {
          className += options.calendarOptions?.dateCellClass(date);
        }
        return className;
      },
    });

    this.calendarEnd = new Calendar({
      ...options.calendarOptions,
      onDateChange: (date: Date) => {
        this.handleEndDateChange(date);
      },
      dateCellClass: (date: Date) => {
        let className = this.getDateCellClass(date, 'end');
        if (options.calendarOptions?.dateCellClass) {
          className += options.calendarOptions?.dateCellClass(date);
        }
        return className;
      },
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
      if (this.renderButtonLabel) {
        this.button.textContent = this.renderButtonLabel([this.startDate, this.endDate]);
      } else {
        this.button.textContent = `${this.startDate.toLocaleDateString()} - ${this.endDate.toLocaleDateString()}`;
      }
    } else {
      if (this.renderButtonLabel) {
        this.button.textContent = this.renderButtonLabel(null);
      } else {
        this.button.textContent = 'Choose date range';
      }
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

  private handleStartDateChange(date: Date) {
    this.startDate = new Date(date);
    if (this.endDate && this.endDate < this.startDate) {
      this.endDate = null;
    }

    this.updateCalendars();
    this.updateButtonLabel();
    this.handleSelect();
  }

  private handleEndDateChange(date: Date) {
    this.endDate = new Date(date);
    if (this.startDate && this.endDate < this.startDate) {
      this.startDate = null;
    }

    this.updateCalendars();
    this.updateButtonLabel();
    this.handleSelect();
  }

  private handleSelect() {
    if (this.onSelect) {
      if (this.startDate && this.endDate) {
        this.onSelect([this.startDate, this.endDate]);
      } else {
        this.onSelect(null);
      }
    }
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
