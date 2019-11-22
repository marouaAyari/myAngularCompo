import { UserService } from './../../service/user.service';
import { Component, ViewChild, Input, OnInit, OnDestroy, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as _ from 'lodash';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
var ELEMENT_DATA: PeriodicElement[] = [
];

/**
 * @title Table with filtering
 */
@Component({
  selector: 'app-aoso-table',
  templateUrl: './aoso-table.component.html',
  styleUrls: ['./aoso-table.component.scss']
})
export class AosoTableComponent implements OnInit, OnDestroy {
  @Input() data // =new MatTableDataSource<Utilisateur>()//{};
  @Input() options = {};
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Output() upmessage: EventEmitter<any> = new EventEmitter<any>();
  @Output() reload: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterData: EventEmitter<any> = new EventEmitter<any>();



  public displayedColumns: string[];
  public columns: Array<any> = [];
  public list = [];
  public filterList = ['basic Filter'];
  public filters = [];
  public hasFilter;
  public favouritePos = false;
  public listTokeep = [];
  public tableName = '';
  public Privilege = [];
  public givePrivilege: boolean = false;
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  public selected = -1
  protected modalRef //: BsModalRef = new BsModalRef();
  public filterInput = {};
  filterValue = '';
  filterName = '';
  public paginators = [7, 14];//dipsplay only21 row then reload

  constructor(private service: UserService) { }

  ngOnInit() { 
    this.columns = this.options['columns'];
    this.displayedColumns = this.columns.map(column => {
      if (column.name)
        return column.name
    });
    this.initData();
  }

  ngAfterViewInit() { 
    this.filterInput = this.options['filters']?this.options['filters']:{}
    this.hasFilter = this.options['hasFilter'];
    this.tableName = this.options['tableName'];
    this.givePrivilege = this.options['givePrivilege'] ? this.options['givePrivilege'] : false;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public initData() {
    let localData = this.data.map((raw) => {
      let localRaw = {}
      if (raw.id)
        localRaw['id'] = raw['id']
      // localData['id'] = raw.id;
      Object.keys(raw).forEach(prop => {
        if (this.columns.some((c) => {
          return c.name == prop
        }))
          localRaw[prop] = raw[prop]
        var localCol
        this.columns.filter((c) => {
          localCol = c
          return c.prop == prop
        }).forEach((myCol) => {
          if (raw[myCol['prop']])
            if (raw[myCol['prop']][myCol['propBefore']])
              localRaw[myCol.propToShow] =//this.fillFields (raw)//[prop]
                raw[myCol['prop']][myCol['propBefore']].map(f => {
                  return f[myCol['propAfter']];
                })
            else
              localRaw[myCol.propToShow] = raw[myCol['prop']][myCol['propToShow']]
        })
      }); return (localRaw)
    });
    this.dataSource.data = localData
    this.filterList = this.options['filterList'] ? this.options['filterList'] :
      this.dataSource.data.map((elt, i) => {
        this.dataSource.data["propBefore"] = this.list["propBefore"]
      })
    this.dataSource.data.map(((d, i) => {
      this.list[i] = this.fillFields(d, 'nom');// in  case needed
      return this.list
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  applyFilter(filterValue: string, filterName) {
    this.filterValue = filterValue;
    this.filterName = filterName;
    this.filterInput[filterName] = filterValue.trim().toLowerCase();
  }

  public postFilter(data) {
    return _.intersection(Object.keys(data), this.filterList)
  }

  public test(filterName, filter, data) {
    return this.list.filter((e => {
      return e[filterName] && e['nom'] ? e['nom'] == data['nom'] : false;
    })).some((d => {
      return (d[filterName]).includes(filter) // :false
    }))
  }

  public fillFields(elt, id?) {
    var localList = {};
    this.columns.forEach((col) => {
      if (col['propBefore'] && elt[col['prop']]) {
        localList[col['propBefore']] =
          elt[col['prop']][col['propBefore']].map(f => {
            return f[col['propAfter']];
          })
      }
    });
    if (id)
      localList[id] = elt[id];
    return localList;
  }

  public getDetails(rawData, index) {
    this.selected = index;
    if (this.options.hasOwnProperty('parent')) {
      if (this.options['parent'] == 'role') {
        this.upmessage.emit({ selected: rawData });
        return;
      } else if (this.options['parent'] == 'candidates') {
        let dataToSend = this.data.find((d) => {//data comming from bck
          return d.id == rawData.id;
        })
        this.upmessage.emit({
          basicData: dataToSend,
          customData: rawData
        });
      }
    }

  }

  checkCheckBoxvalue(evt, elt, prop) {
    var PrivilegeToSend = _.clone(this.dataSource.data);
    PrivilegeToSend.filter((d) => {
      return d.nom == elt.nom
    }).forEach(element => {
      element[prop] = evt.srcElement.checked;
    });
    this.Privilege = PrivilegeToSend;
  }

  submitChanges() {
    this.upmessage.emit(this.Privilege);
  }

  public onclick(evt, data, type,i) {
    this.upmessage.emit({ data: data, type: type, index:i });
  }

  checkDetails() {//todel
  }

  filter_ = (item) => {
    let arrIncludes = function (arr, tockeck) {
      if (Array.isArray(arr)) {
        if (arr != null && arr.length != 0) {
          return arr.some((elt) => {
            if (elt && typeof elt == 'string') {
              return elt.trim().toLocaleLowerCase().includes(tockeck.trim().toLocaleLowerCase());
            }
          })
        } else {
          if (tockeck.trim() == '') {
            return true;
          }
        }
      }
    }
    if (!Object.values(this.filterInput).every((e) => e == '')) {
      return item.data.filter((d) => {
        return Object.keys(this.filterInput).every((e) => {
          return typeof d[e] == 'string' ? d[e].trim().toLocaleLowerCase().includes(this.filterInput[e])
            : arrIncludes(d[e], this.filterInput[e])
        })
      })
    }
    return item//.data
  }

  ngOnDestroy() {
    this.filterInput = {};//reset filters
    // this.modalRef.close();
  }

  onPaginateChange(page) {
    let maxToreload = (page.pageIndex+2) * page.pageSize;
    if (maxToreload>=page.length)//l'avant derniere page=>reload
    {
      this.reload.emit({loaded:page.length})
    }
  }


  search_() {
    if(this.options['ComplexFilter'])
    {
      
    
    this.filterData.emit({ filterInput :this.filterInput})
    // var paramUrl = this.id + '&CityORState=' + this.searchValues['CityORState'] + '&Language=' + this.searchValues['Language'] + '&Experience=' + exp
    // this.sharedService.getAll('api/Utilisateurs/FilterPostedUser?id=' + paramUrl)// tofix
    //   .subscribe(
    //     (elt) => {
    //       this.filteredUsers = elt;
    //     },
    //     (err) => {
    //       this.dataEvtEmitter.emit({ notifMsg: "Oups! An Error Occured while sending your request.", notifType: NotificationType.FAIL });
    //     }
    //   )
      }
      else return;
  }
}
