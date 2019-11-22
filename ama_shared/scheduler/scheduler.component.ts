import { FormatService } from './../../service/format.service';
import { UserService } from './../../service/user.service';
import { Component, OnInit, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatCalendarCellCssClasses, MatCalendar, MatDatepickerInputEvent } from '@angular/material';
import { EditEventComponent } from '../../edit-event/edit-event.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NotificationType } from 'src/app/notification/notification-type';
import { notification } from 'src/app/notification/notifMessages';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SchedulerComponent implements OnInit {
  @ViewChild(MatCalendar, { static: false }) calendar: MatCalendar<Date>;
  @Output() upmessage: EventEmitter<any> = new EventEmitter();

  public enableEdit = false;
  public selectedDate: Date
  public appointementDates = [];// need to be full date 
  appointementDetails = [];
  currentAppointments = []
  public ready = false;
  constructor(private userService: UserService, private formatService: FormatService) { }

  ngOnInit() {
    this.getallAppointment();
  }

  selectedChange(evt) {
    setTimeout(() => {
      this.enableEdit = true;
    }, 10);
    this.enableEdit = false;
    this.selectedDate = new Date(evt);
    this.currentAppointments = this.appointementDetails.filter((elt) => {
      return this.formatService.formatDate(elt.startDate) == this.formatService.formatDate(this.selectedDate)
    });
  }

  dateClass = (d: Date) => {
    //  const date = d.getDate();
    return this.appointementDates.indexOf(this.formatService.formatDate(d)) != -1
      ? 'example-custom-date-class' : undefined;
  }

  onUpMessage(event) {
    if (event.evt.cancel) {
      this.enableEdit = false;
      return;
    }
    var currentpointment = _.clone(this.appointementDates); //TOREM
    //this.ready = false
    if (event.evt.save) {
      if (!this.validate(event.data.startTime, event.data.endTime, this.currentAppointments)) {
        this.appointementDates.push(this.formatService.formatDate(this.selectedDate));
        this.userService.post('/api/Appointements/saveAppointment', event.data).subscribe(() => {
          this.appointementDetails.push(event.data);
          this.currentAppointments.push(event.data);
          this.upmessage.emit({ notifMsg:notification.successCreation, notifType:NotificationType.ACCEPT });
          this.refresh();
        },
          (err) => {
            this.upmessage.emit({ notifMsg: notification.failRequest, notifType:NotificationType.WARNING });
          });
      }
      else
        this.upmessage.emit({ notifMsg: notification.failUnvalidTime, notifType: NotificationType.FAIL });
    }
    else {
      var eltTodel = this.appointementDetails.findIndex(elt => {
        return elt.id == event.data.id
      })
      this.userService.delete('/api/Appointements/deleteAppointment?id=' + event.data.id).subscribe(() => {
        this.appointementDetails.splice(eltTodel, 1);
        var todelDate = this.appointementDates.indexOf(this.formatService.formatDate(this.selectedDate))
        this.appointementDates.splice(todelDate, 1);
        this.upmessage.emit({ notifMsg: notification.successDelete, notifType:NotificationType.ACCEPT });
        this.refresh();
      },
        (err) => {
          this.upmessage.emit({ notifMsg: notification.failRequest, notifType:NotificationType.WARNING });
        });

    }
  }
  public refresh() {
    this.enableEdit = false;
    setTimeout(() => {
      this.ready = true
    }, 50);
    this.ready = false
  }
  public close() {
    this.enableEdit = false;
  }
  public getallAppointment() {
    const id = JSON.parse(localStorage.getItem('currentUser')).id;
    this.userService.getAll('/api/Appointements/getallAppointment' + '?id=' + id) //all appointent of the current usr
      .subscribe((app) => {
        if (app) {
          this.appointementDetails = app; 
          app.forEach((a) => {
            if (a['startDate'] != null)
              this.appointementDates.push(this.formatService.formatDate(new Date(a['startDate'])));
          })
        }
        setTimeout(() => {
          this.ready = true;
        }, 100);
      })
  }
  public validate(start, end, list) {
    var startTime = moment(start, "HH:mm");
    var endTime = moment(end, "HH:mm");
    return list.some(elt => {
      return startTime.isBetween(moment(elt.startTime, "HH:mm"), moment(elt.endTime, "HH:mm"))
        || startTime.isSame(moment(elt.startTime, "HH:mm"));
    }) || endTime.isBefore(startTime);

  }
}
