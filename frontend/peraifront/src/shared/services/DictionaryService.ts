import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {
  DictionaryLearningTag,
  DictionaryErrorTag,
  DictionaryTopicTag
} from '../../teacher/teacherdictionary/teacherdictionary.component';
import {switchMap} from 'rxjs/operators';
import {AuthService} from '../../auth/auth.service';


export interface DictionaryEntry {
  id: string;
  word: string;
  userId: string;
  mistakeDescription: string;
  topicTags: string[];
  learningTags: string[];
  errorTags: string[];
  date: string;
}

// Interface to match the backend DTO structure
interface StudentDictionaryRequest {
  word: string;
  userId: number;
  mistakeDescription: string;
  topicTag: string[];
  learningTag: string;
  errorTag: string[];
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private baseApiUrl = 'http://localhost:8080/api/v1';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }

  // For teachers to add new entries
  addDictionaryEntry(entry: Omit<DictionaryEntry, 'id'>): Observable<DictionaryEntry> {
    // Convert from frontend model to backend DTO
    const requestBody: StudentDictionaryRequest = {
      word: entry.word,
      userId: parseInt(entry.userId), // Convert string to number for backend
      mistakeDescription: entry.mistakeDescription,
      topicTag: entry.topicTags, // Match backend field name (singular)
      learningTag: entry.learningTags[0], // Backend expects single value
      errorTag: entry.errorTags, // Match backend field name (singular)
      date: entry.date
    };

    return this.http.post<DictionaryEntry>(`${this.baseApiUrl}/dictionaries`, requestBody);
  }

  getStudentDictionary(): Observable<DictionaryEntry[]> {
    // First get the current user
    return this.authService.getCurrentUser().pipe(
      // Use switchMap to switch to a new observable after getting the user
      switchMap(user => {
        // Use the user's ID in the dictionary request
        return this.http.get<any[]>(`${this.baseApiUrl}/dictionaries?id=${user.id}`)
          .pipe(
            map(entries => {
              return entries.map(entry => this.transformBackendToFrontend(entry));
            })
          );
      })
    );
  }

  // For teachers to view all entries they've created
  getTeacherDictionary(): Observable<DictionaryEntry[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/dictionaries/teacher`)
      .pipe(
        map(entries => entries.map(entry => this.transformBackendToFrontend(entry)))
      );
  }

  // For teachers to view entries for a specific student
  getEntriesByStudent(studentId: string): Observable<DictionaryEntry[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/dictionaries?id=${parseInt(studentId)}`)
      .pipe(
        map(entries => entries.map(entry => this.transformBackendToFrontend(entry)))
      );
  }

  // For teachers to update the learning status of an entry
  updateEntryLearningStatus(entryId: string, status: typeof DictionaryLearningTag[keyof typeof DictionaryLearningTag]): Observable<DictionaryEntry> {
    return this.http.patch<any>(`${this.baseApiUrl}/dictionaries/${entryId}/status`, {status})
      .pipe(
        map(entry => this.transformBackendToFrontend(entry))
      );
  }

  // Get all available tags (utility method)
  getAllTags() {
    return {
      topicTags: Object.values(DictionaryTopicTag),
      errorTags: Object.values(DictionaryErrorTag),
      learningTags: Object.values(DictionaryLearningTag)
    };
  }

  // Helper method to transform backend response to frontend model
  private transformBackendToFrontend(backendEntry: any): DictionaryEntry {
    return {
      id: backendEntry.id?.toString() || '',
      word: backendEntry.word || '',
      userId: backendEntry.userId?.toString() || '',
      mistakeDescription: backendEntry.mistakeDescription || '',
      // Check for both topicTag and topics field names
      topicTags: Array.isArray(backendEntry.topicTag) ? backendEntry.topicTag :
        Array.isArray(backendEntry.topics) ? backendEntry.topics :
          backendEntry.topicTags || [],
      learningTags: backendEntry.learningTag ? [backendEntry.learningTag] :
        backendEntry.learningTags || [],
      errorTags: Array.isArray(backendEntry.errorTag) ? backendEntry.errorTag :
        Array.isArray(backendEntry.errorTags) ? backendEntry.errorTags : [],
      date: backendEntry.date || new Date().toISOString().split('T')[0]
    };
  }
}
