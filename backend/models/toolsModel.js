const db = require("../config/db");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs")
const { v4: uuidv4 } = require("uuid");

// ADD
const addTool = async (toolData) => {
  const {
    picture,
    name,
    brand,
    category,
    tag,
    description,
    purchase_date,
    warranty,
    status = "Available",
    remarks,
  } = toolData;

  // Generate unique QR code ID
  const qrCodeId = `TOOL-${uuidv4()}`;

  // Define file path for the QR image
  const fileName = `${qrCodeId}.png`;
  const qrFolderPath = path.join(__dirname, "..", "public/assets/qr/tools");
  const qrFilePath = path.join(qrFolderPath, fileName);
  const qrPublicPath = `${fileName}`; 

  // Ensure QR folder exists
  if (!fs.existsSync(qrFolderPath)) {
    fs.mkdirSync(qrFolderPath, { recursive: true });
  }

  const insertQuery = `
    INSERT INTO tools (
      picture,
      name,
      brand,
      category,
      tag,
      description,
      purchase_date,
      warranty,
      status,
      remarks,
      qr_code_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(insertQuery, [
      picture,
      name,
      brand,
      category,
      tag,
      description,
      purchase_date,
      warranty,
      status,
      remarks,
      qrCodeId,
    ]);

    const toolId = result.insertId;

    // Generate and save QR image to disk
    await QRCode.toFile(qrFilePath, qrCodeId);

    // Save public path to image in DB
    const updateQuery = `UPDATE tools SET qr = ? WHERE id = ?`;
    await db.query(updateQuery, [qrPublicPath, toolId]);

    return {
      id: toolId,
      qr_code_id: qrCodeId,
      qr: qrPublicPath,
    };
  } catch (err) {
    throw new Error("Error adding tool: " + err.message);
  }
};

// DELETE
const deleteTool = async (toolID) => {
  const query = `DELETE FROM tools WHERE id = ?`;

  try {
    const [result] = await db.query(query, [toolID]);
    return result;
  } catch (err) {
    throw new Error("Error deleting tool: " + err.message);
  }
};

// UPDATE
const updateTool = async (toolData) => {
  const {
    picture,
    name,
    brand,
    category,
    tag,
    description,
    purchase_date,
    warranty,
    status,
    remarks,
    id,
  } = toolData;

  const query = `
        UPDATE tools SET picture = ?, name = ?, brand = ?, category = ?, tag = ?,
        description = ?, purchase_date = ?, warranty = ?, status = ?, remarks = ?
        WHERE id = ?
    `;

  try {
    const [result] = await db.query(query, [
      picture,
      name,
      brand,
      category,
      tag,
      description,
      purchase_date,
      warranty,
      status,
      remarks,
      id,
    ]);

    return result;
  } catch (err) {
    throw new Error("Error updating tool: " + err.message);
  }
};

// GET ALL TOOLS
const getAllTools = async () => {
  const query = `SELECT * FROM tools`;

  try {
    const [results] = await db.query(query);
    return results;
  } catch (err) {
    throw new Error("Error fetching tools: " + err.message);
  }
};

// GET SINGLE TOOL BY ID
const getToolById = async (toolId) => {
  const query = `SELECT * FROM tools WHERE id = ?`;

  try {
    const [results] = await db.query(query, [toolId]);
    return results[0]; // Return the first tool, or undefined if not found
  } catch (err) {
    throw new Error("Error fetching tool by ID: " + err.message);
  }
};

module.exports = {
  addTool,
  deleteTool,
  updateTool,
  getAllTools,
  getToolById,
};
