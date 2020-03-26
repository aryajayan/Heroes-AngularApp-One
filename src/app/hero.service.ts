import { MessageService } from './message.service';
import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getHero(id: number): Observable<Hero> {
    const url = this.heroesUrl + '/' + id;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`HeroService : Fetched Hero id =${id}`)),
      catchError(this.handleError<Hero>('getHero id=' + id))
    );
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('Fetched Heroes!')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log('hero updated id= ' + hero.id)),
        catchError(this.handleError<any>('updatehero'))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log('Hero Added Id=' + hero.id)),
        catchError(this.handleError<Hero>('AddHero'))
      );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = this.heroesUrl + '/' + id;
    return this.http.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap(_ => this.log('Deleted Hero id=' + id)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  searchHero(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    } else {
      return this.http.get<Hero[]>(this.heroesUrl + '/?name=' + term)
        .pipe(
          tap(x => x.length === 0 ? this.log('No Heroes found') : this.log('found heroes matching' + term)),
          catchError(this.handleError<Hero[]>('searchHero', []))
        );
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
