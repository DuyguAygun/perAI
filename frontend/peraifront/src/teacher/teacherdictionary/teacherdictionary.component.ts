import {Component, OnInit, ViewChild, ElementRef, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';
import {DictionaryService} from '../../shared/services/DictionaryService';
import {HttpClient} from '@angular/common/http';

export const DictionaryLearningTag = {
  LEARNED: 'LEARNED',
  NOT_LEARNED: 'NOT_LEARNED'
} as const;

export const DictionaryErrorTag = {
  SPELLING_ERROR: 'SPELLING_ERROR',
  GRAMMAR_ERROR: 'GRAMMAR_ERROR',
  PRONUNCIATION_ERROR: 'PRONUNCIATION_ERROR',
  FORGOT_MEANING: 'FORGOT_MEANING',
  FORGOT_USAGE: 'FORGOT_USAGE',
  WRONG_CONTEXT: 'WRONG_CONTEXT',
  TYPO: 'TYPO',
  MISHEARD_WORD: 'MISHEARD_WORD',
  CONFUSED_SIMILAR_WORDS: 'CONFUSED_SIMILAR_WORDS',
  OTHER: 'OTHER'
} as const;

export const DictionaryTopicTag = {
  GENERAL: 'GENERAL',
  SCIENCE: 'SCIENCE',
  TECHNOLOGY: 'TECHNOLOGY',
  BUSINESS: 'BUSINESS',
  CULTURE: 'CULTURE',
  DAILY_LIFE: 'DAILY_LIFE',
  ACADEMIC: 'ACADEMIC',
  ENTERTAINMENT: 'ENTERTAINMENT',
  HEALTH: 'HEALTH',
  TRAVEL: 'TRAVEL'
} as const;

export type DictionaryLearningTagType = typeof DictionaryLearningTag[keyof typeof DictionaryLearningTag];
export type DictionaryErrorTagType = typeof DictionaryErrorTag[keyof typeof DictionaryErrorTag];
export type DictionaryTopicTagType = typeof DictionaryTopicTag[keyof typeof DictionaryTopicTag];

interface User {
  id: string;
  name: string;
  lastName: string;
  // Add other User properties as needed
}

@Component({
  selector: 'app-teacherdictionary',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './teacherdictionary.component.html',
  styleUrl: './teacherdictionary.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TeacherdictionaryComponent implements OnInit {
  private baseApiUrl = 'http://localhost:8080/api/v1';

  dictionaryForm!: FormGroup;
  errorTags = Object.values(DictionaryErrorTag);
  topicTags = Object.values(DictionaryTopicTag);
  learningTags = Object.values(DictionaryLearningTag);
  isLoading = false;
  students: User[] = [];
  studentsLoading = false;
  studentsError = '';
  searchTerm = '';

  @ViewChild('sidebar') sidebar!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dictionaryService: DictionaryService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.fetchStudents();
  }

  fetchStudents(): void {
    this.studentsLoading = true;
    this.studentsError = '';

    this.http.get<User[]>(`${this.baseApiUrl}/students`).subscribe({
      next: (response) => {
        this.students = response;
        this.studentsLoading = false;
        console.log('Students loaded:', this.students);
      },
      error: (error) => {
        console.error('Error fetching students', error);
        this.studentsError = 'Failed to load students. Please try again later.';
        this.studentsLoading = false;
      }
    });
  }

  searchStudents(name: string): void {
    if (!name || name.trim() === '') {
      this.fetchStudents();
      return;
    }

    this.studentsLoading = true;
    this.http.get<User[]>(`${this.baseApiUrl}/students/search?name=${encodeURIComponent(name)}&size=10`).subscribe({
      next: (response) => {
        this.students = response;
        this.studentsLoading = false;
      },
      error: (error) => {
        console.error('Error searching students', error);
        this.studentsError = 'Failed to search students. Please try again later.';
        this.studentsLoading = false;
      }
    });
  }

  selectStudent(studentId: string): void {
    // Find the selected student
    const selectedStudent = this.students.find(student => student.id === studentId);

    if (selectedStudent) {
      const fullName = this.getFullName(selectedStudent);

      // Update the form with ID
      this.dictionaryForm.patchValue({
        userId: studentId
      });

      // Update the display in the input field to show both name and surname with ID
      const userIdInput = document.getElementById('userId') as HTMLInputElement;
      if (userIdInput) {
        userIdInput.value = fullName;
      }
    }
  }

  getFullName(student: User): string {
    const name = student.name || '';
    const surname = student.lastName || '';

    // Format the name with surname
    const fullName = name && surname ? `${name} ${surname}` : name || surname || 'Unknown';

    // Return the formatted name with ID
    return `${fullName} (ID: ${student.id})`;
  }

  private initializeForm(): void {
    this.dictionaryForm = this.fb.group({
      word: ['', [Validators.required, Validators.minLength(1)]],
      userId: ['', [Validators.required, Validators.minLength(1)]],
      mistakeDescription: ['', [Validators.required, Validators.minLength(5)]],
      topicTags: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      learningTags: ['', [Validators.required]], // Changed from FormArray to string
      errorTags: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  // Methods for managing selected tags
  onTagChange(tagType: string, tagValue: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement)?.checked;

    if (tagType === 'learningTags') {
      // For learning tags, set the single value directly
      if (isChecked) {
        this.dictionaryForm.patchValue({ [tagType]: tagValue });

        // Uncheck all other learning tags
        this.learningTags.forEach(tag => {
          if (tag !== tagValue) {
            const checkbox = document.getElementById(`learning-${tag}`) as HTMLInputElement;
            if (checkbox) {
              checkbox.checked = false;
            }
          }
        });
      } else {
        // If unchecking, clear the value
        this.dictionaryForm.patchValue({ [tagType]: '' });
      }
    } else {
      // For other tag types, use the FormArray approach
      const formArray = this.dictionaryForm.get(tagType) as FormArray;

      if (isChecked) {
        formArray.push(this.fb.control(tagValue));
      } else {
        const index = formArray.controls.findIndex(control => control.value === tagValue);
        if (index !== -1) {
          formArray.removeAt(index);
        }
      }
    }
  }

  isTagSelected(tagType: string, tagValue: string): boolean {
    if (tagType === 'learningTags') {
      // For learning tags, check if the value matches the selected one
      return this.dictionaryForm.get(tagType)?.value === tagValue;
    } else {
      // For other tag types, check in the FormArray
      const formArray = this.dictionaryForm.get(tagType) as FormArray;
      return formArray.controls.some(control => control.value === tagValue);
    }
  }

  showSidebar(event: MouseEvent): void {
    event.preventDefault();
    if (this.sidebar) {
      this.sidebar.nativeElement.style.display = 'flex';
      // Add a small delay before adding the 'open' class to trigger the animation
      setTimeout(() => {
        this.sidebar.nativeElement.classList.add('open');
      }, 10);
    }
  }

  hideSidebar(event: MouseEvent): void {
    event.preventDefault();
    if (this.sidebar) {
      // First remove the 'open' class to trigger the animation
      this.sidebar.nativeElement.classList.remove('open');
      // Then hide the sidebar after the animation completes
      setTimeout(() => {
        this.sidebar.nativeElement.style.display = 'none';
      }, 300); // Match this with the transition duration in CSS
    }
  }

  formSubmitted = false;

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.dictionaryForm.valid) {
      this.isLoading = true;
      const formData = this.dictionaryForm.value;

      // Convert single learning tag to array format for API consistency
      const formDataForApi = {
        ...formData,
        learningTags: formData.learningTags ? [formData.learningTags] : []
      };

      this.dictionaryService.addDictionaryEntry(formDataForApi).subscribe({
        next: (response) => {
          console.log('Word successfully added', response);
          this.dictionaryForm.reset();
          this.initializeForm(); // Reset form with new date
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error adding word', error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.dictionaryForm.controls).forEach(key => {
        const control = this.dictionaryForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.dictionaryForm.get(fieldName);
    // Special case for userId - don't show error until form submission attempted
    if (fieldName === 'userId') {
      return field ? (field.invalid && field.touched && this.formSubmitted) : false;
    }
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.dictionaryForm.get(fieldName);
    if (!control) return '';

    if (control.hasError('required')) {
      if (fieldName === 'learningTags') {
        return 'Learning status is required';
      }
      return `${fieldName.replace(/Tags$/, '')} is required`;
    }
    if (control.hasError('minlength')) {
      return `At least one ${fieldName.replace(/Tags$/, '')} must be selected`;
    }
    return '';
  }
}
