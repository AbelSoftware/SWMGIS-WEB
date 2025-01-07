import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Control } from 'ol/control';
import { DragBox } from 'ol/interaction';
import { Stroke, Style, Fill } from 'ol/style';
import { Feature } from 'ol';
import { Geometry, Polygon } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

@Component({
  selector: 'app-zoomindemo',
  standalone: true,
  imports: [],
  templateUrl: './zoomindemo.component.html',
  styleUrl: './zoomindemo.component.scss'
})
export class ZoomindemoComponent implements OnInit {
  map!: Map;
   ngOnInit(): void {
    // Initialize the map
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0], // Center of the map
        zoom: 2 // Initial zoom level
      })
    });

    // Add the custom zoom control
    const customZoomControl = new CustomZoomControl(this.map);
    this.map.addControl(customZoomControl);
  }
}

// Define the custom zoom control
class CustomZoomControl extends Control {
  private dragBox: DragBox | null = null; // Interaction for drawing a rectangle
  private rectangleLayer!: VectorLayer; // Explicitly specify Polygon type

  constructor(private map: Map) {
    // Create the container for the custom control
    const element = document.createElement('div');
    element.className = 'custom-zoom ol-unselectable ol-control';

    // Create the Zoom In button
    const zoomInButton = document.createElement('button');
    zoomInButton.innerHTML = '+';
    zoomInButton.className = 'zoom-in-button';
    zoomInButton.onclick = () => this.activateRectangleZoom();

    // Create the Zoom Out button
    const zoomOutButton = document.createElement('button');
    zoomOutButton.innerHTML = '-';
    zoomOutButton.className = 'zoom-out-button';
    zoomOutButton.onclick = () => {
      const view = this.map.getView();
      const zoom = view.getZoom() || 0;
      view.setZoom(zoom - 1); // Zoom out
    };

    // Add the buttons to the container
    element.appendChild(zoomInButton);
    element.appendChild(zoomOutButton);

    // Pass the container to the parent class
    super({
      element: element
    });

    // Add a vector layer to display the rectangle
    this.rectangleLayer = new VectorLayer({
      source: new VectorSource(), // Use Geometry for compatibility
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(0, 0, 255, 0.8)', // Blue border with transparency
          width: 2,
          lineDash: [10, 10], // Dashed line
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.2)', // Light blue fill with transparency
        }),
      }),
    });

    this.map.addLayer(this.rectangleLayer);
  }

  // Activate rectangle zoom functionality
  private activateRectangleZoom(): void {
    // Remove any existing DragBox interaction
    if (this.dragBox) {
      this.map.removeInteraction(this.dragBox);
    }

    // Clear any existing rectangle from the rectangle layer
    this.rectangleLayer.getSource()?.clear();

    // Create a new DragBox interaction
    this.dragBox = new DragBox();

    // Add the DragBox interaction to the map
    this.map.addInteraction(this.dragBox);

    // Display the rectangle while drawing
    this.dragBox.on('boxstart', () => {
      // Clear any previously drawn rectangle
      this.rectangleLayer.getSource()?.clear();
    });

    this.dragBox.on('boxdrag', () => {
      // Update the rectangle as it's being drawn
      const extent = this.dragBox!.getGeometry().getExtent();
      const rectangleFeature = new Feature<Polygon>(
        new Polygon([
          [
            [extent[0], extent[1]],
            [extent[0], extent[3]],
            [extent[2], extent[3]],
            [extent[2], extent[1]],
            [extent[0], extent[1]], // Close the rectangle
          ],
        ])
      );
      // Clear the previous rectangle and add the updated one
      this.rectangleLayer.getSource()?.clear();
      // Wrap the Polygon in a Feature
      const polygonFeature = new Feature<Geometry>(Polygon);
      // Add the Feature to the Source of the rectangleLayer
      this.rectangleLayer.getSource()?.addFeature(polygonFeature);
      // this.rectangleLayer.getSource()?.addFeature(rectangleFeature);
    });

    // Handle the "boxend" event to zoom into the rectangle's extent
    this.dragBox.on('boxend', () => {
      const extent = this.dragBox!.getGeometry().getExtent(); // Get the rectangle's extent
      this.map.getView().fit(extent, { duration: 500 }); // Zoom to the rectangle with animation
      // Remove the interaction after zooming
      this.map.removeInteraction(this.dragBox!);
      this.dragBox = null;
    });
  }
}