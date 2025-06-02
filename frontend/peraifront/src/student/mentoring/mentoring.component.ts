import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as marked from 'marked';

interface Message {
  text: string | SafeHtml;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
}

interface MentoringRequest {
  message: string;
}

interface MentoringResponse {
  corrected: string;
}

@Component({
  selector: 'app-mentoring',
  templateUrl: './mentoring.component.html',
  standalone: true,
  imports: [
    SidebarComponent,
    DatePipe,
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./mentoring.component.scss'] // Kept .scss
})
export class MentoringComponent implements OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  messages: Message[] = [];
  currentMessage = '';
  isLoading = false;
  userInitials = 'U'; // Default initials

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // Initial system message
    this.messages.push({
      text: 'Hello! What sentences would you like me to correct today ?',
      sender: 'bot',
      timestamp: new Date()
    });
  }

  // Send message to backend API
  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading) {
      return;
    }

    const userMessage = this.currentMessage.trim();
    this.messages.push({
      text: this.sanitizeMessage(userMessage), // User message sanitized
      sender: 'user',
      timestamp: new Date()
    });

    this.currentMessage = '';
    this.resetTextareaHeight(); // Reset textarea height after sending
    setTimeout(() => {
      if (this.messageInput && this.messageInput.nativeElement) {
        this.messageInput.nativeElement.focus();
      }
    });

    this.isLoading = true;
    this.scrollToBottom(); // Scroll after user message is added

    const request: MentoringRequest = { message: userMessage };

    this.http.post<MentoringResponse>('http://localhost:8080/api/v1/ai/chat', request)
      .subscribe({
        next: (response) => {
          this.messages.push({
            text: this.processMarkdown(response.corrected), // Bot response processed as Markdown
            sender: 'bot',
            timestamp: new Date()
          });
          this.isLoading = false;
          setTimeout(() => this.scrollToBottom()); // Scroll after bot response
        },
        error: (error) => {
          console.error('Error getting mentoring response:', error);
          this.messages.push({
            text: 'Sorry, I encountered an error. Please try again later.',
            sender: 'system',
            timestamp: new Date()
          });
          this.isLoading = false;
          setTimeout(() => this.scrollToBottom()); // Scroll after error
        }
      });
  }

  // Handle Enter key to send message (with Shift+Enter for new line)
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  // Auto-resize textarea based on content
  onTextareaInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    // Optional: if you want to apply a max height like in the example:
    // const maxHeight = 150; // example max height in px
    // textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }

  // Reset textarea height (e.g., after sending a message)
  private resetTextareaHeight(): void {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.style.height = 'auto'; // Resets to default or content-based height
    }
  }

  // Markdown içeriğini HTML'e dönüştür ve güvenli bir şekilde döndür
  private processMarkdown(content: string): SafeHtml {
    try {
      const htmlContent = marked.parse(content);
      if (htmlContent instanceof Promise) {
        console.warn('Marked returned a Promise, using fallback');
        return this.sanitizer.bypassSecurityTrustHtml(content);
      }
      return this.sanitizer.bypassSecurityTrustHtml(htmlContent as string);
    } catch (error) {
      console.error('Error processing markdown:', error);
      return this.sanitizer.bypassSecurityTrustHtml(content);
    }
  }

  // Kullanıcı mesajlarını güvenli bir şekilde formatla
  private sanitizeMessage(message: string): SafeHtml {
    // Convert URLs to links - fixed href to include the actual URL
    const withLinks = message.replace(
      /(https?:\/\/\S+)/g,
      '<a href="" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    // Convert line breaks to <br> tags
    const withLineBreaks = withLinks.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(withLineBreaks);
  }

  // Scroll chat container to bottom
  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.chatContainer && this.chatContainer.nativeElement) {
          this.chatContainer.nativeElement.scrollTop =
            this.chatContainer.nativeElement.scrollHeight;
        }
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    });
  }
}
