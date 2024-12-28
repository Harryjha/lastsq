const MenuItem = require('../Models/chatModel');

const chatController = {
  async getMenuItems(req, res) {
    try {
      const { menuKey = 'main' } = req.query;
      const menuItem = await MenuItem.findOne({ key: menuKey });
      
      if (!menuItem) {
        return res.status(404).json({ message: 'Menu not found' });
      }

      // Get sub-menus if they exist
      const subMenus = await MenuItem.find({ parentKey: menuKey });

      res.json({
        currentMenu: menuItem,
        hasSubMenus: subMenus.length > 0,
        subMenus: subMenus
      });

    } catch (error) {
      res.status(500).json({ message: 'Error fetching menu items', error });
    }
  }
};

module.exports = chatController;
