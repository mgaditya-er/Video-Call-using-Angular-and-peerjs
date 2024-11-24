import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PeerService } from '../../services/peer.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-joiner',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './joiner.component.html',
  styleUrls: ['./joiner.component.css'],
})
export class JoinerComponent implements OnInit {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  localStream: MediaStream | undefined;
  remoteStream: MediaStream | undefined;
  hostCode: string = '';

  constructor(private peerService: PeerService) {}

  ngOnInit(): void {
    this.setupMedia();
  }

  /**
   * Initializes the local media stream (camera and microphone).
   */
  setupMedia(): void {
    if (navigator?.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.localStream = stream;

          // Display local stream in video element
          if (this.localVideo?.nativeElement) {
            this.localVideo.nativeElement.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error('Error accessing media devices:', err);
        });
    } else {
      console.error('Media devices are not supported in this environment.');
    }
  }

  /**
   * Connects to the host peer using the provided host code and starts streaming.
   */
  connectToHost(): void {
    if (!this.hostCode) {
      console.warn('Host code is required to connect.');
      return;
    }

    const conn = this.peerService.connectToPeer(this.hostCode);

    conn.on('open', () => {
      console.log('Connection established with host:', this.hostCode);

      // Call the host and set up remote video stream
      this.peerService.call(this.hostCode, this.localStream!).on('stream', (stream: MediaStream) => {
        this.remoteStream = stream;

        // Display remote stream in video element
        if (this.remoteVideo?.nativeElement) {
          this.remoteVideo.nativeElement.srcObject = stream;
        }
      });
    });

    conn.on('error', (err: any) => {
      console.error('Error connecting to host:', err);
    });
  }
}
