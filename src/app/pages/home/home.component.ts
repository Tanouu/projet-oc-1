import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from "../../core/models/Olympic";
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ApexLegend, ApexTooltip } from 'ng-apexcharts';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics: Olympic[] = [];
  public totalJOCount: number = 0;
  public chartOptions: Partial<ChartOptions>;
  private subscriptions: Subscription = new Subscription();

  constructor(private olympicService: OlympicService, private router: Router) {
    this.chartOptions = {
      series: [],
      chart: {
        type: "pie",
        height: 350,
        width: 450,
        events: {
          dataPointSelection: (event, chartContext, config) => {
            this.onChartClick(config.dataPointIndex);
          }
        }
      },
      labels: [],
      legend: {
        position: 'bottom',
        offsetY: -10
      },
      tooltip: {
        y: {
          formatter: (val: number) => val.toFixed(0) + " médailles"
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 450
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  ngOnInit(): void {
    const olympicsSub = this.olympicService.getOlympics().subscribe((olympics) => {
      this.olympics = olympics || [];
      this.updateChartOptions();
    });
    this.subscriptions.add(olympicsSub);

    const totalJOCountSub = this.olympicService.getJOCount().subscribe((count) => {
      this.totalJOCount = count;
    });
    this.subscriptions.add(totalJOCountSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateChartOptions() {
    const countries = this.olympics.map((country) => country.country);
    const medals = this.olympics.map((country) =>
      country.participations.reduce((sum, participation) => sum + participation.medalsCount, 0)
    );

    this.chartOptions = {
      ...this.chartOptions,
      series: medals,
      labels: countries
    };
  }

  onChartClick(id: number) {
    setTimeout(() => {
      const selectedCountry = this.olympics[id];
      if (selectedCountry) {
        this.router.navigate(['/details', selectedCountry.id]);
      }
    }, 100);
  }
}
