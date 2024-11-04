import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LayersApiService {

  // baseUrl : any = 'http://localhost:3000/'
  baseUrl :any = 'http://172.174.239.107:3000/'

  constructor(private http :HttpClient) { }

  // getlayersById():Observable<any>{
  //   return this.http.get(this.baseUrl+'api/collectingSpot/getRouteAndSpotByWard?wardId=19')
  // }

  getlayersById(data:any):Observable<any>{
    return this.http.get(this.baseUrl+`api/collectingSpot/getRouteAndSpotByWard?wardId=19&Lat=${data.lat}&Long=${data.long}`)
  }

  getlayerstable():Observable<any>{
    return this.http.get(this.baseUrl+'api/collectingSpot/getAllLayersTable')
  }

  getSpecificlayerstable(layer:string):Observable<any>{
    return this.http.get(this.baseUrl+'api/collectingSpot/getSpecificLayer?layerName='+layer)
  }

  insertLayer(layer:any):Observable<any>{
    return this.http.post(this.baseUrl+'api/collectingSpot/insertLayer',layer)
  }

  updatetLayer(layer:any):Observable<any>{
    return this.http.put(this.baseUrl+'api/collectingSpot/updateLayer',layer)
  }

  dbQuery(data:any):Observable<any>{
    return this.http.post(this.baseUrl+'api/collectingSpot/dbQuery',data)
  }

  rawdbQuery(data:any):Observable<any>{
    return this.http.post(this.baseUrl+'api/collectingSpot/rawQuery',data)
  }


  
}
