import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'summaryNameForReport' }) // that pipe is a sample of using of pipes.
// it does not do anything for now
class summaryNameForReportpipe implements PipeTransform {
    transform(value: string): string {
        return value;
    }
}

@Pipe({ name: 'datePipe' })
class datePipe implements PipeTransform {
    transform(value: string): string {
        var touse = new Date(value);
        var day = touse.getDate();
        var month = touse.getMonth() + 1;
        var month_ = month < 10 ? "0" + month : month.toString();
        var day_ = day < 10 ? "0" + day : day.toString();
        return touse.getFullYear() + '-' + month_ + '-' + day_
    }
}

@Pipe({ name: 'boolPipe' })
class boolPipe implements PipeTransform {
    transform(value: any): boolean {
        return typeof value == "boolean" ? value : false;
    }
}

@Pipe({ name: 'btoa_' })
class btoa_ implements PipeTransform {
    transform(value: any):string {
        return btoa(value);
    }
}

@Pipe({ name: 'atob_' })
class atob_ implements PipeTransform {
    transform(value: any):string {
        return atob(value);
    }
}

@Pipe({ name: 'chiffreToNumb' })
class chiffreToNumb implements PipeTransform {
    transform(value: any): number {
        var value_ = value < 10 && value >= 0 ? "0" + value : value < 0 ? "00" : value.toString();
        return value_;
    }
}

@Pipe({ name: 'mayFilter' })
class mayFilter implements PipeTransform {
    transform(item, callbck: Function):any { 
        if (!item || !callbck)
            return item;
        return callbck(item);
    }

    

}
@Pipe({ name: 'getPath' })
class getPath implements PipeTransform {
    transform(item ):any { 
       return item 
    }
}
export {
    datePipe,
    boolPipe,
    chiffreToNumb,
    mayFilter,
    atob_,
    btoa_,
    getPath
}




