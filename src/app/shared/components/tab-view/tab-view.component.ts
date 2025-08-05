import { Component, Input, OnChanges, SimpleChanges, ViewContainerRef, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { Tab } from '../../models/tab';

@Component({
  selector: 'app-tab-view',
  standalone: true,
  imports: [
    CommonModule,
    TabViewModule
  ],
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.scss']
})
export class TabViewComponent implements OnChanges {
  @Input() tabs: Tab[] = [];
  @Input() data: any;
  @Input() activeIndex = 0;

  viewContainerRef = inject(ViewContainerRef);
  injector = inject(Injector);

  ngOnChanges(changes: SimpleChanges): void {
    // Se os dados mudarem, atualize os valores dos tokens
    if (changes['data'] && this.tabs) {
      this.updateTabData();
    }
  }

  private updateTabData(): void {
    // Atualiza os dados para cada aba
    this.tabs.forEach(tab => {
      if (tab.data && tab.data.token) {
        tab.data.value = this.data;
      }
    });
  }

  getInjector(tab: Tab): Injector {
    // Se a aba tiver dados e um token, crie um injetor com o token e o valor
    if (tab.data && tab.data.token) {
      return Injector.create({
        providers: [
          { provide: tab.data.token, useValue: tab.data.value || this.data }
        ],
        parent: this.injector
      });
    }
    return this.injector;
  }
}