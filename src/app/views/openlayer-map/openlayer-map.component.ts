import { Component, Input, Injectable, ViewChild, ChangeDetectorRef, AfterViewInit, OnInit } from '@angular/core';
import Map from 'ol/Map';

import { fromLonLat, toLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Circle, LineString, Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import { LayersApiService } from 'src/app/Services/layers-services/layers-api.service';
import { ButtonDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, OffcanvasBodyComponent, OffcanvasComponent, OffcanvasHeaderComponent, OffcanvasModule, SpinnerComponent, OffcanvasService, OffcanvasToggleDirective } from '@coreui/angular';
import { Coordinate } from 'ol/coordinate';
import { FullScreen, defaults as defaultControls } from 'ol/control.js';
import Stroke from 'ol/style/Stroke';
import { drawMultiStringline, drawPointsOnMap, drawPolygoneLine } from './EventListener'
import { DrawingToolComponent } from '../drawing-tool/drawing-tool.component'
import { PrintControl } from '../Controller/exportController'
import { MapServiceService } from '../../Services/mapService/map-service.service'
import { Fill, Text } from 'ol/style';
import { CommonModule } from '@angular/common';;
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { FormModule } from '@coreui/angular';
import { LayerQueryComponent } from '../layer-query/layer-query.component'
import { FormsModule } from '@angular/forms';

import { click } from 'ol/events/condition';
import { Select } from 'ol/interaction';
import CircleStyle from 'ol/style/Circle';
import { ExportService } from 'src/app/Services/Export-service/export.service';

interface RemainingProps {
  [key: string]: string; // Define key-value pairs where keys are strings and values are strings
}

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-openlayer-map',
  standalone: true,
  imports: [OffcanvasModule, OffcanvasComponent, OffcanvasBodyComponent,
    OffcanvasHeaderComponent, SpinnerComponent, LayerQueryComponent,
    FormModule, CommonModule, ButtonDirective, DrawingToolComponent,
    ModalComponent, ModalHeaderComponent, ModalTitleDirective,
    ModalBodyComponent, ModalFooterComponent, FormsModule],
  templateUrl: './openlayer-map.component.html',
  styleUrl: './openlayer-map.component.scss'
})
export class OpenlayerMapComponent implements OnInit, AfterViewInit {

  @Input() selectedValue: string | null = null;

  formData: any = {};
  isLoading: boolean = false
  visible: boolean = false
  RawLayerData: any[] = []
  isNewForm: boolean = false

  modelData = {
    Id: '',
    cord: [],
    remainingProps: {
    } as RemainingProps
  };
  modelAdditionalData: any = ''

  map!: Map;
  coordinates: any = ''
  storedCoordinates: Coordinate[] = [];
  proximityThreshold = 5000;
  geometryButton: any

  message: any = ''

  isVisible: any = false
  isSingleArray: boolean = false
  formPosition: { top: string; left: string } = { top: '0px', left: '0px' };
  AllLayerData: any = {}


  private linecoordinates: any[] = [];
  vectorSource!: VectorSource;
  drawInteraction: any = null;
  constructor(private service: LayersApiService,
    private MapService: MapServiceService,
    private ExportService: ExportService,
    private cdr: ChangeDetectorRef) { }

  getLatLong(data: any) {
    this.service.getlayersById(data).subscribe(response => {
      console.log(response)
      for (let i of response.data) {
        this.storedCoordinates.push([i.Long, i.Lat])
        const markerCoordinates = fromLonLat([i.Long, i.Lat]);

        // Create a feature for the marker
        const marker = new Feature({
          geometry: new Point(markerCoordinates),
          i
        });

        // Style the marker
        marker.setStyle(new Style({
          text: new Text({
            text: '^', // The marker text
            font: '24px Arial', // Font size and family
            fill: new Fill({
              color: 'red', // Text color
            }),
            offsetX: 0, // Horizontal offset
            offsetY: -10, // Vertical offset to position above the point
            textAlign: 'center', // Center the text
          })
        }))

        // Create a vector source and layer for the marker
        const vectorSource = new VectorSource({
          features: [marker]
        });

        const markerLayer = new VectorLayer({
          source: vectorSource
        });

        // Add the marker layer to the map
        this.map.addLayer(markerLayer);

        // Set up a click event listener on the map


      }


    })
  }

  onMapClick(event: MapBrowserEvent<MouseEvent>): void {
    this.visible = true;
    console.log(event)
    const coordinate = event.coordinate;

    // Convert coordinates to pixel to position the form
    const pixel = this.map.getPixelFromCoordinate(coordinate);
    this.formPosition = {
      top: `${pixel[1]}px`,
      left: `${pixel[0]}px`
    };
  }

