import { Injectable } from '@angular/core';
import { Food } from '../shared/models/Food';
import { Tag } from '../shared/models/Tags';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FOODS_ID_URL, FOODS_SEARCH_URL, FOODS_TAG_URL, FOODS_TAGS_URL, FOODS_URL } from '../shared/models/constants/urls';


@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http:HttpClient) {

   }

  getAll(): Observable<Food[]>{
    return this.http.get<Food[]>(FOODS_URL);
  }

  getAllFoodsBySearchTerm(searchTerm: string){
    return this.http.get<Food[]>(FOODS_SEARCH_URL + searchTerm);
  }

  getFoodById(id: string): Observable<Food>{
    return this.http.get<Food>(FOODS_ID_URL + id);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_TAGS_URL)
  }

  getAllFoodsByTag(tag: string): Observable<Food[]>{
    return this.http.get<Food[]>(FOODS_TAG_URL + tag);
  }
}
