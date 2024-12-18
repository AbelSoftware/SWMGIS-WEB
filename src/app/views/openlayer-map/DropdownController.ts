import { Control } from 'ol/control';
import { Map } from 'ol';

export class DropdownController extends Control {
  private dropdown: HTMLSelectElement; // Keep dropdown as a class property

  constructor(private map: Map, options: any[], private onSelect: (option: string) => void) {
       // Call super first with element
    // Create the control element before calling super
    const element = document.createElement('div');
    element.className = 'dropdown-control ol-unselectable ol-control';
    element.style.width = '10%'

    super({ element: element, target: undefined }); 

    // Create the dropdown element
    this.dropdown = document.createElement('select');
    this.dropdown.className = 'dropdown-menu';

    // Add options to the dropdown
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = JSON.stringify(option);
      opt.innerHTML = option.TableName;
      this.dropdown.appendChild(opt);
    });

    // Create button for the dropdown
    const button = document.createElement('button');
    button.innerHTML = 'layer'; // Dropdown arrow icon or use text

    // Append button and dropdown to the control element
    element.appendChild(button);
    element.appendChild(this.dropdown);


    // Add event listener for dropdown selection
    this.dropdown.addEventListener('change', () => {
      this.handleSelectChange();
    });

    // Add click event for button to toggle dropdown visibility
    button.addEventListener('click', () => {
      this.toggleDropdown();
    });
  }

  private toggleDropdown() {
    this.dropdown.style.display = (this.dropdown.style.display === 'none' || this.dropdown.style.display === '') ? 'block' : 'none';
  }

  private handleSelectChange() {
    const selectedOption = this.dropdown.value;
    this.onSelect(selectedOption);
    this.dropdown.style.display = 'none'; // Hide dropdown after selection
  }
}
