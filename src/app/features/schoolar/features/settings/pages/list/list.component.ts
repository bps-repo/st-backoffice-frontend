import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Setting {
  id: string;
  name: string;
  value: string;
  description: string;
  category: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ListComponent implements OnInit {
  settings: Setting[] = [
    {
      id: '1',
      name: 'school_name',
      value: 'My School',
      description: 'The name of the school',
      category: 'General'
    },
    {
      id: '2',
      name: 'school_email',
      value: 'contact@myschool.com',
      description: 'The email address of the school',
      category: 'Contact'
    },
    {
      id: '3',
      name: 'school_phone',
      value: '+1234567890',
      description: 'The phone number of the school',
      category: 'Contact'
    },
    {
      id: '4',
      name: 'default_language',
      value: 'Portuguese',
      description: 'The default language for the school',
      category: 'Localization'
    },
    {
      id: '5',
      name: 'timezone',
      value: 'UTC+0',
      description: 'The timezone for the school',
      category: 'Localization'
    }
  ];

  categories: string[] = [];
  filteredSettings: Setting[] = [];
  selectedCategory: string = 'All';
  loading = false;

  constructor() {}

  ngOnInit(): void {
    // Extract unique categories
    this.categories = ['All', ...new Set(this.settings.map(setting => setting.category))];
    this.filterSettings();
  }

  filterSettings(): void {
    if (this.selectedCategory === 'All') {
      this.filteredSettings = [...this.settings];
    } else {
      this.filteredSettings = this.settings.filter(setting => setting.category === this.selectedCategory);
    }
  }

  onCategoryChange(): void {
    this.filterSettings();
  }

  saveSettings(): void {
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
      alert('Settings saved successfully');
    }, 500);
  }
}
