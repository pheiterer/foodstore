import { Injectable } from '@angular/core';
import { Food } from '../shared/models/Food';
import { sample_foods } from 'src/data';
import { Tag } from '../shared/models/Tags';


@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor() { }

  getAll():Food[]{
    return sample_foods;
  }

  getAllFoodsBySearchTerm(searchTerm: string): Food[]{
    return this.getAll().filter(food => food.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  getFoodById(id: string): Food{
    return this.getAll().find(food => food.id === id) ?? new Food();
  }

  getAllTags(): Tag[] {
    const tagCount: { [key: string]: number } = {};
  
    this.getAll().forEach(food => {
      food.tags?.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
  
    const tags: Tag[] = Object.keys(tagCount).map(tag => ({
      name: tag,
      count: tagCount[tag]
    }));
  
    return [{ name: 'All', count: this.getAll().length }, ...tags];
  }

  getAllFoodsByTag(tag: string): Food[]{
    return tag === 'All' ? this.getAll() : this.getAll().filter(food => food.tags?.includes(tag));
  }

  

}
