import { Menu, MenuTitle, MenuOption } from './Menu';
import { GameObject } from '../../GameObject';

export class InventoryMenu extends Menu {

    title: MenuTitle;

    constructor(width: number, height: number, titleName: string) {
        super();
        this.title = new MenuTitle(titleName);
    }

    establishInventory(inventory: GameObject[]) {
        this.elements = []; // reset the menu representation

        this.elements.push(this.title); // add the title back into the menu

        let availableLetters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        inventory.forEach(obj => {
            let letter = availableLetters.shift();
           
            let option = new MenuOption(obj.name, letter.toString());

            this.options[letter] = option;
            this.elements.push(option);
        });

    }
}