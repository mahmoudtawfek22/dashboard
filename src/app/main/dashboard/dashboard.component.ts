import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private dash: DashboardService) {}
  _unsubscribe$: Subject<boolean> = new Subject();
  selectedIndex: number = 0;
  kpiCards: any;
  ngOnInit(): void {
    this.getDashboard(0);
  }

  getDashboard(duration: number = 0) {
    this.selectedIndex = duration;
    this.dash
      .getDash(duration)
      .pipe(
        tap((res: any) => {
          this.kpiCards = res;
        }),
        takeUntil(this._unsubscribe$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(true);
    this._unsubscribe$.complete();
  }
}
