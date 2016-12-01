import {Component} from "@angular/core";
import {NavParams, ViewController} from 'ionic-angular';
declare var BMap;
/**
 * Created by Administrator on 2016/11/29.
 */
@Component({
  templateUrl:'choice_destin.html'
})
export class choice_destin{
  private map:any;
  list:string[]=[];
  binding:string;
  constructor(params: NavParams,public viewCtrl:ViewController) {
    console.log('UserId', params.get('userId'));
    this.map = new BMap.Map();
  }
  dismiss( e:string ) {
    let myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(e, (point)=>{
      if (point) {
        console.log(point);
        let lng = point.lng;
        let lat = point.lat;
        this.viewCtrl.dismiss({lng,lat,e});
      }else{
        alert("您选择地址没有解析到结果!");
      }
    }, sessionStorage.getItem('my_position_city'));
  }
  find_destin(){
    let o:any[]=[];
    let options = {
      onSearchComplete: function(results){
        if (local.getStatus() == 0){
          // 判断状态是否正确
          for (var i = 0; i < results.getCurrentNumPois(); i ++){
            o.push(results.getPoi(i).title + ", " + results.getPoi(i).address);
          }
          console.log(o) ;
          display(o);
        }else{
          alert('没有找到')
        }
      }
    };
    //固定城市为南宁
    let local = new BMap.LocalSearch(this.map, options);
    let target_string:string = sessionStorage.getItem('my_position_province')+sessionStorage.getItem('my_position_city')+this.binding;
    local.search(target_string);
    let display= (e:any)=>{ this.list = e }
  }

}
