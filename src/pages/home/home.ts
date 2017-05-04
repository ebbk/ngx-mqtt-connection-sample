import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MqttService } from 'ngx-mqtt'
import { Observable } from "rxjs/Rx";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    lastSentMessage: string;
    lastMessage: string;
    ticks: number;

  constructor(public navCtrl: NavController, public _mqttService: MqttService) {
    _mqttService.onConnect.subscribe((e) => {
      console.log('onConnect', e);
    });
    _mqttService.onError.subscribe((e) => {
      console.log('onError', e);
    });
    _mqttService.onClose.subscribe(() => {
      console.log('onClose');
    });
    _mqttService.onReconnect.subscribe(() => {
      console.log('onReconnect');
    });
    _mqttService.onMessage.subscribe((e) => {
      console.log('onMessage', e);
    });
    _mqttService.connect();
    _mqttService.observe('#').subscribe((msg) => {
      console.log(msg.payload.toString());
      this.lastMessage = msg.payload.toString(); 
    });
  }

  ngOnInit() {
    console.log('starting timer')
    let timer = Observable.timer(0, 1000);
    timer.subscribe(t => {
      this.publish(t);
      this.ticks = t; 
    });
  }

  connect() {
    this._mqttService.connect();
  }
  disconnect() {
    this._mqttService.disconnect();
  }

  publish(t) {
    if(this._mqttService.state.getValue() == 2) {
      this.lastSentMessage = 'message ' + t + ' at ' + new Date().toTimeString();
      this._mqttService.unsafePublish('testtopic', this.lastSentMessage);
    }

  }
}
