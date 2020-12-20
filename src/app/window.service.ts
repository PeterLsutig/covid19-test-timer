import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {EventManager} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  private readonly mobileMaxWidth = 700;
  private readonly TabletMaxWidth = 1023;

  private resizeSubject: BehaviorSubject<Window>;

  get device(): 'mobile' | 'tablet' | 'desktop' {
    if (this.width <= this.mobileMaxWidth) { return 'mobile'; }
    if (this.width <= this.TabletMaxWidth) { return 'tablet'; }
    return 'desktop';

  }

  get onResize$(): Observable<Window> {
    return this.resizeSubject.asObservable();
  }

  get width(): number {
    return this.resizeSubject.value.innerWidth;
  }

  get height(): number {
    return this.resizeSubject.value.innerHeight;
  }

  constructor(private eventManager: EventManager) {
    this.resizeSubject = new BehaviorSubject<Window>(window);
    this.eventManager.addGlobalEventListener('window', 'resize', this.onResize.bind(this));
  }

  private onResize(event: UIEvent) {
    this.resizeSubject.next(event.target as Window);
  }
}
