import './styles.scss';
import { renderCalendar } from './calendar.ts';
import { renderDatePicker } from './datePicker.ts';
import { renderDateRangePicker } from './dateRangePicker.ts';

renderCalendar(document.querySelector('#app')!);
document.querySelector('#app')!.insertAdjacentHTML('beforeend', '<hr>');
renderDatePicker(document.querySelector('#app')!);
document.querySelector('#app')!.insertAdjacentHTML('beforeend', '<hr>');
renderDateRangePicker(document.querySelector('#app')!);
