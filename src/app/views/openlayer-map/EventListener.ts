
import Feature from 'ol/Feature';
import { Point, LineString, MultiPolygon, Geometry } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';

import { Circle as CircleStyle } from 'ol/style';




export function drawPointsOnMap(pointsCoordinates: any,Type:any) {

    // Vector source to hold the point features
    const vectorSource = new VectorSource();

    // Style for the points (using a default circle or custom icon if needed)
    const pointStyle = new Style({
        image: new CircleStyle({
            radius: 5,
            fill: new Fill({
                color: 'blue' // Blue color for the points
            })
        })
        
    });

    // Iterate through the coordinates and create a Point feature for each
    pointsCoordinates.forEach((coord: any) => {
        // Transform coordinates from lon/lat to the map's projection
        const transformedCoord = fromLonLat(coord.cord);

        // Create a Point geometry for each set of coordinates
        const pointFeature = new Feature({
            geometry: new Point(transformedCoord),
            Id:coord.Id,
            Data : coord,
            Type : Type
        });

        // Apply the point style (icon or circle) to the feature
        pointFeature.setStyle(pointStyle);

        // Add the point feature to the vector source
        vectorSource.addFeature(pointFeature);
    });

    // Create a vector layer to hold the point features
    const vectorLayer = new VectorLayer({
        source: vectorSource
    });

    return vectorLayer;
}

export function drawMultiStringline(multiplePaths: any,Type:any): VectorLayer<VectorSource<any>> {
    const vectorSource = new VectorSource();

    // Style for the lines
    const lineStyle = new Style({
        stroke: new Stroke({
            color: 'black', // Red color for the lines
            width: 3
        })
    });

    // Helper function to recursively find valid coordinates
    const getValidCoordinates = (coordinates: any) => {
        // Check if we have a nested array, keep going deeper until we find coordinate pairs
        if (Array.isArray(coordinates[0]) && typeof coordinates[0][0] !== 'number') {
            return getValidCoordinates(coordinates[0]);
        }
        return coordinates;
    };

    // Iterate through each set of coordinates and create a LineString with arrows
    console.log(multiplePaths[0])
    multiplePaths.forEach((pathCoordinates: any) => {
        // Extract valid coordinates even if nested
        
        const validCoordinates = getValidCoordinates(pathCoordinates.cord);

        // Transform coordinates to 'fromLonLat'
        const transformedCoordinates = validCoordinates.map((coord: any) => fromLonLat(coord));

        // Create a LineString geometry for each path
        const pathLine = new LineString(transformedCoordinates);

        // Create a feature with the line geometry
        const pathFeature = new Feature({
            geometry: pathLine,
            Id:pathCoordinates.Id,
            Data : pathCoordinates,
            Type
        });

        // Apply the line style to each feature
        pathFeature.setStyle(lineStyle);

        // Add the line feature to the vector source
        vectorSource.addFeature(pathFeature);

        // Loop through each pair of coordinates and create an arrow at the midpoint
        pathFeature.getGeometry()
        for (let i = 0; i < transformedCoordinates.length - 1; i++) {
            const start = transformedCoordinates[i];
            const end = transformedCoordinates[i + 1];

            const dx = end[0] - start[0];
            const dy = end[1] - start[1];
            const rotation = Math.atan2(dy, dx);

            // Calculate the midpoint between start and end
            const midpoint = [
                (start[0] + end[0]) / 2,
                (start[1] + end[1]) / 2,
            ];

            // Calculate the angle for arrow rotation based on the line segment direction
            const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);

            // Create the arrow at the midpoint with proper rotation
            const arrowFeature = new Feature({
                geometry: new Point(midpoint)
            });

            // Style for the arrow
            const arrowStyle = new Style({
                image: new Icon({
                    src: 'assets/images/arrow.png', // URL to arrow image
                    scale: 0.01, // Adjust the size of the arrow
                    anchor: [0.75, 0.5],
                    rotateWithView: true,
                    rotation: -rotation
                })
            });

            // Apply the arrow style to the feature
            arrowFeature.setStyle(arrowStyle);

            // Add the arrow feature to the vector source
            vectorSource.addFeature(arrowFeature);
        }
    });

    // Return the vector layer with the vector source
    return new VectorLayer({
        source: vectorSource
    });
}


export function drawPolygoneLine(multiPolygonCoordinates: any,Type:any) {
    
    console.log(multiPolygonCoordinates)
    // Transform the coordinates from lon/lat to the map's projection (Web Mercator)
    const transformedPolygonCoordinates = multiPolygonCoordinates.map((polygon: any) =>
        polygon.cord.map((ring: any) => ring.map((coord: any) => fromLonLat(coord)))
    );

    console.log(transformedPolygonCoordinates)

    const multiPolygonFeature = new Feature({
        geometry: new MultiPolygon(transformedPolygonCoordinates),
        Id : multiPolygonCoordinates[0].Id,
        Type
        
    });

   

    console.log(multiPolygonFeature)

    // Create vector source and layer
    const vectorSource = new VectorSource({
        features: [multiPolygonFeature]
    });

    

    const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 0, 0.6)' // Fill color
            }),
            stroke: new Stroke({
                color: 'rgba(255, 0, 0, 1)', // Line color
                width: 2 // Line width
            })
        })
    });
    console.log(vectorLayer)
    return vectorLayer;
}




// export function drawPolygoneLine(multiPolygonCoordinates: any) {
    
//     const multiPolygonData = [
//         {
//           id: 'polygon-1',
//           coords: [
//             [
//               [[-73.993, 40.712], [-73.991, 40.711], [-73.990, 40.713], [-73.993, 40.712]] // First polygon
//             ]
//           ]
//         },
//         {
//           id: 'polygon-2',
//           coords: [
//             [
//               [[-73.995, 40.715], [-73.993, 40.714], [-73.992, 40.716], [-73.995, 40.715]] // Second polygon
//             ]
//           ]
//         }
//         // Add more polygons as needed
//       ];
      
//       // Create a vector source
//       const vectorSource = new VectorSource();
      
//       // Loop through the array and create features with unique IDs
//       multiPolygonData.forEach(data => {
//         const multiPolygon = new MultiPolygon(data.coords);
//         const feature = new Feature(multiPolygon);
//         feature.set('id', data.id); // Set a unique ID for each feature
//         vectorSource.addFeature(feature); // Add feature to the vector source
//       });
      
//       // Create a vector layer
//           const vectorLayer = new VectorLayer({
//         source: vectorSource,
//         style: new Style({
//             fill: new Fill({
//                 color: 'rgba(255, 255, 0, 0.6)' // Fill color
//             }),
//             stroke: new Stroke({
//                 color: 'rgba(255, 0, 0, 1)', // Line color
//                 width: 2 // Line width
//             })
//         })
//     });

//     console.log(vectorLayer)
      

//     return vectorLayer;
// }


