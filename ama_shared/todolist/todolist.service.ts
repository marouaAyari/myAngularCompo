import { SharedService } from './../../service/shared.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TodoListService {
  constructor(private sharedService: SharedService) { }

  getTodoList(id) {
    return this.sharedService.getAll('/api/Tasks/getallTask?id=' + id)
  }

}
