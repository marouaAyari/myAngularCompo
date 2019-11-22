import { NotificationType } from 'src/app/notification/notification-type';
import { SharedService } from './../../service/shared.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TodoListService } from './todolist.service';
import { notification } from 'src/app/notification/notifMessages';
export class List {
  text: string = '';
  editText: string = '';
  isOver: boolean = false;
  isEdit: boolean = false;
  idCreator: number = 0;
}
@Component({
  selector: 'du-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss'],
  providers: [TodoListService]
})

export class TodolistComponent implements OnInit {
  @Output() upmessage: EventEmitter<any> = new EventEmitter();
  todolist: Array<any> = [];
  newTaskText: string;
  idUser: number;
  isEditable = false;
  showUpdate: boolean = false;

  constructor(private todoListService: TodoListService, private sharedService: SharedService) { }

  ngOnInit() {
    this.idUser = JSON.parse(localStorage.getItem('currentUser')).id;
    this.todoListService.getTodoList(this.idUser).subscribe((elt) => {
      this.todolist = elt;
      if (elt.length != 0) {
        this.showUpdate = true;
      }
      this.todolist.forEach(item => {
        item.isOver = false;
        item.isEdit = false;
        item.editText = item.text;
      });
    });
  }

  edit(index) {
    if (!this.todolist[index].isOver) {
      this.todolist[index].editText = this.todolist[index].text;
      this.todolist[index].isEdit = true;
    }
  }

  overMatter(index) {
    if (!this.todolist[index].isEdit) {
      this.todolist[index].isOver = !this.todolist[index].isOver;
    }
  }

  enterTaskEdit(index) {
    this.todolist[index].text = this.todolist[index].editText;
    this.todolist[index].isEdit = false;
    var isNeditable = this.todolist.every((task) => { return task.isEdit == false });
    if (isNeditable)
      this.isEditable = false;
  }

  cancelTaskEdit(index,id) { 
    if(id==undefined)
    this.deleteTask(index)
    else
    this.sharedService.deleteOne('/api/Tasks/DeleteTask?id='+id).subscribe(()=>{
     this.deleteTask(index)
    },
      (err) => {
        this.upmessage.emit({ notifMsg: notification.failRequest, notifType:NotificationType.WARNING });
      });
  }

  deleteTask(index){
    this.todolist.splice(index, 1);
    var isNeditable = this.todolist.every((task) => { return task.isEdit == false });
    if (isNeditable) {
      this.isEditable = false;
      this.showUpdate = false
    }
  }
  enableEdit() {
    this.isEditable = !this.isEditable;
    this.todolist.forEach(item => {
      item.editText = item.text;
      item.isOver = false// this.isEditable;
      item.isEdit = this.isEditable;
    })
  }
  creatNewTask() {
    this.newTaskText = this.newTaskText.trim();
    if (this.newTaskText == '')
      return
    const newTask = new List;
    newTask.isEdit = false;
    newTask.isOver = false;
    newTask.text = this.newTaskText;
    newTask.idCreator = this.idUser;
    this.todolist.unshift(newTask);
    if (this.todolist.length != 0)
      this.showUpdate = true;
  }

  public save() {
    var prototype = new List();
    this.todolist.forEach((task) => {
      delete task.isEdit;
      Object.keys(task).forEach((attr: any) => {//remove uneeded proprties
        if (!prototype.hasOwnProperty(attr))
          delete task[attr];
      })
    });
    this.sharedService.post('/api/Tasks/saveTasks?id=' + this.idUser, this.todolist).subscribe((elt) => {
      this.upmessage.emit({ notifMsg: "Tasks ofyour Todo list are saved with success!", notifType:NotificationType.ACCEPT });
    },
      (err) => {
        this.upmessage.emit({ notifMsg: notification.failRequest, notifType:NotificationType.WARNING });
      });
  }
}

