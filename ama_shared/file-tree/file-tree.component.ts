import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { collapse } from '../../animation/collapse-animate';

@Component({
  selector: 'file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.scss'],
  animations: [collapse]
})
export class FileTreeComponent implements OnInit {
  @Input() model: any;
  @Input() isChild: boolean;
  @Output() upmessage: EventEmitter<any> = new EventEmitter();
  alreadySent: boolean = false;
  constructor() { }

  ngOnInit() {
    if (this.model)
      this.model.forEach(element => {
        element.isSelect ? element.toggle = 'on' : element.toggle = 'init';
      });
  }

  private toggleItem(item) {
    item.toggle === 'on' ? item.toggle = 'off' : item.toggle = 'on';
  }

  private onClick(item) {
    if (item.alreadySent) {
      this.alreadySent = true;
      return;
    }
    if (!item.children) {
      this.alreadySent = false;
      this.upmessage.emit(item)
    }
  }
}

