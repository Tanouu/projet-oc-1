import {Component, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {Olympic} from "../../core/models/Olympic";
import {OlympicService} from "../../core/services/olympic.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  public countryDetails: Olympic | undefined;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    // Récupère l'ID depuis les paramètres de l'URL
    const countryId = +this.route.snapshot.paramMap.get('id')!;

    // Accède aux données déjà chargées dans le service
    this.olympicService.getOlympics().subscribe((olympics) => {
      this.countryDetails = olympics?.find(country => country.id === countryId);
    });
  }
}
