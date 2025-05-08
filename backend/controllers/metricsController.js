const db = require("../config/db");

const getMetrics = async (req, res) => {
  try {
    // Tools
    const [[{ totalTools }]] = await db.execute("SELECT COUNT(*) AS totalTools FROM tools");
    const [[{ availableTools }]] = await db.execute("SELECT COUNT(*) AS availableTools FROM tools WHERE status = 'Available'");
    const [[{ issuedTools }]] = await db.execute("SELECT COUNT(*) AS issuedTools FROM tools WHERE status = 'Issued'");
    const [[{ reservedTools }]] = await db.execute("SELECT COUNT(*) AS reservedTools FROM tools WHERE status = 'Reserved'");

    // Vehicles
    const [[{ totalVehicles }]] = await db.execute("SELECT COUNT(*) AS totalVehicles FROM vehicles");
    const [[{ availableVehicles }]] = await db.execute("SELECT COUNT(*) AS availableVehicles FROM vehicles WHERE status = 'Available'");
    const [[{ issuedVehicles }]] = await db.execute("SELECT COUNT(*) AS issuedVehicles FROM vehicles WHERE status = 'Issued'");
    const [[{ reservedVehicles }]] = await db.execute("SELECT COUNT(*) AS reservedVehicles FROM vehicles WHERE status = 'Reserved'");

    // Consumables
    const [[{ totalConsumables }]] = await db.execute("SELECT COUNT(*) AS totalConsumables FROM consumables");
    const [[{ inStockConsumables }]] = await db.execute("SELECT COUNT(*) AS inStockConsumables FROM consumables WHERE status = 'In Stock'");
    const [[{ lowStockConsumables }]] = await db.execute("SELECT COUNT(*) AS lowStockConsumables FROM consumables WHERE status = 'Low Stock'");
    const [[{ noStockConsumables }]] = await db.execute("SELECT COUNT(*) AS noStockConsumables FROM consumables WHERE status = 'No Stock'");

    res.status(200).json({
      totalTools,
      availableTools,
      issuedTools,
      reservedTools,

      totalVehicles,
      availableVehicles,
      issuedVehicles,
      reservedVehicles,

      totalConsumables,
      inStockConsumables,
      lowStockConsumables,
      noStockConsumables,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch metrics", error: err.message });
  }
};

module.exports = { getMetrics };
