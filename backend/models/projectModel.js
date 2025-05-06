const db = require("../config/db");
const cron = require("node-cron");

// CREATE PROJECT
const createProject = async (projectData) => {
  const currentDate = new Date();
  const startDate = new Date(projectData.start_date);
  const endDate = new Date(projectData.end_date);

  // Determine project status
  let projectStatus = 'Upcoming';  // Default status
  if (currentDate >= startDate && currentDate <= endDate) {
    projectStatus = 'On-going';
  } else if (currentDate > endDate) {
    projectStatus = 'Completed';
  }

  const query = `
    INSERT INTO projects (name, person_in_charge, location, description, start_date, end_date, project_status, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    projectData.name,
    projectData.person_in_charge,
    projectData.location,
    projectData.description,
    projectData.start_date,
    projectData.end_date,
    projectStatus,  // Include projectStatus in the query
    projectData.created_by,
  ];

  try {
    const [results] = await db.query(query, values);
    return results;
  } catch (error) {
    console.error("Error creating project:", error.message);
    throw error;
  }
};

// Function to update project status periodically (for ongoing projects)
const updateProjectStatus = async (projectId, startDate, endDate) => {
  const currentDate = new Date();
  let projectStatus = 'Upcoming';  // Default status
  if (currentDate >= new Date(startDate) && currentDate <= new Date(endDate)) {
    projectStatus = 'Ongoing';
  } else if (currentDate > new Date(endDate)) {
    projectStatus = 'Completed';
  }

  const query = `UPDATE projects SET project_status = ? WHERE project_id = ?`;
  const values = [projectStatus, projectId];

  try {
    await db.query(query, values);
    console.log(`Project ${projectId} status updated to ${projectStatus}`);
  } catch (error) {
    console.error("Error updating project status:", error.message);
    throw error;
  }
};

// Function to update tool status
const updateToolStatus = async (toolId, projectStartDate) => {
  const currentDate = new Date();
  const status = currentDate < new Date(projectStartDate) ? "Reserved" : "Issued-out";

  const query = `UPDATE tools SET status = ? WHERE tool_id = ?`;
  const values = [status, toolId];

  try {
    await db.query(query, values);
    console.log(`Tool ${toolId} status updated to ${status}`);
  } catch (error) {
    console.error("Error updating tool status:", error.message);
    throw error;
  }
};

// Function to link tools to project and update their status periodically
const linkToolsToProject = async (projectId, tools, projectStartDate) => {
  if (!Array.isArray(tools) || tools.length === 0) return;

  const values = tools.map((id) => [projectId, parseInt(id)]);
  const placeholders = values.map(() => "(?, ?)").join(", ");
  const flatValues = values.flat();

  const query = `INSERT INTO project_tools (project_id, tool_id) VALUES ${placeholders}`;

  try {
    const [results] = await db.query(query, flatValues);

    // Start cron job to periodically check and update statuses for tools
    startStatusUpdater(tools, [], [], projectStartDate);

    return results;
  } catch (error) {
    console.error("Error linking tools:", error.message);
    throw error;
  }
};

// LINK CONSUMABLES AND UPDATE QUANTITY
const linkConsumablesToProject = async (projectId, consumables) => {
  if (!Array.isArray(consumables) || consumables.length === 0) return;

  const values = consumables.map((id) => [projectId, parseInt(id)]);
  const query = `INSERT INTO project_consumables (project_id, consumable_id) VALUES ?`;

  try {
    const [results] = await db.query(query, [values]);

    // Update the quantity of each consumable in the consumables table
    for (const consumableId of consumables) {
      const updateQuantityQuery = `
        UPDATE consumables
        SET quantity = quantity - 1
        WHERE consumable_id = ?
      `;
      await db.query(updateQuantityQuery, [consumableId]);
      console.log(`Consumable ${consumableId} quantity updated.`);
    }

    return results;
  } catch (error) {
    console.error("Error linking consumables:", error.message);
    throw error;
  }
};

// Function to update vehicle status
const updateVehicleStatus = async (vehicleId, projectStartDate) => {
  const currentDate = new Date();
  const status = currentDate < new Date(projectStartDate) ? "Reserved" : "Issued-out";

  const query = `UPDATE vehicles SET status = ? WHERE vehicle_id = ?`;
  const values = [status, vehicleId];

  try {
    await db.query(query, values);
    console.log(`Vehicle ${vehicleId} status updated to ${status}`);
  } catch (error) {
    console.error("Error updating vehicle status:", error.message);
    throw error;
  }
};

// Function to link vehicles to project and update their status periodically
const linkVehiclesToProject = async (projectId, vehicles, projectStartDate) => {
  if (!Array.isArray(vehicles) || vehicles.length === 0) return;

  const values = vehicles.map((id) => [projectId, parseInt(id)]);
  const placeholders = values.map(() => "(?, ?)").join(", ");
  const flatValues = values.flat();

  const query = `INSERT INTO project_vehicles (project_id, vehicle_id) VALUES ${placeholders}`;

  try {
    const [results] = await db.query(query, flatValues);

    // Start cron job to periodically check and update statuses for vehicles
    startStatusUpdater([], vehicles, [], projectStartDate);

    return results;
  } catch (error) {
    console.error("Error linking vehicles:", error.message);
    throw error;
  }
};

// Cron job function to periodically update statuses
const startStatusUpdater = (tools, vehicles, consumables, projectStartDate) => {
  // Cron job to run every minute (adjust as necessary)
  cron.schedule('* * * * *', async () => {
    try {
      // Update tool statuses
      for (const toolId of tools) {
        await updateToolStatus(toolId, projectStartDate);
      }

      // Update vehicle statuses
      for (const vehicleId of vehicles) {
        await updateVehicleStatus(vehicleId, projectStartDate);
      }

      // Update consumable statuses
      for (const consumableId of consumables) {
        await updateConsumableStatus(consumableId, projectStartDate);
      }

    } catch (error) {
      console.error("Error during periodic status update:", error.message);
    }
  });
};

// Function to update consumable status
const updateConsumableStatus = async (consumableId, projectStartDate) => {
  const currentDate = new Date();
  const status = currentDate < new Date(projectStartDate) ? "Reserved" : "Used";

  const query = `UPDATE consumables SET status = ? WHERE consumable_id = ?`;
  const values = [status, consumableId];

  try {
    await db.query(query, values);
    console.log(`Consumable ${consumableId} status updated to ${status}`);
  } catch (error) {
    console.error("Error updating consumable status:", error.message);
    throw error;
  }
};

const getAllProjects = async () => {
  const query = `
    SELECT 
      p.project_id,
      p.name,
      p.person_in_charge,
      p.location,
      p.description,
      p.start_date,
      p.end_date,
      p.created_at,
      p.created_by,
      p.project_status,

      -- Tool details
      t.tool_id,
      t.name AS tool_name,
      t.category AS tool_category,
      t.tag AS tool_tag,

      -- Consumable details
      c.consumable_id,
      c.name AS consumable_name,
      c.tag AS consumable_tag,
      c.unit AS consumable_unit,
      c.quantity AS consumable_quantity,

      -- Vehicle details
      v.vehicle_id,
      v.name AS vehicle_name,
      v.remarks AS vehicle_remarks,
      v.plate_no AS vehicle_plate_no,
      v.assigned_driver AS vehicle_assigned_driver

    FROM projects p
    LEFT JOIN project_tools pt ON pt.project_id = p.project_id
    LEFT JOIN tools t ON t.tool_id = pt.tool_id

    LEFT JOIN project_consumables pc ON pc.project_id = p.project_id
    LEFT JOIN consumables c ON c.consumable_id = pc.consumable_id

    LEFT JOIN project_vehicles pv ON pv.project_id = p.project_id
    LEFT JOIN vehicles v ON v.vehicle_id = pv.vehicle_id
  `;

  try {
    const [results] = await db.query(query);

    const projects = results.reduce((acc, row) => {
      let project = acc.find((p) => p.project_id === row.project_id);

      if (!project) {
        project = {
          project_id: row.project_id,
          name: row.name,
          person_in_charge: row.person_in_charge,
          location: row.location,
          description: row.description,
          start_date: row.start_date,
          end_date: row.end_date,
          created_at: row.created_at,
          created_by: row.created_by,
          project_status: row.project_status,
          tools: [],
          consumables: [],
          vehicles: [],
        };
        acc.push(project);
      }

      // Add tool if exists and not already added
      if (row.tool_id && !project.tools.some((t) => t.id === row.tool_id)) {
        project.tools.push({
          id: row.tool_id,
          name: row.tool_name,
          category: row.tool_category,
          tag: row.tool_tag,
        });
      }

      // Add consumable
      if (
        row.consumable_id &&
        !project.consumables.some((c) => c.id === row.consumable_id)
      ) {
        project.consumables.push({
          id: row.consumable_id,
          name: row.consumable_name,
          tag: row.consumable_tag,
          unit: row.consumable_unit,
          quantity: row.consumable_quantity,
        });
      }

      // Add vehicle if exists and not already added
      if (
        row.vehicle_id &&
        !project.vehicles.some((v) => v.id === row.vehicle_id)
      ) {
        project.vehicles.push({
          id: row.vehicle_id,
          name: row.vehicle_name,
          plate_no: row.vehicle_plate_no,
          assigned_driver: row.vehicle_assigned_driver,
        });
      }

      return acc;
    }, []);

    return projects;
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    throw new Error("Error fetching projects: " + err.message);
  }
};

// GET RECENTLY CREATED PROJECTS
const getRecentProjects = async () => {
  const [rows] = await db.query(
    `SELECT * FROM projects ORDER BY created_at DESC LIMIT 5`
  );
  return rows;
};

module.exports = {
  createProject,
  linkToolsToProject,
  linkConsumablesToProject,
  linkVehiclesToProject,
  getAllProjects,
  getRecentProjects,
};
