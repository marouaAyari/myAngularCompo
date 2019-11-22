import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @Input() duree;
  @Output() upmessage :EventEmitter<any> = new EventEmitter();
  seconds = 59;
  stop = false;
  constructor() { }

  ngOnInit() {
    this.testInter();
  }
  testInter() {
    if (this.stop) return;
    const secondsCounter = interval(1000);
    const sub =secondsCounter.subscribe(n => {
      this.seconds -= 1;
    });
    setInterval(() => {
      this.seconds = 59;
      this.duree -= 1;
     if (this.duree == -1) {this.stop = true;
          sub.unsubscribe();
          this.upmessage.emit('done')
        return;
      };
      
    }, 60000);

  }
}
