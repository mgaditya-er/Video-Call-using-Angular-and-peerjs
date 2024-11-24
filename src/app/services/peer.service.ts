import { Injectable } from '@angular/core';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root',
})
export class PeerService {
  private peer: Peer | undefined;
  private currentCall: any;

  constructor() {}

  createPeer(userId: string): Peer {
    this.peer = new Peer(userId, { debug: 2 });
    return this.peer;
  }

  connectToPeer(peerId: string): any {
    return this.peer?.connect(peerId);
  }

  call(peerId: string, stream: MediaStream): any {
    this.currentCall = this.peer?.call(peerId, stream);
    return this.currentCall;
  }

  answerCall(stream: MediaStream): void {
    this.peer?.on('call', (call) => {
      call.answer(stream);
      this.currentCall = call;
    });
  }

  listenToStream(callback: (stream: MediaStream) => void): void {
    this.currentCall?.on('stream', callback);
  }

  onPeerOpen(callback: (id: string) => void): void {
    this.peer?.on('open', callback);
  }

  onPeerError(callback: (err: any) => void): void {
    this.peer?.on('error', callback);
  }
}
