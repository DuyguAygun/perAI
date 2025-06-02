import {FormsModule} from '@angular/forms';
import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {CommonModule, NgStyle} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {WordService} from '../../auth/auth.service';
import {RouterLink} from '@angular/router';
import {SidebarComponent} from '../../shared/sidebar/sidebar.component';

export interface Word {
  id: number;
  word: string;
  translation: string;
  scrambledWord?: string; // Add scrambled version
}

@Component({
  selector: 'app-wordpuzzle',
  imports: [
    SidebarComponent, NgStyle, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './wordpuzzle.component.html',
  styleUrl: './wordpuzzle.component.css',
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class WordpuzzleComponent {
  private readonly MIN_WORD_LENGTH = 2;
  private readonly MAX_SHUFFLE_ATTEMPTS = 100;
  private readonly LENGTH_THRESHOLD = 4;

  words: Word[] = [];
  selectedWord: Word | null = null;
  userAnswer: string = '';
  correctWords: Word[] = [];
  resultMessage: string = '';

  constructor(private wordService: WordService) {
  }

  ngOnInit(): void {
    this.loadWords();
  }

  loadWords(): void {
    this.wordService.getWords().subscribe({
      next: (data) => {
        this.words = data.map(word => ({
          ...word,
          scrambledWord: word.word.length <= this.LENGTH_THRESHOLD ?
            this.shuffleComplete(word.word) :
            this.shuffleWithFixed(word.word)
        }));
      },
      error: (error) => {
        console.error('Error fetching words:', error);
      }
    });
  }

  private shuffleComplete(word: string): string {
    this.validateInput(word);
    const chars = Array.from(word);
    let shuffled: string;
    do {
      this.shuffle(chars);
      shuffled = chars.join('');
    } while (shuffled === word);
    return shuffled;
  }

  private shuffleWithFixed(word: string): string {
    this.validateInput(word);
    const fixedCount = this.calculateFixedPositions(word.length);
    const fixedPositions = this.selectFixedPositions(word.length, fixedCount);

    const original = Array.from(word);
    const shufflePositions = Array.from({length: word.length}, (_, i) => i)
      .filter(i => !fixedPositions.has(i));

    if (shufflePositions.length === 0) return word;

    let shuffled: string;
    let attempts = 0;
    do {
      this.shuffle(shufflePositions);
      const result = [...original];
      for (let i = 0; i < shufflePositions.length; i++) {
        result[shufflePositions[i]] = original[shufflePositions[(i + 1) % shufflePositions.length]];
      }
      shuffled = result.join('');
      attempts++;
    } while (shuffled === word && attempts < this.MAX_SHUFFLE_ATTEMPTS);

    return shuffled === word ? this.cyclicShift(word, shufflePositions) : shuffled;
  }

  private cyclicShift(word: string, positions: number[]): string {
    const result = Array.from(word);
    if (positions.length > 0) {
      const temp = result[positions[0]];
      for (let i = 0; i < positions.length - 1; i++) {
        result[positions[i]] = result[positions[i + 1]];
      }
      result[positions[positions.length - 1]] = temp;
    }
    return result.join('');
  }

  private validateInput(word: string): void {
    if (!word) throw new Error('Word cannot be null');
    if (word.length < this.MIN_WORD_LENGTH) {
      throw new Error(`Word must be at least ${this.MIN_WORD_LENGTH} characters long`);
    }
  }

  private calculateFixedPositions(length: number): number {
    return Math.max(1, Math.ceil(Math.sqrt(length)));
  }

  private selectFixedPositions(length: number, count: number): Set<number> {
    const positions = new Set<number>();
    while (positions.size < count) {
      positions.add(Math.floor(Math.random() * length));
    }
    return positions;
  }

  private shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Your existing methods
  selectWord(word: Word): void {
    this.selectedWord = word;
    this.userAnswer = '';
    this.resultMessage = '';
  }

  checkAnswer(): void {
    if (!this.selectedWord || !this.userAnswer.trim()) return;

    const normalizedUserAnswer = this.userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = this.selectedWord.word.toLowerCase().trim();

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      this.resultMessage = 'Correct !';
      if (!this.correctWords.some(w => w.word === this.selectedWord?.word)) {
        this.correctWords.push({...this.selectedWord});
        this.words = this.words.filter(word => word.word !== this.selectedWord?.word);
      }
      this.selectedWord = null;
    } else {
      this.resultMessage = 'Wrong !';
    }
    this.userAnswer = '';
  }
}
