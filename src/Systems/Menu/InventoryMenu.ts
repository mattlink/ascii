import { Menu, MenuTitle, MenuOption } from './Menu';
import { GameObject } from '../../GameObject';

export class InventoryMenu extends Menu {

    title: MenuTitle;

    constructor(titleName: string) {
        super();
        this.title = new MenuTitle(titleName);
    }

    establishInventory(inventory: Record<string, GameObject>) {
        this.elements = []; // reset the menu representation

        this.elements.push(this.title); // add the title back into the menu

        for (let key in inventory) {
            let option = new MenuOption(inventory[key].name, key);
            this.options[key] = option;
            this.elements.push(option);
        }
    }
}