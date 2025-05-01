import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { finalize, Subject, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, SpinnerComponent],

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private dash: DashboardService) {}
  _unsubscribe$: Subject<boolean> = new Subject();
  selectedIndex: number = 0;
  kpiCards: any;
  isLoading: boolean = false;
  doughnutChartOptions = {
    responsive: true,
    cutout: '70%', // Inner radius for the doughnut chart
    plugins: {
      legend: {
        // position: 'right' as const, // Explicitly define the type using 'as const'
        // labels: {
        //   font: {
        //     size: 11, // Adjust font size
        //   },
        // },
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw}%`, // Format tooltips
        },
      },
      // Ensure your custom plugin is applied correctly
      centerText: {
        text: '75%\nPreformence',
        fontColor: '#000',
        fontSize: '16px',
      },
    },
  };
  doughnutChartLabels: string[] = ['Preformence'];

  doughnutChartData = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [75, 25], // Your chart data (totals per stage)
        backgroundColor: [
          '#5396FC', // Blue
          'gray', // Yellow
        ],
        hoverBackgroundColor: ['#5396FC', 'gray'],
        borderWidth: 0,
      },
    ],
  };

  centerTextPlugin = [
    {
      id: 'centerText',
      beforeDraw(chart: any) {
        const ctx = chart.ctx;
        const text = chart.options.plugins.centerText.text; // Access custom text
        const fontColor = chart.options.plugins.centerText.fontColor || '#000';
        const fontSize = chart.options.plugins.centerText.fontSize || '16px';
        const fontWeight =
          chart.options.plugins.centerText.fontWeight || 'bolder';

        // Calculate the center position
        const centerX = chart.width / 2;
        const centerY = chart.height / 2;

        ctx.save();
        ctx.font = `${fontWeight} ${fontSize}  Tajawal`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const lines = text.split('\n'); // Split multi-line text
        lines.forEach((line: string, i: number) => {
          ctx.fillText(line, centerX, centerY + i * parseInt(fontSize));
        });
        ctx.restore();
      },
    },
  ];

  doughnutChartOptions2 = {
    responsive: true,
    cutout: '70%', // Inner radius for the doughnut chart
    plugins: {
      legend: {
        // position: 'right' as const, // Explicitly define the type using 'as const'
        // labels: {
        //   font: {
        //     size: 11, // Adjust font size
        //   },
        // },
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw}%`, // Format tooltips
        },
      },
      // Ensure your custom plugin is applied correctly
      centerText: {
        text: '75%\nAvailability',
        fontColor: '#000',
        fontSize: '16px',
      },
    },
  };
  doughnutChartLabels2: string[] = ['Availability'];

  doughnutChartData2 = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [75, 25], // Your chart data (totals per stage)
        backgroundColor: [
          '#5396FC', // Blue
          'gray', // Yellow
        ],
        hoverBackgroundColor: ['#5396FC', 'gray'],
        borderWidth: 0,
      },
    ],
  };

  centerTextPlugin2 = [
    {
      id: 'centerText',
      beforeDraw(chart: any) {
        const ctx = chart.ctx;
        const text = chart.options.plugins.centerText.text; // Access custom text
        const fontColor = chart.options.plugins.centerText.fontColor || '#000';
        const fontSize = chart.options.plugins.centerText.fontSize || '16px';
        const fontWeight =
          chart.options.plugins.centerText.fontWeight || 'bolder';

        // Calculate the center position
        const centerX = chart.width / 2;
        const centerY = chart.height / 2;

        ctx.save();
        ctx.font = `${fontWeight} ${fontSize}  Tajawal`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const lines = text.split('\n'); // Split multi-line text
        lines.forEach((line: string, i: number) => {
          ctx.fillText(line, centerX, centerY + i * parseInt(fontSize));
        });
        ctx.restore();
      },
    },
  ];
  ngOnInit(): void {
    this.getDashboard(0);
  }

  getDashboard(duration: number = 0) {
    this.isLoading = true;
    this.selectedIndex = duration;
    this.dash
      .getDash(duration)
      .pipe(
        tap((res: any) => {
          this.kpiCards = res;

          this.doughnutChartData = {
            ...this.doughnutChartData,
            datasets: [
              {
                ...this.doughnutChartData.datasets[0],
                data: [res.performance, 1 - res.performance],
              },
            ],
          };

          this.doughnutChartOptions = {
            ...this.doughnutChartOptions,
            plugins: {
              ...this.doughnutChartOptions.plugins,
              centerText: {
                text: `${+res.performance.toFixed(2)}%\nPreformance`,
                fontColor: '#000',
                fontSize: '16px',
              },
            },
          };

          this.doughnutChartData2 = {
            ...this.doughnutChartData,
            datasets: [
              {
                ...this.doughnutChartData.datasets[0],
                data: [res.availability, 1 - res.availability],
              },
            ],
          };

          this.doughnutChartOptions2 = {
            ...this.doughnutChartOptions,
            plugins: {
              ...this.doughnutChartOptions.plugins,
              centerText: {
                text: `${+res.availability.toFixed(2)}%\nAvailability`,
                fontColor: '#000',
                fontSize: '16px',
              },
            },
          };
        }),
        takeUntil(this._unsubscribe$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(true);
    this._unsubscribe$.complete();
  }
}
