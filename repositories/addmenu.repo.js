import addmenu from "../models/addmenu";

export async function createMenu(data) {
    try {
        const newMenu = new addmenu(data);
        const savedMenu = await newMenu.save();
        return savedMenu;
    } catch (error) {
        throw new Error("Error creating menu: " + error.message);
    }
}

export async function getAllMenus() {
    try {
        const menus = await addmenu.find().sort({ createdAt: -1 });
        return menus;
    } catch (error) {
        throw new Error(error.message);
    }
};  