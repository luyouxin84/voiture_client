import { Component , ViewChild, ElementRef,OnInit} from '@angular/core';
import { NavController,AlertController,ModalController } from 'ionic-angular';
import {choice_destin} from "../choice_destin/choice_destin";
import {point} from "./point";
declare var BMap;

@Component({
    templateUrl:'index.html'

})
export class index implements OnInit{
  public marker:any;
  public _map:any;
  @ViewChild('container') mapElement: ElementRef;
  container: any;
  debut_point:point;
  destin_point:point;
  constructor(private navCtrl: NavController,private alertCtrl:AlertController,private modalC:ModalController) {

  }

  ngOnInit() {
    this.loadMap();
  }
  creat_destinate =()=>{
      let profileModal = this.modalC.create(choice_destin, { userId: 8675309 });
      profileModal.onDidDismiss( data => {
        console.log(data.lng,data.lat,data.e);
        if ( data != undefined ){
          document.getElementById('destin').innerText = data.e;
          sessionStorage.setItem('destin_lng',data.lng);
          sessionStorage.setItem('destin_lat',data.lat);
        }
      });
      profileModal.present();
  }

  loadMap() {
    // 创建地图实例,并以浏览器定位位置为中心
    var map = new BMap.Map(this.mapElement.nativeElement);
    this._map = map;
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
      if(this.getStatus() == 0){
        let mk = new BMap.Marker(r.point);
        map.addOverlay(mk);
        console.log('您的位置：'+ r.point.lng+','+ r.point.lat);
        sessionStorage.setItem('my_positon_lng',r.point.lng);
        sessionStorage.setItem('my_positon_lat',r.point.lat);
        let point = new BMap.Point(sessionStorage.getItem('my_positon_lng'), sessionStorage.getItem('my_positon_lat'));  // 创建点坐标
        map.centerAndZoom(point, 15);
        let geoc = new BMap.Geocoder();
        geoc.getLocation(point, function(rs){
          console.log(rs.addressComponents);
          sessionStorage.setItem('my_position_province',rs.addressComponents.province) ;
          sessionStorage.setItem('my_position_city',rs.addressComponents.city) ;
        });
      }
      else {
        alert('failed'+this.getStatus());
      }
    },{enableHighAccuracy: true});
    this.debut_point = new point(sessionStorage.getItem('my_positon_lng'),sessionStorage.getItem('my_positon_lat'));

    //添加缩放控件
//     对应0-3
//     BMAP_ANCHOR_TOP_LEFT 表示控件定位于地图的左上角。
//     BMAP_ANCHOR_TOP_RIGHT 表示控件定位于地图的右上角。
//     BMAP_ANCHOR_BOTTOM_LEFT 表示控件定位于地图的左下角。
//     BMAP_ANCHOR_BOTTOM_RIGHT 表示控件定位于地图的右下角。
    let opts = {anchor: 1};
    map.addControl(new BMap.NavigationControl(opts));
    //地图中心点变更
    map.addEventListener("dragend", ()=>{
      var center = map.getCenter();
      map.removeOverlay(this.marker);
      console.log("地图中心点变更为：" + center.lng + ", " + center.lat);
      let point = new BMap.Point(center.lng, center.lat);
      this.debut_point.lng = center.lng;
      this.debut_point.lat = center.lat;
      console.log(this.debut_point);
      map.centerAndZoom(point);
      // let myIcon = new BMap.Icon('http://api0.map.bdimg.com/images/marker_red_sprite.png',new BMap.Size(117,75),{
      //       imageOffset: new BMap.Size(49,13)
      //     });
      // this.marker = new BMap.Marker(point,{ icon:myIcon });        // 创建标注
      // map.addOverlay(this.marker);                     // 将标注添加到地图中
      let myGeo = new BMap.Geocoder();
      myGeo.getLocation(point, function(result){
        if (result){
          console.log(result.address);
          document.getElementById('debut').innerText = result.address;
          sessionStorage.setItem('debut_choised',result.address);
        }
      });
    });
    //点击地图获取位置坐标信息,手机上难以实现点击和移动地图区分。。。
    // map.addEventListener("click", function(e){
    //   map.removeOverlay(this.marker);
    //   let click_point = new BMap.Point(e.point.lng, e.point.lat);
    //   let myIcon = new BMap.Icon('http://api0.map.bdimg.com/images/marker_red_sprite.png',new BMap.Size(117,75),{
    //     imageOffset: new BMap.Size(49,13)
    //   });
    //   this.marker = new BMap.Marker(click_point,{ icon:myIcon });        // 创建标注
    //   map.addOverlay(this.marker);                     // 将标注添加到地图中
    //   console.log("点击坐标" + e.point.lng + ", " + e.point.lat);
    // // 根据坐标得到地址描述
    //   let myGeo = new BMap.Geocoder();
    //   myGeo.getLocation(click_point, function(result){
    //     if (result){
    //       console.log(result.address);
    //       document.getElementById('debut').innerText = result.address;
    //       sessionStorage.setItem('debut_choised',result.address);
    //     }
    //   });
    // });
  }
  order_now(){
    if ( sessionStorage.getItem('debut_choised') != null && sessionStorage.getItem('destin_choised') != null){
        this._map.clearOverlays();
        this.search(sessionStorage.getItem('debut_choised'),sessionStorage.getItem('destin_choised'),0);
    }else{
      alert('请完成出发地和目的地！');
    }
  }
  search(start,end,route){
    var output = "驾车需要";
    var searchComplete = function (results){
      if (transit.getStatus() != 0){
        alert('获取路线失败');
        return ;
      }
      var plan = results.getPlan(0);
      output += plan.getDuration(true) + "\n";                //获取时间
      output += "总路程为：" ;
      output += plan.getDistance(true) + "\n";             //获取距离
    }

    var transit = new BMap.DrivingRoute(this._map, {renderOptions: {map: this._map},
      onSearchComplete: searchComplete,
      onPolylinesSet: function(){
        setTimeout(function(){console.log(output)},"1000");
      },policy:'BMAP_DRIVING_POLICY_LEAST_TIME'});
    let p1 = new BMap.Point(this.debut_point.lng,this.debut_point.lat);
    let p2 = new BMap.Point(sessionStorage.getItem('destin_lng'),sessionStorage.getItem('destin_lat'));
    transit.search(p1, p2);
  }
}
