const db = require("../config/db");

const reportVehiclesModel = {
  getAllVehicles: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT 
          id,
          vehicle_name,
          vehicle_code,
          category,
          quantity,
          unit,
          min_stock,
          location
        FROM 
          vehiclestable
      `;

      db.query(query, (err, results) => {
        if (err) {
          console.error("Error fetching vehicles report:", err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = reportVehiclesModel;
