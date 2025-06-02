import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DictionaryService} from '../../shared/services/DictionaryService';
import {HttpClient} from '@angular/common/http';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';

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
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  message: string;
  timestamp: Date;
  type: 'text' | 'word-form';
}

@Component({
  selector: 'app-teacherdictionarychat',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    SidebarComponent
  ],
  templateUrl: './teacherdictionarychat.component.html',
  styleUrls: ['./teacherdictionarychat.component.css']
})
export class TeacherdictionarychatComponent implements OnInit {
  private baseApiUrl = 'http://localhost:8080/api/v1';

  // Chat-related properties
  messages: ChatMessage[] = [];
  currentMessage = '';
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  // Dictionary form properties
  dictionaryForm!: FormGroup;
  errorTags = Object.values(DictionaryErrorTag);
  topicTags = Object.values(DictionaryTopicTag);
  learningTags = Object.values(DictionaryLearningTag);
  isLoading = false;
  students: User[] = [];
  studentsLoading = false;
  studentsError = '';
  searchTerm = '';
  showWordForm = false;
  formSubmitted = false;
  selectedStudentId = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dictionaryService: DictionaryService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.fetchStudents();
    this.addMessage('assistant', 'Hello! Type /dict to add a new word to a student\'s dictionary.');
  }

  // Chat functionality
  sendMessage(): void {
    if (!this.currentMessage.trim()) return;

    const userMessage = this.currentMessage.trim();
    this.addMessage('user', userMessage);

    // Check for /addWord command
    if (userMessage.toLowerCase() === '/dict') {
      this.handleAddWordCommand();
    } else {
      // Regular chat response
      this.addMessage('assistant', 'I understand. Type /dict to add a new word to a student\'s dictionary.');
    }

    this.currentMessage = '';
    this.scrollToBottom();
  }

  handleAddWordCommand(): void {
    this.showWordForm = true;
    this.initializeForm(); // Reset form
    this.formSubmitted = false;
    this.selectedStudentId = '';
    this.searchTerm = '';
    this.addMessage('assistant', 'Please fill out the form below to add a new word:', 'word-form');
    setTimeout(() => this.scrollToBottom(), 100);
  }

  addMessage(sender: 'user' | 'assistant', message: string, type: 'text' | 'word-form' = 'text'): void {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      message,
      timestamp: new Date(),
      type
    };
    this.messages.push(newMessage);
  }

  scrollToBottom(): void {
    if (this.chatContainer) {
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }, 100);
    }
  }

  // Replace deprecated keypress with keydown
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // Dictionary form functionality
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
    this.selectedStudentId = studentId;
    const selectedStudent = this.students.find(student => student.id === studentId);

    if (selectedStudent) {
      const fullName = this.getFullName(selectedStudent);

      // Update the form with student ID - this is the key fix
      this.dictionaryForm.get('userId')?.setValue(studentId);
      this.dictionaryForm.get('userId')?.markAsDirty();
      this.dictionaryForm.get('userId')?.updateValueAndValidity();

      // Update the search term to display the selected student's name
      this.searchTerm = fullName;

      console.log('Student selected:', studentId);
      console.log('Form userId value after selection:', this.dictionaryForm.get('userId')?.value);
    }
  }

  getFullName(student: User): string {
    const name = student.name || '';
    const surname = student.lastName || '';
    const fullName = name && surname ? `${name} ${surname}` : name || surname || 'Unknown';
    return `${fullName} (ID: ${student.id})`;
  }

  private initializeForm(): void {
    // Reset form with default values
    this.dictionaryForm = this.fb.group({
      word: ['', [Validators.required, Validators.minLength(1)]],
      userId: ['', [Validators.required, Validators.minLength(1)]],
      mistakeDescription: ['', [Validators.required, Validators.minLength(5)]],
      topicTags: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      learningTags: ['', [Validators.required]],
      errorTags: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });

    // Reset checkboxes and radio buttons in the UI
    setTimeout(() => {
      // Clear all tags
      this.clearCheckboxesAndRadios();
    }, 0);
  }

  // Add a debug method to check form state
  debugFormState(): void {
    console.log('Current form state:', this.dictionaryForm.value);
    console.log('Form valid?', this.dictionaryForm.valid);
    console.log('selectedStudentId:', this.selectedStudentId);

    // Check specific fields
    Object.keys(this.dictionaryForm.controls).forEach(key => {
      const control = this.dictionaryForm.get(key);
      console.log(`Field ${key}:`, {
        value: control?.value,
        valid: control?.valid,
        errors: control?.errors
      });
    });
  }

  clearCheckboxesAndRadios(): void {
    // Clear topic tags
    this.topicTags.forEach(tag => {
      const checkbox = document.getElementById(`topic-${tag}`) as HTMLInputElement;
      if (checkbox) checkbox.checked = false;
    });

    // Clear error tags
    this.errorTags.forEach(tag => {
      const checkbox = document.getElementById(`error-${tag}`) as HTMLInputElement;
      if (checkbox) checkbox.checked = false;
    });

    // Clear learning tags
    this.learningTags.forEach(tag => {
      const radio = document.getElementById(`learning-${tag}`) as HTMLInputElement;
      if (radio) radio.checked = false;
    });
  }

  onTagChange(tagType: string, tagValue: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement)?.checked;

    if (tagType === 'learningTags') {
      if (isChecked) {
        this.dictionaryForm.patchValue({[tagType]: tagValue});
        this.learningTags.forEach(tag => {
          if (tag !== tagValue) {
            const checkbox = document.getElementById(`learning-${tag}`) as HTMLInputElement;
            if (checkbox) {
              checkbox.checked = false;
            }
          }
        });
      } else {
        this.dictionaryForm.patchValue({[tagType]: ''});
      }
    } else {
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
      return this.dictionaryForm.get(tagType)?.value === tagValue;
    } else {
      const formArray = this.dictionaryForm.get(tagType) as FormArray;
      return formArray?.controls.some(control => control.value === tagValue);
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    console.log('Form submitted with values:', this.dictionaryForm.value);

    // Enhanced debugging for troubleshooting
    this.debugFormState();

    // If we still have an issue with userId, double-check and try to fix it
    if (!this.dictionaryForm.get('userId')?.value && this.selectedStudentId) {
      console.log('Fixing userId from selectedStudentId:', this.selectedStudentId);
      this.dictionaryForm.get('userId')?.setValue(this.selectedStudentId);
      this.dictionaryForm.get('userId')?.markAsDirty();
      this.dictionaryForm.get('userId')?.updateValueAndValidity();
    }

    if (this.dictionaryForm.valid) {
      this.isLoading = true;
      const formData = this.dictionaryForm.value;

      // Ensure learningTags is an array for API consistency
      const formDataForApi = {
        ...formData,
        learningTags: formData.learningTags ? [formData.learningTags] : []
      };

      console.log('Sending to API:', formDataForApi);

      this.dictionaryService.addDictionaryEntry(formDataForApi).subscribe({
        next: (response) => {
          console.log('Word successfully added', response);
          this.addMessage('assistant', `✅ Word "${formData.word}" successfully added to the student's dictionary!`);
          this.showWordForm = false;
          this.initializeForm();
          this.isLoading = false;
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Error adding word', error);
          this.addMessage('assistant', `❌ Failed to add word "${formData.word}". Please try again.`);
          this.isLoading = false;
          this.scrollToBottom();
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.dictionaryForm.controls).forEach(key => {
        const control = this.dictionaryForm.get(key);
        control?.markAsTouched();
      });

      console.error('Form is invalid:', this.dictionaryForm.errors);

      // Show which specific fields are invalid for debugging
      Object.keys(this.dictionaryForm.controls).forEach(key => {
        const control = this.dictionaryForm.get(key);
        if (control?.invalid) {
          console.error(`Field ${key} is invalid:`, control.errors);
        }
      });
    }
  }

  cancelWordForm(): void {
    this.showWordForm = false;
    this.addMessage('assistant', 'Word addition cancelled. Type /addWord to try again.');
    this.scrollToBottom();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.dictionaryForm.get(fieldName);
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

  @ViewChild('sidebar') sidebar!: ElementRef;

// Function to show the student selector sidebar
  showStudentSelector(event: MouseEvent): void {
    event.preventDefault();
    if (this.sidebar) {
      this.sidebar.nativeElement.style.display = 'flex';
      // Add a small delay before adding the 'open' class to trigger the animation
      setTimeout(() => {
        this.sidebar.nativeElement.classList.add('open');
      }, 10);
    }
  }

// Function to hide the sidebar
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

}