  closeForm(): void {
    this.visible = false;
  }

  ngOnChanges() {

    // Logic to handle changes to selectedValue
    console.log('Selected value changed:', this.selectedValue);
    // Here you can call methods to update the map based on selectedValue

    let req = {
      "flag": "getAllGeom",
      "Spname": "spGeoJson_StreetLightPole",
      "data": {
        "table": this.selectedValue
      }
    }

    this.getGeometryLine(req)
  }

  @ViewChild('offcanvasEnd', { static: false }) offcanvasEnd: any;

  toggleOffcanvas() {
    if (this.offcanvasEnd?.toggle) {
      this.offcanvasEnd.toggle();
    } else {
      console.error('Offcanvas toggle function not available');
    }
  }
  ngAfterViewInit(): void  {
  }
  ngOnInit(): void {
    console.log("openlayer")
    this.toggleOffcanvas()
    this.MapService.myEvent.subscribe((datas) => {
      console.log(datas)
      if (this.modelAdditionalData.selected) {
        let data
        try {
          if (this.AllLayerData[this.modelAdditionalData.LayerType][1]) {
            data = this.AllLayerData[this.modelAdditionalData.LayerType][1]
            data.remainingProps = ''
            this.modelData = data
          }
        } catch (errors) {
          console.log(errors)
        }

        this.formData = datas.AllCord

        this.isNewForm = true

        console.log("Updated")
      }
      this.onMapClick(datas);
    });

    this.MapService.initializeMap('map')
    this.map = this.MapService.getMap()
    const printControl = new PrintControl(this.MapService.map, () => this.downloadMap());
    this.map.addControl(printControl);
    // this.initiateMap()
    // let events : ("change" | "error" | "propertychange" | "change")= ''

    this.map.on('singleclick', (event) => {
      console.log("clikd", this.visible)
      // Get the coordinates in map projection (EPSG:3857)
      const clickedCoordinate = event.coordinate;

      // Convert to geographic coordinates (EPSG:4326)
      const lonLat = toLonLat(clickedCoordinate);

      this.getLatLong({ lat: lonLat[1], long: lonLat[0] })
      this.handleFeatureClick(event);
      console.log(lonLat);
      // Format and display the coordinates
      this.coordinates = `Longitude: ${lonLat[0].toFixed(6)}, Latitude: ${lonLat[1].toFixed(6)}`;

    });

    const select = new Select({
      condition: click
    });

    select.on('select', (event) => {
      const selectedFeature = event.selected[0]; // Get selected feature
      if (selectedFeature) {
        this.highlightFeature(selectedFeature); // Highlight it
      }
    });

    this.MapService.map.addInteraction(select);
    }

