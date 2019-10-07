import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map
} from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';

declare var require: any;
const parseIcons = () => {
  const codepoints: string = require('!raw-loader!material-design-icons/iconfont/codepoints').default;
  const points: string[] = codepoints.split(`\n`).map((item) => {
    return item.split(` `)[0];
  });
  points.pop();
  return points;
};
const ICONS: string[] = parseIcons();

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
})
export class IconsComponent implements OnInit {
  term = new BehaviorSubject<string>('');
  icons: Observable<string[]> = of(ICONS);
  filteredIcons: Observable<string[]>;

  @ViewChild('selected', { static: false }) selected: ElementRef;

  constructor(private notificationSvc: NotificationService) {}

  ngOnInit() {
    this.filteredIcons = this.term.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.filterIcons(term))
    );
  }

  toClipBoard(icon: string) {
    this.selected.nativeElement.value = `<mat-icon>${icon}</mat-icon>`;
    this.selected.nativeElement.select();
    document.execCommand('copy');
    this.notificationSvc.success(`Copied '${icon}'`);
  }

  filterIcons(q: string): Observable<string[]> {
    return this.icons.pipe(map(item => item.filter(i => i.includes(q))));
  }
}
