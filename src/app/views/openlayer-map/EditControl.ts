import { Control } from 'ol/control';
import { fromLonLat } from 'ol/proj';
import { Map } from 'ol';

export class EditControl extends Control {
  constructor(private map: Map, private onEdit: () => void) {
    const button = document.createElement('button');
    button.innerHTML = '✎'; // You can use an icon here or an image

    const element = document.createElement('div');
    element.className = 'edit-control ol-unselectable ol-control';
    element.style.width = '10%'
    element.appendChild(button);

    super({ element: element, target: undefined });

    button.addEventListener('click', () => {
      this.handleEditClick();
    });
  }

  private handleEditClick() {
    this.onEdit();
  }
}
