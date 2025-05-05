const db = require("../config/db");

const reportConsumableModel = {
  getAllConsumables: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          id,
          item_name,
          tag_code,
          category,
          quantity,
          unit,
          min_stock,
          location
        FROM 
          consumablestable
      `;

      db.query(query, (err, results) => {
        if (err) {
          console.error("Error fetching consumables report:", err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = reportConsumableModel;
