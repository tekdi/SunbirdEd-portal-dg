import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResourceService } from '@sunbird/shared';
import * as _ from "lodash-es";
@Component({
  selector: 'app-sb-bignumber',
  templateUrl: './sb-bignumber.component.html',
  styleUrls: ['./sb-bignumber.component.scss']
})
export class SbBignumberComponent implements OnInit, OnChanges {
  @Input() chart;
  @Input() lastUpdatedOn;
  @Input() hideElements = false;
  @Input() globalDistrict;
  @Input() globalOrg;  
  chartData;
  chartConfig;
  updatedData;
  globalChange:boolean;
  globalData;
  @ViewChild('outlet', { read: ViewContainerRef }) outletRef: ViewContainerRef;
  @ViewChild('content', { read: TemplateRef }) contentRef: TemplateRef<any>;
  constructor(
    public resourceService: ResourceService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(){
    this.updatedData = this.chartData = _.compact(this.chart.chartData);
    this.chartConfig = this.chart.chartConfig;
  }

  ngOnChanges(_changes: SimpleChanges): void {
   this.checkForGlobalChanges();
  }

  checkForGlobalChanges(){
    if(this.globalDistrict !== undefined || this.globalOrg !== undefined){
      this.globalData = _.filter(this.chartData,(bigData)=>{
        if(this.globalDistrict && this.globalOrg){
          return bigData?.district_externalId == this.globalDistrict && bigData?.organisation_id == this.globalOrg;
        }else if(this.globalDistrict){
          return  bigData?.district_externalId == this.globalDistrict;
         }else if(this.globalOrg){
          return bigData?.organisation_id == this.globalOrg
         }else{
           return bigData;
         };
    });
    this.globalChange = true;
    this.updatedData = this.globalData;
    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.contentRef);
    }else{
      this.globalData = this.chartData;
      this.globalChange = false;

    }
  }
}
