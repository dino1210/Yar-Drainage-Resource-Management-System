const db = require("../config/db");
const QRCode = require("qrcode");

// ADD
const addVehicle = async (vehicleData) => {
  const {
    picture,
    name,
    brand,
    plate_no,
    category,
    fuel_type,
    location,
    acquisition_date,
    status = "Available",
    remarks,
    warranty,
    maintenance_due,
    assigned_driver,
  } = vehicleData;
  const insertQuery = `INSERT INTO vehicles (picture, name, brand, plate_no, category, fuel_type, location, acquisition_date, status, remarks, maintenance_due, warranty, assigned_driver) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await db.query(insertQuery, [
      picture,
      name,
      brand,
      plate_no,
      category,
      fuel_type,
      location,
      acquisition_date,
      status,
      remarks,
      maintenance_due,
      warranty,
      assigned_driver,
    ]);

    const vehicleId = result.insertId;
    const qrContent = `vehicle-${vehicleId}`;
    const qrImage = await QRCode.toDataURL(qrContent);

    // Update tool with QR code
    const updateQuery = `UPDATE vehicles SET qr = ? WHERE id = ?`;
    await db.query(updateQuery, [qrImage, vehicleId]);

    return { id: vehicleId, qr: qrImage };
  } catch (err) {
    throw new Error("Error adding vehicle: " + err.message);
  }
};

// DELETE
const deleteVehicle = async (vehicleID) => {
  const query = `DELETE FROM vehicles WHERE id = ?`;

  try {
    const [result] = await db.query(query, [vehicleID]);
    return result;
  } catch (err) {
    throw new Error("Error deleting vehicle: " + err.message);
  }
};

// UPDATE
const updateVehicle = async (vehicleData) => {
  const {
    id,
    picture,
    name,
    brand,
    plate_no,
    category,
    fuel_type,
    location,
    acquisition_date,
    status,
    remarks,
    maintenance_due,
    assigned_driver,
    qr,
  } = vehicleData;
  const query = `
        UPDATE vehicles SET picture = ?, name = ?, brand = ?, plate_no = ?, category = ?, 
        fuel_type = ?, location = ?, acquisition_date = ?, status = ?, remarks = ?, maintenance_due = ?, 
        assigned_driver = ?, qr = ? 
        WHERE id = ?
    `;

  try {
    const [result] = await db.query(query, [
      picture,
      name,
      brand,
      plate_no,
      category,
      fuel_type,
      location,
      acquisition_date,
      status,
      remarks,
      maintenance_due,
      assigned_driver,
      qr,
      id,
    ]);
    const vehicleId = result.insertId;
    const qrContent = `vehicle-${vehicleId}`; // This will be scanned
    const qrImage = await QRCode.toDataURL(qrContent); // base64 image

    // Update tool with QR code
    const updateQuery = `UPDATE vehicles SET qr = ? WHERE id = ?`;
    await db.query(updateQuery, [qrImage, toolId]);

    return { id: vehicleId, qr: qrImage };
  } catch (err) {
    throw new Error("Error adding vehicle: " + err.message);
  }
};

// GET ALL TOOLS
const getAllVehicles = async () => {
  const query = `SELECT * FROM vehicles`;

  try {
    const [results] = await db.query(query);
    return results;
  } catch (err) {
    throw new Error("Error fetching vehicles: " + err.message);
  }
};

// GET SINGLE TOOL BY ID
const getVehicleById = async (vehicleId) => {
  const query = `SELECT * FROM vehicles WHERE id = ?`;

  try {
    const [results] = await db.query(query, [vehicleId]);
    return results[0]; // Return the first tool, or undefined if not found
  } catch (err) {
    throw new Error("Error fetching vehicle by ID: " + err.message);
  }
};

module.exports = {
  addVehicle,
  deleteVehicle,
  updateVehicle,
  getAllVehicles,
  getVehicleById,
};
