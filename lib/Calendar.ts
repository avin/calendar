import { shiftArray } from './utils/array.ts';

export interface CalendarOptions {
  daysOfWeek?: string[];
  defaultDate?: Date;
  firstDayOfWeek?: number; // 0 for Sunday, 1 for Monday, etc.
  monthNames?: string[];
  yearRange?: number;
  showTimePicker?: boolean;
  showSeconds?: boolean;
  onDateChange?: (selectedDate: Date) => void;
  dateCellClass?: (date: Date) => string;
}

export class Calendar {
  public element: HTMLElement;
  private daysOfWeek: string[];
  private defaultDate: Date;
  private firstDayOfWeek: number;
  private monthNames: string[];
  private yearRange: number;
  private showTimePicker: boolean;
  private showSeconds: boolean;
  private onDateChange?: (selectedDate: Date) => void;
  private dateCellClass?: (date: Date) => string;

  constructor(options: CalendarOptions = {}) {
    this.daysOfWeek = options.daysOfWeek || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.defaultDate = options.defaultDate || new Date(new Date().setHours(0, 0, 0, 0));
    this.firstDayOfWeek = options.firstDayOfWeek ?? 0;
    this.monthNames = options.monthNames || [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.yearRange = options.yearRange || 20;
    this.showTimePicker = options.showTimePicker ?? false;
    this.showSeconds = options.showSeconds ?? false;
    this.onDateChange = options.onDateChange;
    this.dateCellClass = options.dateCellClass;

    this.element = document.createElement('div');
    this.element.className = 'Calendar';
    this.element.innerHTML = this.render();
    this.addEventListeners();
  }

  private cn(element?: string, modifier?: string): string {
    let className = this.element.className;
    if (element) className += `__${element}`;
    if (modifier) className += `--${modifier}`;
    return className;
  }

  private render() {
    const month = this.defaultDate.getMonth();
    const year = this.defaultDate.getFullYear();

    let calendar = `
      <div class="${this.cn('controls')}">
        <select class="Calendar__select--month">
          ${this.monthNames.map((name, index) => `<option value="${index}" ${index === month ? 'selected' : ''}>${name}</option>`).join('')}
        </select>
        <select class="Calendar__select--year">
          ${this.generateYearOptions(year)}
        </select>
      </div>
      <table class="Calendar__table">
        <thead>
          <tr class="Calendar__row">
            ${this.renderDaysOfWeek()}
          </tr>
        </thead>
        <tbody>
          ${this.renderDays(month, year)}
        </tbody>
      </table>`;

    if (this.showTimePicker) {
      const hours = this.defaultDate.getHours();
      const minutes = this.defaultDate.getMinutes();
      const seconds = this.defaultDate.getSeconds();

      calendar += `
        <div class="Calendar__timepicker">
          <select class="Calendar__select--hours">
            ${this.generateTimeOptions(24, hours)}
          </select>
          <span>:</span>
          <select class="Calendar__select--minutes">
            ${this.generateTimeOptions(60, minutes)}
          </select>`;
      if (this.showSeconds) {
        calendar += `
          <span>:</span>
          <select class="Calendar__select--seconds">
            ${this.generateTimeOptions(60, seconds)}
          </select>`;
      }
      calendar += `</div>`;
    }

    return calendar;
  }

  private renderDaysOfWeek() {
    const shiftedDaysOfWeek = shiftArray(this.daysOfWeek, this.firstDayOfWeek);
    return shiftedDaysOfWeek
      .map((day) => `<th class="${this.cn('cell', 'header')}">${day}</th>`)
      .join('');
  }

  private renderDays(month: number, year: number) {
    const firstDay = (new Date(year, month, 1).getDay() - this.firstDayOfWeek + 7) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let days = `<tr class="${this.cn('row')}">`;

    for (let i = 0; i < firstDay; i++) {
      days += `<td class="${this.cn('cell', 'empty')}"></td>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const additionalClass = this.dateCellClass ? this.dateCellClass(date) : '';
      if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
        days += `</tr><tr class="${this.cn('row')}">`;
      }
      days += `<td class="${this.cn('cell', 'day')} ${additionalClass}" data-day="${day}">${day}</td>`;
    }

    days += '</tr>';
    return days;
  }

  private generateYearOptions(currentYear: number): string {
    const startYear = currentYear - this.yearRange;
    const endYear = currentYear + this.yearRange;
    let options = '';
    for (let year = startYear; year <= endYear; year++) {
      options += `<option value="${year}" ${year === currentYear ? 'selected' : ''}>${year}</option>`;
    }
    return options;
  }

  private generateTimeOptions(range: number, selectedValue: number): string {
    let options = '';
    for (let i = 0; i < range; i++) {
      options += `<option value="${i}" ${i === selectedValue ? 'selected' : ''}>${String(i).padStart(2, '0')}</option>`;
    }
    return options;
  }

  private addEventListeners() {
    const monthSelect = this.element.querySelector(
      `.${this.cn('select', 'month')}`,
    ) as HTMLSelectElement;
    const yearSelect = this.element.querySelector(
      `.${this.cn('select', 'year')}`,
    ) as HTMLSelectElement;
    const dayCells = this.element.querySelectorAll(`.${this.cn('cell', 'day')}`);
    const timeSelects = this.element.querySelectorAll(
      `.${this.cn('select', 'hours')}, .${this.cn('select', 'minutes')}, .${this.cn('select', 'seconds')}`,
    );

    monthSelect.addEventListener('change', (_event) => {
      this.defaultDate.setMonth(Number(monthSelect.value));
      this.updateCalendar();
    });

    yearSelect.addEventListener('change', (_event) => {
      this.defaultDate.setFullYear(Number(yearSelect.value));
      this.updateCalendar();
    });

    dayCells.forEach((cell) => {
      cell.addEventListener('click', (event) => {
        const day = (event.target as HTMLTableCellElement).dataset.day;
        if (day) {
          this.defaultDate.setDate(Number(day));
          this.updateSelectedTime();
          this.triggerDateChange();
        }
      });
    });

    timeSelects.forEach((select) => {
      select.addEventListener('change', (_event) => {
        this.updateSelectedTime();
        this.triggerDateChange();
      });
    });
  }

  public updateCalendar() {
    this.element.innerHTML = this.render();
    this.addEventListeners();
  }

  private updateSelectedTime() {
    const hoursSelect = this.element.querySelector(
      `.${this.cn('select', 'hours')}`,
    ) as HTMLSelectElement;
    const minutesSelect = this.element.querySelector(
      `.${this.cn('select', 'minutes')}`,
    ) as HTMLSelectElement;
    const secondsSelect = this.showSeconds
      ? (this.element.querySelector(`.${this.cn('select', 'seconds')}`) as HTMLSelectElement)
      : null;

    const hours = hoursSelect ? Number(hoursSelect.value) : 0;
    const minutes = minutesSelect ? Number(minutesSelect.value) : 0;
    const seconds = secondsSelect ? Number(secondsSelect.value) : 0;

    this.defaultDate.setHours(hours, minutes, seconds);
  }

  private triggerDateChange() {
    if (this.onDateChange) {
      this.onDateChange(this.defaultDate);
    }
  }
}
