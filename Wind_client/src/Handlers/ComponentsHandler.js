const { Client } = require('discord.js')

/**
 * @param {Client} client
 */
function loadComponents(client) {
  const ascii = require('ascii-table');
  const fs = require('fs')
  const table = new ascii().setHeading("Components", "Type", "Status")

  const componentFolder = fs.readdirSync(`./src/components`);
  for (const folder of componentFolder) {
    const componentFiles = fs.readdirSync(`./src/components/${folder}`).filter(file => file.endsWith('.js'));

    switch (folder) {
      case "buttons": {
        for (const file of componentFiles) {
          const button = require(`../components/${folder}/${file}`)
          client.buttons.set(button.data.name, button);
          table.addRow(file, "button", "✅");
        }
        break;
      }
      case "modals": {
        for (const file of componentFiles) {
          const modal = require(`../components/${folder}/${file}`)
          client.modals.set(modal.data.name, modal)
          table.addRow(file, "modal", "✅");
        }
        break;
      }
      case "selectMenus": {
        for (const file of componentFiles) {
          const selectMenu = require(`../components/${folder}/${file}`);
          client.selectMenus.set(selectMenu.data.name, selectMenu);
          table.addRow(file, "selectMenu", "✅")
        }
        break;
      }
      default:
        break;
    }
  }

  console.log(table.toString(), "\nLoaded Components!");
}

module.exports = { loadComponents }
