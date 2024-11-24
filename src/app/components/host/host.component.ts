import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PeerService } from '../../services/peer.service';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('joinerVideo') joinerVideo!: ElementRef<HTMLVideoElement>;

  localStream: MediaStream | undefined;
  peerId: string | undefined;

  constructor(private peerService: PeerService) {}

  ngOnInit(): void {
    this.setupMedia();
  }

  /**
   * Sets up the media stream from the user's webcam and microphone.
   */
  setupMedia(): void {
    if (navigator?.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          this.localStream = stream;

          // Display local stream in the video element
          if (this.localVideo?.nativeElement) {
            this.localVideo.nativeElement.srcObject = stream;
          }

          this.setupPeer();
        })
        .catch((err) => {
          console.error('Error accessing media devices:', err);
        });
    } else {
      console.error('Media devices are not supported in this environment.');
    }
  }

  /**
   * Sets up the Peer-to-Peer connection using PeerService.
   */
  setupPeer(): void {
    const peer = this.peerService.createPeer('');
    this.peerService.onPeerOpen((id) => {
      this.peerId = id;
    });

    this.peerService.answerCall(this.localStream!);

    this.peerService.listenToStream((stream) => {
      if (this.joinerVideo?.nativeElement) {
        this.joinerVideo.nativeElement.srcObject = stream;
      }
    });
  }
}
