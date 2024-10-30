import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, throwError} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {Olympic} from "../models/Olympic";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null> (null);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((olympics) => {
        const formattedOlympics = olympics.map((country) => ({
          ...country,
          totalMedalsCount: country.participations.reduce((sum, participation) => sum + participation.medalsCount, 0),
          totalAthletesCount: country.participations.reduce((sum, participation) => sum + participation.athleteCount, 0)
        }));
        this.olympics$.next(formattedOlympics);
      }),
      catchError((error) => {
        console.error('Error fetching Olympic data:', error);
        this.olympics$.next(null);
        return throwError(() => new Error('Failed to load Olympic data. Please try again later.'));
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getJOCount(): Observable<number> {
    return this.getOlympics().pipe(
      map((olympics) => {
        if (!olympics) return 0;
        const uniqueYears = new Set<number>();

        olympics.forEach((country) => {
          country.participations.forEach((participation) => {
            uniqueYears.add(participation.year);
          });
        });
        return uniqueYears.size;
      })
    );
  }
}
