import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LayersApiService {

  // baseUrl : any = 'http://localhost:3000/'
  baseUrl = environment.apiUrl + 'collectingSpot';

  constructor(private http :HttpClient) { }

  // getlayersById():Observable<any>{
  //   return this.http.get(this.baseUrl+'api/collectingSpot/getRouteAndSpotByWard?wardId=19')
  // }

  getlayersById(data:any):Observable<any>{
    return this.http.get(this.baseUrl+`/getRouteAndSpotByWard?wardId=19&Lat=${data.lat}&Long=${data.long}`)
  }

  getlayerstable():Observable<any>{
    return this.http.get(this.baseUrl+'/getAllLayersTable')
  }

  getSpecificlayerstable(layer:string):Observable<any>{
    return this.http.get(this.baseUrl+'/getSpecificLayer?layerName='+layer)
  }

  insertLayer(layer:any):Observable<any>{
    return this.http.post(this.baseUrl+'/insertLayer',layer)
  }

  updatetLayer(layer:any):Observable<any>{
    return this.http.put(this.baseUrl+'/updateLayer',layer)
  }

  dbQuery(data:any):Observable<any>{
    return this.http.post(this.baseUrl+'/dbQuery',data)
  }

  rawdbQuery(data:any):Observable<any>{
    return this.http.post(this.baseUrl+'/rawQuery',data)
  }


  
}
