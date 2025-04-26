const db = require("../config/db");

const getMetrics = async (req, res) => {
    try {
        const [tools] = await db.execute("SELECT COUNT(*) as totalTools FROM tools");
        const [consumables] = await db.execute("SELECT COUNT(*) as totalConsumables FROM consumables");
        const [vehicles] = await db.execute("SELECT COUNT(*) as totalVehicles FROM vehicles");

        res.status(200).json({
            totalTools: tools[0].totalTools,
            totalConsumables: consumables[0].totalConsumables,
            totalVehicles: vehicles[0].totalVehicles,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch metrics", error: err.message });
    }
};

module.exports = { getMetrics };
