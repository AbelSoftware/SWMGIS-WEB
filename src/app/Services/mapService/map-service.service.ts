import { EventEmitter, Injectable } from '@angular/core';
import { Feature, Map, MapBrowserEvent, View } from 'ol';
import { FullScreen } from 'ol/control';
import { Circle, Geometry, LineString, Point, Polygon } from 'ol/geom';
import { Draw } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke, Fill } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { ExportService } from '../Export-service/export.service'
import { fromCircle } from 'ol/geom/Polygon';
import { defaults as defaultInteractions } from 'ol/interaction';


@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  map!: Map;
  vectorSource!: VectorSource;
  drawInteraction: any = null;
  DrawingData: any[] = []
  // layerMap: Map<string, VectorLayer> = new Map();
  myEvent: EventEmitter<any> = new EventEmitter();
  constructor(private xlsxService: ExportService) { }

  initializeMap(targetId: string) {
    const centerCoordinates = fromLonLat([72.874394, 19.030682]);
    const raster = new TileLayer({
      source: new OSM({
        attributions: [], // This removes the OSM attribution
        crossOrigin: 'anonymous'
      })
    })

    this.map = new Map({
      target: targetId,
      layers: [raster],
      view: new View({
        center: centerCoordinates, // Change the coordinates as needed
        zoom: 10
      }),
      interactions: defaultInteractions({
        doubleClickZoom: false,  // Disables double-click zoom
      })
    });


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

    // Add the vector layer to the map
    this.map.addLayer(vectorLayer);
    // this.map.addControl(fullScreenControl);
  }

  getMap(): Map {
    return this.map;
  }

  setMap(map: Map): void {
    this.map = map
  }


  enableDrawing(payload: any) {
    // Create a new draw interaction for line drawing
    // If draw interaction exists, remove it first to toggle drawing off or switch type
    console.log(payload)
    if (this.drawInteraction) {
      this.map.removeInteraction(this.drawInteraction);
      this.drawInteraction = null; // Reset the draw interaction
    }

    // If drawType is provided, enable drawing
    if (payload.Type) {
      // Create a new draw interaction based on the selected drawType
      this.drawInteraction = new Draw({
        source: this.vectorSource,
        type: payload.Type, // 'Point', 'LineString', or 'Polygon'
      });

      // Add the 'drawend' event listener to style and handle the drawn feature
      this.drawInteraction.on('drawend', (event: any) => {
        const feature = event.feature;
        console.log(event)
        // Optional: Apply a style to the feature based on the type
        feature.setStyle(
          new Style({
            stroke: new Stroke({
              color: payload.Fill, // Line color
              width: payload.outlineWidth,      // Line width for lines and polygons
            }),
            image: new CircleStyle({
              radius: 5,     // Radius for point style
              fill: new Fill({ color: payload.Fill }), // Fill color for points
              stroke: new Stroke({
                color: payload.Outlinecolor, // Outline color for points
                width: payload.outlineWidth,      // Outline width for points
              }),
            }),
          })
        );

        const features: Feature<Geometry> = event.feature;
        const geometry = features.getGeometry(); // This will get the geometry of the drawn feature
        let requiredData: any = {
          "Point": '',
          "Polygon": "",
          "LineString": "",
          "Circle": {
            center: "",
            radius: "",
            perimeter: ""
          }
        }
        console.log(geometry?.getType());



        if (geometry?.getType() === 'Point') {
          // Get the coordinates of the Point and transform them to EPSG:4326
          const coords = (geometry as Point).getCoordinates();
          const transformedCoords = toLonLat(coords); // Transform from EPSG:3857 to EPSG:4326 (lon/lat)
          console.log('Transformed Point coordinates:', transformedCoords);

          // Store the transformed coordinates as a JSON string
          requiredData.Point = JSON.stringify(transformedCoords);
          this.DrawingData.push(requiredData);

          // Prepare a mock event for the onMapClick function
          const mockEvent: any = {
            coordinate: coords,
            map: this.map,
            originalEvent: new MouseEvent('click'),
            preventDefault: () => { },
            stopPropagation: () => { },
            type: 'singleclick',
            frameState: null,
            pixel: this.map.getPixelFromCoordinate(coords), // Convert the coordinate to pixel
            AllCord: transformedCoords // Store the transformed coordinates
          };

          // Emit the mock event to the onMapClick function
          this.myEvent.emit(mockEvent);
          this.disableDrawing();
        }
        else if (geometry?.getType() === 'Polygon') {
          // Get the coordinates of the Polygon and transform to EPSG:4326
          const coords = (geometry as Polygon).getCoordinates()[0]; // Outer ring coordinates
          const transformedCoords = coords.map(coord => toLonLat(coord)); // Transform each vertex
          console.log('Transformed Polygon coordinates:', [transformedCoords]);
          const lastCoordinate = transformedCoords[transformedCoords.length - 1];

          const mockEvent: MapBrowserEvent<MouseEvent> = {
            coordinate: lastCoordinate,
            map: this.map,
            originalEvent: new MouseEvent('click'),
            preventDefault: () => { },
            stopPropagation: () => { },
            type: 'singleclick',
            frameState: null,
            pixel: [0, 0],
          } as MapBrowserEvent<MouseEvent>;

          // Call the onMapClick function with the mock event
          this.myEvent.emit(mockEvent)

          requiredData.Polygon = JSON.stringify([transformedCoords])
          this.DrawingData.push(requiredData)
        } else if (geometry?.getType() === 'LineString') {
          // Get the coordinates of the LineString and transform to EPSG:4326
          const coords = (geometry as LineString).getCoordinates();
          const transformedCoords = coords.map(coord => toLonLat(coord)); // Transform each point
          console.log('Transformed LineString coordinates:', transformedCoords);
          requiredData.LineString = JSON.stringify(transformedCoords)
          this.DrawingData.push(requiredData)

          const lastCoordinate = transformedCoords[transformedCoords.length - 1];

          const mockEvent: any = {
            coordinate: fromLonLat(lastCoordinate),
            map: this.map,
            originalEvent: new MouseEvent('click'),
            preventDefault: () => { },
            stopPropagation: () => { },
            type: 'singleclick',
            frameState: null,
            pixel: [0, 0],
            AllCord: transformedCoords
          };

          // Call the onMapClick function with the mock event
          this.myEvent.emit(mockEvent)
          this.disableDrawing()
        } else if (geometry?.getType() === 'Circle') {
          // Get the center and radius of the Circle
          const circle = geometry as Circle;
          const center = circle.getCenter(); // Center of the circle
          const radius = circle.getRadius(); // Radius of the circle in meters

          // If you need the center coordinates in EPSG:4326
          const transformedCenter = toLonLat(center); // Transform center to EPSG:4326 (lat/lon)
          console.log('Circle center (lon/lat):', transformedCenter);
          console.log('Circle radius (in meters):', radius);

          requiredData.Circle['center'] = transformedCenter
          requiredData.Circle['radius'] = radius

          // Optionally: Convert the Circle to a Polygon to get the perimeter points
          const circlePolygon = fromCircle(circle); // Convert Circle to Polygon
          const polygonCoords = circlePolygon.getCoordinates()[0]; // Get outer ring coordinates

          // Transform the perimeter coordinates to EPSG:4326
          const transformedCoords = polygonCoords.map(coord => toLonLat(coord));
          console.log('Circle perimeter coordinates (lon/lat):', transformedCoords);
          requiredData.Circle.perimeter = [transformedCoords]
          requiredData.Circle = JSON.stringify(requiredData.Circle)
          this.DrawingData.push(requiredData)
        }


      });

      // Add the new draw interaction to the map

      this.map.addInteraction(this.drawInteraction);
    }
  }


  disableDrawing() {
    if (this.drawInteraction) {
      this.map.removeInteraction(this.drawInteraction);
      this.drawInteraction = null; // Reset the draw interaction
    }
    console.log(this.DrawingData)

  }




}
