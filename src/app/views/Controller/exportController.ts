import { Control } from 'ol/control';
import { Map } from 'ol';

export class PrintControl extends Control {
  constructor(private map: Map, private onPrint: () => void) {
    // Create a button element for the control
    const button = document.createElement('button');
    button.innerHTML = '🖨️'; // Print icon or any other symbol for print

    // Create a div element to hold the button and set the class name for styling
    const element = document.createElement('div');
    element.className = 'print-control ol-unselectable ol-control';
    element.style.width = '10%'
    element.appendChild(button);

    // Pass the element to the parent Control class
    super({ element: element, target: undefined });

    // Add an event listener to the button to handle the print action
    button.addEventListener('click', () => {
      this.handlePrintClick();
    });
  }

  // Method to handle the print action
  private handlePrintClick() {
    this.onPrint(); // Call the callback function passed to the control
  }
}
