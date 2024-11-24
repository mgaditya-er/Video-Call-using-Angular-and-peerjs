import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {
  getNavigator(): Navigator | undefined {
    return typeof window !== 'undefined' ? window.navigator : undefined;
  }
}
