import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { DictionaryService, DictionaryEntry } from '../../shared/services/DictionaryService';
import { DictionaryLearningTag, DictionaryErrorTag, DictionaryTopicTag } from '../../teacher/teacherdictionary/teacherdictionary.component';

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './dictionary.component.html',
  styleUrl: './dictionary.component.css'
})
export class DictionaryComponent implements OnInit {
  dictionaryEntries: DictionaryEntry[] = [];
  filteredEntries: DictionaryEntry[] = [];
  isLoading = false;
  error = '';
  searchTerm = '';

  // For filtering
  selectedTopicTag: string = '';
  selectedErrorTag: string = '';
  selectedLearningTag: string = '';

  // Available tag options
  topicTags = Object.values(DictionaryTopicTag);
  errorTags = Object.values(DictionaryErrorTag);
  learningTags = Object.values(DictionaryLearningTag);

  sortOption: 'date' | 'alphabetical' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private dictionaryService: DictionaryService) {}

  ngOnInit(): void {
    this.fetchDictionaryEntries();
  }

  fetchDictionaryEntries(): void {
    this.isLoading = true;
    this.error = '';

    this.dictionaryService.getStudentDictionary().subscribe({
      next: (response) => {
        this.dictionaryEntries = response;
        this.applyFilters(); // Apply any active filters to the loaded data
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching dictionary entries', error);
        this.error = 'Failed to load dictionary entries. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // Filter entries based on search term and selected tags
  applyFilters(): void {
    let result = this.dictionaryEntries;

    // Apply text search
    if (this.searchTerm.trim() !== '') {
      const searchLower = this.searchTerm.toLowerCase();
      result = result.filter(entry =>
        entry.word.toLowerCase().includes(searchLower) ||
        entry.mistakeDescription.toLowerCase().includes(searchLower)
      );
    }

    // Apply tag filters
    if (this.selectedTopicTag) {
      result = result.filter(entry => entry.topicTags.includes(this.selectedTopicTag));
    }

    if (this.selectedErrorTag) {
      result = result.filter(entry => entry.errorTags.includes(this.selectedErrorTag));
    }

    if (this.selectedLearningTag) {
      result = result.filter(entry => entry.learningTags.includes(this.selectedLearningTag));
    }

    // Apply sorting
    result = this.sortEntries(result);

    this.filteredEntries = result;
  }

  // Sort entries based on current sort options
  sortEntries(entries: DictionaryEntry[]): DictionaryEntry[] {
    return [...entries].sort((a, b) => {
      let comparison = 0;

      if (this.sortOption === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (this.sortOption === 'alphabetical') {
        comparison = a.word.localeCompare(b.word);
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  // Reset all filters
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedTopicTag = '';
    this.selectedErrorTag = '';
    this.selectedLearningTag = '';
    this.applyFilters();
  }

  // Handle sort changes
  updateSort(option: 'date' | 'alphabetical'): void {
    if (this.sortOption === option) {
      // Toggle direction if clicking the same option
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOption = option;
      // Reset to default direction when changing sort option
      this.sortDirection = option === 'date' ? 'desc' : 'asc';
    }
    this.applyFilters();
  }

  // Returns appropriate icon class based on current sort
  getSortIconClass(option: 'date' | 'alphabetical'): string {
    if (this.sortOption !== option) return 'sort-inactive';
    return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
