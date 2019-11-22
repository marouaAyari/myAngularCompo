import { NotificationType } from './../notification/notification-type';
import { Role } from './../models/role';
import { Utilisateur } from '../models/Model_User';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../service/user.service';
import { Subscription } from 'rxjs';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { notification } from '../notification/notifMessages';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {

  @Output() upmessage: EventEmitter<any> = new EventEmitter();
  public usersList;
  public toggle1 = false;
  public toggle2 = false;
  public toggle3 = false;
  public toggle4 = false;
  public seeUsers = false;
  public selectedRole = '';
  public enableEdition = false;
  public admin = false;
  public usersData = [];
  public ready = false;
  public columns: Array<any> = [
    { name: 'nbUsers', label: '#Users' },
    { name: 'nom', label: 'Role Name' },
    { name: 'createOffer', Type: 'checkbox', prop: 'privilege', propToShow: 'createOffer', label: 'Create Offer ' },
    { name: 'editOffer', Type: 'checkbox', prop: 'privilege', propToShow: 'editOffer', label: 'Edit Offer ' },
    { name: 'deleteOffer', Type: 'checkbox', propToShow: 'deleteOffer', prop: 'privilege', label: 'Delete Offer ' },
    { name: 'createUser', Type: 'checkbox', propToShow: 'createUser', prop: 'privilege', label: 'createUser ' },
    { name: 'editUser', Type: 'checkbox', propToShow: 'editUser', prop: 'privilege', label: 'Edit User ' },
    { name: 'consultUser', Type: 'checkbox', propToShow: 'consultUser', prop: 'privilege', label: 'Consult User ' },
    { name: 'deleteUser', Type: 'checkbox', propToShow: 'deleteUser', prop: 'privilege', label: 'Delte User ' },
    { name: 'accordPrivilege', Type: 'checkbox', propToShow: 'accordPrivilege', prop: 'privilege', label: 'accordPrivilege  ' },
    { name: 'noData', label: 'save', Type: 'button' },
    { name: 'noData_', label: 'delete', Type: 'button' },
  ];

  public usrList = [''];
  public roleList = [''];

  public roles = ['Recruiter', 'Talent_Sourcer', 'Hiring_Manager',
    'Interviewers', 'Recruiting_Coordinator',];
  public disableSave = false;
  public disableSaveRole = false;
  public disableSavePWD = false;
  public msg = '';
  public password = '';
  nwPassword = '';
  cNwPassword = '';
  public msgUsr = '';
  public tosendPWD = {
    id: '',
    MotDePasse: '',
    newMotDePasse: '',
    cNwPassword: '',
    basicUrl: ''
  };
  roleIsSet = false;
  msgRole = '';
  privilege
  sub: Subscription;
  role = '';
  duplicatedUser: string;
  duplicatedRole: string;
  allUsersWCurrent: Utilisateur[];
  refreshTable: boolean = false;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.role = JSON.parse(localStorage.getItem('userRole')).role;
    this.privilege = JSON.parse(localStorage.getItem('userRole')).privelege;
    this.admin = this.role.trim() == 'employer';
    this.disableSave = false;
    this.disableSaveRole = false;
    this.disableSavePWD = false;
    this.msg = '';
    this.msgRole = '';
    this.userService.getRoles('https://localhost:44371/api/Roles/getRoles')
      .subscribe((elt) => {
        this.roles = elt
        //this.setRoles(elt);
      },(err)=>{
        this.upmessage.emit({ notifMsg: notification.failGetRoles, notifType: NotificationType.WARNING });

      });
  }
  public onClick(ind, itemUpdated?) {
    if (itemUpdated) {
      this.userService.updateRole('/api/Utilisateurs/UpdateUserRole', itemUpdated.id, itemUpdated.roleDto.nom)
        .subscribe(() => {
          this.upmessage.emit({ notifMsg: notification.successUpdate, notifType: NotificationType.ACCEPT });
          this.SetPrivileges();
        },
          (err) => {
            this.upmessage.emit({ notifMsg: notification.failRequest, notifType: NotificationType.WARNING });
          }
        )
    }
    var current = this.usersList[ind].enableEdition;
    this.usersList[ind].enableEdition = !current;
  }

  public fillpriv(d) {
    this.roles.forEach((elt, ind) => {
      if (ind < d.length) {
        var toret = {
          nbUsers: d[ind]['nbUsers'],
          nom: elt,
          privilege: {
            'createOffer': d[ind]['fonction_'] ? d[ind]['fonction_']['createOffer'] : false,
            'editOffer': d[ind]['fonction_'] ? d[ind]['fonction_']['editOffer'] : false,
            'deleteOffer': d[ind]['fonction_'] ? d[ind]['fonction_']['deleteOffer'] : false,
            'editUser': d[ind]['fonction_'] ? d[ind]['fonction_']['editUser'] : false,
            'createUser': d[ind]['fonction_'] ? d[ind]['fonction_']['createUser'] : false,
            'consultUser': d[ind]['fonction_'] ? d[ind]['fonction_']['consultUser'] : false,
            'deleteUser': d[ind]['fonction_'] ? d[ind]['fonction_']['deleteUser'] : false,
            'accordPrivilege': d[ind]['fonction_'] ? d[ind]['fonction_']['accordPrivilege'] : false,
          }
        };
        this.usersData[ind] = toret;
      }
    });

    setTimeout(() => {
      this.ready = true;
    });
    this.ready = false;
  }
  public SetPrivileges(init?) {
    this.roleIsSet = true;
    if (init)
      this.seeUsers = false;
    this.userService.getRoles('https://localhost:44371/api/Roles/getRoles')
    .subscribe((elt) => {
      this.setRoles(elt);
      setTimeout(() => {
        this.fillpriv(elt);
      }, 10);
    },(err)=>{
      this.upmessage.emit({ notifMsg: notification.failGetRoles, notifType: NotificationType.WARNING });

    });
  }


  public setRoles(elt) {
    //this.setInitRole();
    var roles = [];
    elt.forEach((e) => {
      if (e.nom != null) {
        roles.push(e.nom);
      }
    });
    var commonRoles = this.roles.filter((localRole) => {
      return roles.find((BdRole) => {
        return BdRole == localRole;
      }) != undefined
    });
    // var missingRoles = this.roles.filter((e) => {// get the messing %local
    //   return commonRoles.indexOf(e) == -1
    // });
    // if (missingRoles.length > 0) {
    //   missingRoles.forEach((tosendtoDB) => {
    //     this.onUpmessage({ nom: tosendtoDB });//init case
    //   });
    // }
    this.roles = Array.from(new Set(roles.concat(this.roles)));
  }

  public refresh() {
    this.userService.getAll('/api/Utilisateurs/GetByRole' + '?role=' + this.selectedRole) //all users/role
      .subscribe((usrs) => {
        var id = JSON.parse(localStorage.getItem('currentUser')).id;
        this.usersList = usrs.filter((urs) => { return urs['id'] != id });
        this.seeUsers = true;
        this.usersList.forEach(element => {
          element["enableEdition"] = false;
        });
      })
  }

  onUpmessage(datamsg) {
    if (datamsg.selected) {//see users/role 
      this.selectedRole = datamsg.selected.nom;
      this.refresh();
      return;//tocheck

    }
    if (datamsg) {
      var elt = datamsg.data ? datamsg.data : datamsg;
      if (datamsg.type == 'save') {
        var privilegeTSend = {
          nom: elt.nom,
          privilege: {
            createOffer: elt.createOffer,
            editOffer: elt.editOffer,
            deleteOffer: elt.deleteOffer,
            editUser: elt.editUser,
            createUser: elt.createUser,
            consultUser: elt.consultUser,
            deleteUser: elt.deleteUser,
            accordPrivilege: elt.accordPrivilege
          }
        };
        this.userService.post('/api/Utilisateurs/rolePrivilege' + '?role=' + privilegeTSend.nom, privilegeTSend.privilege)
          .subscribe(() => {/*notif*/ });
      }
      else if (datamsg.type == 'delete') {
        this.seeUsers = false;
        if (datamsg.data.nbUsers != 0)
          this.upmessage.emit({ notifMsg: notification.failDeleteRole, notifType: NotificationType.FAIL });

        else {
          var ind = this.usersData.findIndex((e) => {
            return e.nom == datamsg.data.nom
          });
          this.refreshTable = true;
          this.usersData.splice(ind, 1);
          this.userService.delete('/api/Roles/DeleteRole' + '?roleName=' + elt.nom)
            .subscribe(() => {
              this.upmessage.emit({ notifMsg: notification.successDelete, notifType: NotificationType.ACCEPT });
            },
              (err) => {
                this.upmessage.emit({ notifMsg: notification.failRequest, notifType: NotificationType.WARNING });
              }
            );
        }
      }

    }
  }
  public addUsr() {
    this.usrList.push('');
  }
  public addRole() {
    this.roleList.push('');
    this.ready = false;
  }

  saveUsers(users) {
    this.userService.post('/api/Utilisateurs/CreateListUsers', users)
      .subscribe((d) => {
        this.msgUsr = notification.successCreation;
        this.upmessage.emit({ notifMsg: notification.successCreation, notifType: NotificationType.ACCEPT });
      },
        (err) => {
          this.upmessage.emit({ notifMsg: notification.failRequest, notifType: NotificationType.WARNING });
        }
      );
  }
  noOldDuplicatedUsers(newUsers) {
    this.userService.getAll('/api/Utilisateurs/GetAll'/*+'?loaded=0'*/)
      .subscribe((data) => {
        this.allUsersWCurrent = data;
        this.duplicatedUser = '';
        var existingDuplicatedUsrs = this.validation(newUsers, 'mail', 'Mail');
        if (existingDuplicatedUsrs) {
          this.upmessage.emit({ notifMsg: this.duplicatedUser + notification.failDuplicatedMail, notifType: NotificationType.FAIL });
        }
        else {
          this.saveUsers(newUsers)
        }
      });
  }
  onsubmit(form) {
    var users = Object.values(form.value).map((elt) => {
      var userTosend = new Utilisateur();
      userTosend.MotDePasse = elt['password'];
      userTosend.Mail = elt['mail'];
      userTosend.roleDto = elt['role']
      return userTosend;
    });

    this.disableSave = this.validation(Object.values(form.value), 'mail');
    if (this.disableSave) {
      this.upmessage.emit({ notifMsg: notification.failDuplicate, notifType: NotificationType.FAIL });
      return;
    }
    else {
      this.noOldDuplicatedUsers(users);
    }
  }

  public validation(list, toCheck, toCheck2?) {
    var listToCheck = [];//current added list 

    if (toCheck2) {//here emailcheck 
      listToCheck = list.map((elt) => {
        return elt[toCheck] || elt[toCheck2];
      });
      var listToCheckDB = this.allUsersWCurrent.map((elt) => {
        return elt[toCheck] || elt[toCheck2];
      });
      this.duplicatedUser = this.validationMailDB(listToCheckDB, listToCheck)
      if (this.duplicatedUser != undefined && this.duplicatedUser != '')
        return true;
      else return false
    } else {
      listToCheck = list.map((elt) => {
        return elt[toCheck];
      });
    };
    const uniq = new Set(listToCheck);
    const backtoList = Array.from(uniq);
    if (backtoList.length != listToCheck.length) {

      return true;
    }
    if (toCheck == 'Nom')//role
      if (this.validationRoleDB(listToCheck) != undefined) {
        this.duplicatedRole = this.validationRoleDB(listToCheck);
        return true
      }
    return false;
  }

  validationRoleDB(listToCheck) {//no duplicatedin bd
    return this.roles.find((elt) => {
      return listToCheck.some((e) => {
        return e == elt;
      })
    })
  }
  validationMailDB(listToCheckBD, listToCheck) {//no duplicatedin bd
    return listToCheckBD.find((elt) => {
      return listToCheck.some((e) => {
        return e == elt;
      })
    })
  }

  public remove(indRow) {
    this.usrList.splice(indRow, 1);
    this.disableSave = false;
    this.msgUsr = '';
  }

  public removeRole(indRow) {
    this.roleList.splice(indRow, 1);
    this.disableSaveRole = false;
    this.msgRole = '';
  }

  public onChange(evt) {
    this.disableSave = false;
    this.msgUsr = '';
  }
  public onChangeRole(evt) {
    this.disableSaveRole = false;
    this.msgRole = '';
  }
  public onChangePWD(evt) {
    this.disableSavePWD = false;
    this.msg = '';
  }
  onSubmitRole(formRole) {
    this.duplicatedRole = '';
    this.disableSaveRole = this.validation(Object.values(formRole.value), 'Nom');
    var roles = Object.values(formRole.value).map((elt) => {
      let role = new Role();
      role.Description = elt['Description'];
      role.Nom = elt['Nom'];
      return role;
    });
    if (this.disableSaveRole) {
      if (this.duplicatedRole != undefined && this.duplicatedRole != '')
        this.upmessage.emit({ notifMsg: this.duplicatedRole + notification.failDuplicatedBD, notifType: NotificationType.FAIL });
      else
        this.upmessage.emit({ notifMsg: notification.failDuplicate, notifType: NotificationType.FAIL });
      return;
    } else {
      this.userService.post('/api/Roles/CreateRoles', roles)
        .subscribe((d) => {
          this.setInitRole();
          this.msgRole = notification.successCreation;
          this.upmessage.emit({ notifMsg: notification.successCreation, notifType: NotificationType.ACCEPT });

        },
          (err) => {
            this.upmessage.emit({ notifMsg: notification.failRequest, notifType: NotificationType.WARNING });
          }
        );
    }
  }

  onsubmitPWD(form) {
    if (form.value.newMotDePasse != form.value.cNwPassword) {
      this.disableSavePWD = true;
      this.msg = 'please Confirm your password.';
      this.upmessage.emit({ notifType: NotificationType.FAIL, notifMsg: notification.failConfirmation }); // dought this one
      return;
    }
    this.tosendPWD.MotDePasse = form.value.MotDePasse;
    this.tosendPWD.newMotDePasse = form.value.newMotDePasse;
    this.tosendPWD.basicUrl = location.origin + '/Login';

    // this.tosendPWD.confirmPwd = form.value.cNwPassword;
    this.tosendPWD.id = JSON.parse(localStorage.getItem('currentUser')).id;
    this.userService.post('/api/Utilisateurs/ChangePwd', this.tosendPWD)
      .subscribe(
        (d) => {
          if (d == 'updated pwd') {
            this.msg = notification.successUpdate;
            this.upmessage.emit({ notifMsg: notification.successUpdate, notifType: NotificationType.ACCEPT });
            this.disableSavePWD = false;
          }
          else if (d == 'wrong pwd') {
            this.msg = 'Please check your old password !';
            this.upmessage.emit({ notifMsg: notification.failWrongPwd, notifType: NotificationType.FAIL });
            this.disableSavePWD = true;
          }
        },
        (err) => {
          this.upmessage.emit({ notifMsg: notification.failRequest, notifType: NotificationType.WARNING });
        }
      );

  }

  reset() {
    this.tosendPWD.MotDePasse = '';
    this.tosendPWD.newMotDePasse = '';
    this.tosendPWD.cNwPassword = '';
  }

  setInitRole() {//TOCHECK when clicking on add user before priv
    if (this.roleIsSet) {
      this.userService.getRoles('https://localhost:44371/api/Roles/getRoles')
        .subscribe((elt) => {
          elt.forEach((e) => {
            if (e.nom != null) {
              this.roles.push(e);
            }
          });
        },(err)=>{
        this.upmessage.emit({ notifMsg: notification.failGetRoles, notifType: NotificationType.WARNING });

      });
    }
  }

  toggle(val) {
    if (val == 1)
      this.toggle1 = !this.toggle1;
    else if (val == 2)
      this.toggle2 = !this.toggle2;
    else if (val == 3)
      this.toggle3 = !this.toggle3;
    else
      this.toggle4 = !this.toggle4;
  }

  reloadTable() {
    this.refreshTable = false;
    this.seeUsers = false;
    this.ready = false;
    setTimeout(() => {
      this.ready = true;
    }, 100);
  }
}