  handleFeatureClick(evt: any) {
    const feature = this.MapService.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
      return feature;
    });
    console.log(feature)
    console.log(this.isNewForm)

    if (feature && !this.isNewForm) {
      this.isNewForm = false
      const featureId = feature.get('Id'); // Get the feature ID
      console.log(feature.get('Type'))
      let LayerType = feature.get('Type') == 'MultiLineString' ? 'LineString' : feature.get('Type')
      this.modelAdditionalData.Type = feature.get('Type')
      const featureInfo = this.AllLayerData[LayerType].find((f: any) => f.Id === featureId); // Find the feature data by ID
      console.log(featureInfo)
      this.modelData = featureInfo
      const getData = this.RawLayerData.find((f: any) => (f.qgs_fid === this.modelData.Id) || (f.objectid === this.modelData.Id)); // Find the feature data by ID

      for (const key in getData) {
        if (getData.hasOwnProperty(key)) {
          this.formData[key] = getData[key] ?? ''; // Initialize with an empty string
        }
      }
      if (featureInfo) {
        this.onMapClick(evt)
        // Show tooltip with the feature's specific data
        // this.showTooltip(featureInfo.data);
      }

    }
  }



  initiateMap() {
    const fullScreenControl = new FullScreen();


    this.vectorSource = new VectorSource();

    // Create a vector layer to display the features
    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 3,
        }),
      }),
    });
    this.map.addLayer(vectorLayer);
    this.map.addControl(fullScreenControl);


  }

  getGeometryLine(req: any) {
    console.log(req)
    this.linecoordinates = []
    let type = null
    this.isLoading = true
    this.service.dbQuery(req).subscribe((response: any) => {
      console.log(response.data)
      try {
        type = JSON.parse(response.data[0].geom_text)?.type
        this.RawLayerData = response.data
        if (type) {
          for (let i of response.data) {
            const { geom_text, qgs_fid, objectid, ...remainingProps } = i;
            if (geom_text) {
              try {
                this.linecoordinates.push({ cord: JSON.parse(geom_text).coordinates, Id: objectid || qgs_fid, remainingProps })
                this.isSingleArray = false
              } catch (err) {
                this.linecoordinates.push(JSON.parse(geom_text).coordinates)
                this.isSingleArray = true
              }
            }

          }
          let vectorLayer: VectorLayer
          console.log(this.linecoordinates)
          this.isLoading = false
          if (type == 'MultiPolygon') {
            // this.printMap()
            this.AllLayerData['MultiPolygon'] = this.linecoordinates
            for (let i of this.linecoordinates) {
              vectorLayer = drawPolygoneLine([i], type)
              this.MapService.map.addLayer(vectorLayer)
            }




          } else if (type == 'Point') {
            if (this.AllLayerData['Point']) {
              this.AllLayerData['Point'] = this.AllLayerData['Point'].concat(this.linecoordinates)
            } else {
              this.AllLayerData['Point'] = this.linecoordinates

            }

            vectorLayer = drawPointsOnMap(this.linecoordinates, type)
            this.MapService.map.addLayer(vectorLayer)
          }
          else if (type == 'MultiLineString') {
            this.AllLayerData['LineString'] = this.linecoordinates

            vectorLayer = drawMultiStringline(this.linecoordinates, type)
            this.MapService.map.addLayer(vectorLayer)
          }

        }
      } catch (error) {
        this.isLoading = false
        return alert("Something went wrong")
      }

      this.isLoading = false






    }, (err) => {
      this.isLoading = false
      return alert("Something went wrong")
    })
  }


  downloadMap(): void {
    const map = this.MapService.getMap();
    const mapSize = map.getSize();
    if (this.AllLayerData.length != '{}') {
      this.exportExcel();
    }




    if (!mapSize || mapSize[0] <= 0 || mapSize[1] <= 0) {
      console.error('Invalid map size.');
      return;
    }

    // Set the export size for the image (scale for higher resolution if needed)
    const exportSize = [mapSize[0] * 2, mapSize[1] * 2]; // Adjust scaling for better quality
    const originalSize = map.getSize();

    // Create an off-screen canvas with a larger size
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = exportSize[0];
    mapCanvas.height = exportSize[1];
    const mapContext = mapCanvas.getContext('2d');

    if (!mapContext) {
      console.error('Failed to get canvas context.');
      return;
    }

    // Adjust map size for export
    map.setSize(exportSize);
    const originalResolution = map.getView().getResolution();

    // Calculate the resolution that matches the scaled export size
    const scaleFactor = mapSize[0] / exportSize[0];
    map.getView().setResolution(originalResolution! * scaleFactor);

    // Wait until the map is rendered completely
    map.once('rendercomplete', () => {
      const renderedCanvases = map.getViewport().getElementsByTagName('canvas');

      if (renderedCanvases.length === 0) {
        console.error('No canvas elements found for map layers.');
        return;
      }

      // Draw all map layers into the off-screen canvas
      for (let i = 0; i < renderedCanvases.length; i++) {
        mapContext.drawImage(renderedCanvases[i], 0, 0, exportSize[0], exportSize[1]);
      }

      // Restore the map view size and resolution
      map.setSize(originalSize);
      map.getView().setResolution(originalResolution);

      // Provide a download link for the map image
      mapCanvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob from canvas.');
          return;
        }

        const url = URL.createObjectURL(blob);

        // Create an invisible download link and trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'map_image.png';  // File name for the download
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink); // Clean up the link after the download
        URL.revokeObjectURL(url); // Clean up the object URL
      });
    });

    // Trigger re-render of the map
    map.renderSync();
  }




  private exportExcel() {
    const exports = [];

    for (let i in this.AllLayerData) {
      console.log(i);
      let data = [];

      for (let j of this.AllLayerData[i]) {
        let obj = { ...j, ...j.remainingProps };
        obj['cord'] = JSON.stringify(obj['cord']);
        data.push(obj);
        delete obj.remainingProps;
      }

      // Push the data and unique filename into the exports array
      exports.push({ data, fileName: i });
    }
    this.ExportService.exportBulkExcel(exports, 'LayerData');
  }

  receiveMessage(message: any) {
    console.log(message)
    this.modelAdditionalData = message
    // this.enableDrawing(message)
  }

  disableDrawing() {
    if (this.MapService.drawInteraction) {
      this.MapService.map.removeInteraction(this.MapService.drawInteraction);
      this.MapService.drawInteraction = null; // Reset the draw interaction
    }
  }


  EditLayer() {

    console.log(this.formData)
    const { selected, Type } = this.modelAdditionalData
    if (this.isNewForm) {
      this.isNewForm = false
      let coord

      if (this.modelAdditionalData.LayerType == 'LineString') {
        coord = this.toMultiLineString(this.formData)
        coord = `'MULTILINESTRING ${coord}'`
      } else if (this.modelAdditionalData.LayerType == 'Point') {
        coord = `'Point (${this.formData[0]} ${this.formData[1]})'`

      }
      console.log(coord)


      let query = `INSERT INTO ${selected} (geom) VALUES (geometry::STGeomFromText(${coord}, 4326));`
      console.log(query)
      let req = { Spname: query }

      this.service.rawdbQuery(req).subscribe(resp => {
        console.log(resp)
        this.closeForm()
        return alert("success")
      })

    }
    else {

      const getData = this.RawLayerData.find((f: any) => (f.qgs_fid === this.modelData.Id) || (f.objectid === this.modelData.Id)); // Find the feature data by ID

      let featureInfo = { ...getData }
      let condition = ''
      if (featureInfo['qgs_fid']) {
        condition = 'qgs_fid = ' + featureInfo['qgs_fid']
        delete featureInfo['qgs_fid']
      } else if (featureInfo['objectid']) {
        condition = 'objectid = ' + featureInfo['objectid']
        delete featureInfo['objectid']
      }

      if (featureInfo['geom_text'] && Type == 'Point') {
        let body = `geometry::STGeomFromText('POINT(${this.modelData.cord[0]} ${this.modelData.cord[1]})', 4326)`
        featureInfo['geom_text'] = body

        featureInfo['geom'] = featureInfo['geom_text']
        delete featureInfo['geom_text']
      } else if (featureInfo['geom_text'] && Type == 'MultiLineString') {
        let data: any = this.modelData.cord[0]
        const result = `(${data.map((coord: any) => `${coord[0]} ${coord[1]}`).join(', ')})`;


        let body = `geometry::STGeomFromText('MULTILINESTRING(${result})', 4326)`
        featureInfo['geom_text'] = body

        featureInfo['geom'] = featureInfo['geom_text']
        delete featureInfo['geom_text']
      }

      let column: any = Object.keys(featureInfo)
      let values: any = Object.values(this.formData)
      let dataformat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/


      let query = `UPDATE ${selected} SET `

      for (let i in column) {
        if (this.isString(this.formData[column[i]]) && column[i] != 'geom') {
          query = query + `${column[i]} = '${this.formData[column[i]]}',`
        } else if (this.isNumber(this.formData[column[i]])) {
          query = query + `${column[i]} = ${this.formData[column[i]]},`
        } else if (dataformat.test(this.formData[column[i]])) {
          query = query + `${column[i]} = CONVERT(DATE, '${this.formData[column[i]]}'),`
        } else if (column[i] == 'geom') {
          query = query + `${column[i]} = ${featureInfo['geom']}`
        }
      }
      query = query.replace(/,$/, '')
      query = query + `WHERE ${condition}`


      let req = { Spname: query }
      console.log(query)
      this.service.rawdbQuery(req).subscribe(resp => {
        console.log(resp)
        this.closeForm()
        return alert("success")
      })


    }





  }




  isString(value: any) {
    return typeof value === 'string';
  }

  isNumber(value: any) {
    return typeof value === 'number' && !isNaN(value);
  }


  toMultiLineString(coordinates: any) {
    const linestring = coordinates.map((coord: any) => coord.join(' ')).join(', ');
    return `((${linestring}))`;
  }

  toPoint(coordinates: any) {
    const Point = coordinates.map((coord: any) => coord.join(' ')).join(', ');
    return `(${Point})`;
  }

  highlightFeature(feature: Feature): void {
    let highlightStyle: Style | undefined;

    // Check if it's a Point or a LineString and set the highlight style accordingly
    if (feature.getGeometry() instanceof Point) {
      highlightStyle = new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: 'green' // Blue color for the points
          })
        })
      });
    } else if (feature.getGeometry() instanceof LineString) {
      highlightStyle = new Style({
        stroke: new Stroke({
          color: 'green', // Red color for highlight
          width: 4
        })
      });
    }

    // Apply the highlight style
    feature.setStyle(highlightStyle);
  }

}