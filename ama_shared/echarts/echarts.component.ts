import { Component } from '@angular/core';
import { ChartsService } from './charts.service';

@Component({
  selector: 'app-echarts',
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.scss'],

})
export class EChartsComponent {
  showloading: boolean = false;
  BarOption;
  LineOption;
  PieOption;
  AnimationBarOption;

  constructor(private chartsService: ChartsService) {
    this.BarOption = this.chartsService.getBarOption();
    this.LineOption = this.chartsService.getLineOption();
    this.PieOption = this.chartsService.getPieOption();
    this.AnimationBarOption = this.chartsService.getAnimationBarOption();
  }

  onChartClick(evt) {
  }
}
