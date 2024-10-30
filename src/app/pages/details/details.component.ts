import { Component, OnInit } from '@angular/core';
import { Olympic } from "../../core/models/Olympic";
import { OlympicService } from "../../core/services/olympic.service";
import { ActivatedRoute } from "@angular/router";
import { ApexChart, ApexAxisChartSeries, ApexXAxis, ApexYAxis, ApexDataLabels } from 'ng-apexcharts';
import { map, Observable, of, tap } from 'rxjs';

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  public countryDetails$: Observable<Olympic | undefined> = of(undefined);
  public lineChartOptions: Partial<LineChartOptions>;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {
    this.lineChartOptions = {
      series: [],
      chart: {
        type: 'line',
        height: 350,
        zoom: {
          enabled: false
        },
      },
      xaxis: {
        categories: [],
        title: {
          text: 'Dates'
        }
      },
      yaxis: {
        title: {
          text: 'Number of medals'
        }
      },
      dataLabels: {
        enabled: true
      }
    };
  }

  ngOnInit(): void {
    const countryId = +this.route.snapshot.paramMap.get('id')!;
    this.countryDetails$ = this.olympicService.getOlympics().pipe(
      map(olympics => olympics ? olympics.find(country => country.id === countryId) : undefined),
      tap(country => {
        if (country && country.participations && country.participations.length > 0) {
          this.updateLineChart(country);
        }
      })
    );
  }

  updateLineChart(country: Olympic) {
    if (country && country.participations && country.participations.length > 0) {
      const years = country.participations.map(participation => participation.year);
      const medals = country.participations.map(participation => participation.medalsCount);

      this.lineChartOptions = {
        ...this.lineChartOptions,
        series: [
          {
            name: 'Medals',
            data: medals
          }
        ],
        xaxis: {
          ...this.lineChartOptions.xaxis,
          categories: years
        }
      };
    }
  }

}
