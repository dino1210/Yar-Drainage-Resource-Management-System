const db = require("../config/db");
const cron = require("node-cron");

const createProject = async (projectData) => {
  console.log('Received projectData:', projectData);  // Debugging line

  const today = new Date();
  const startDate = new Date(projectData.start_date);
  const endDate = new Date(projectData.end_date);

  // Determine project status
  let project_status = null;
  if (today < startDate) {
    project_status = 'Upcoming';
  } else if (today >= startDate && today <= endDate) {
    project_status = 'On-Going';
  } else if (today > endDate) {
    project_status = 'Completed';
  }

  const query = `
    INSERT INTO projects (name, person_in_charge, location, description, start_date, end_date, created_by, project_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    projectData.name,
    projectData.person_in_charge,
    projectData.location,
    projectData.description,
    projectData.start_date,
    projectData.end_date,
    projectData.created_by,
    project_status,
  ];

  try {
    const [results] = await db.query(query, values);
    const projectId = results.insertId;

    // Fallback-safe assignments
    const tool_ids = projectData.tool_ids || [];
    const start_date = projectData.start_date || '';
    const created_by = projectData.created_by || 'Unknown';
    const projectName = projectData.name || 'Untitled Project';

    console.log("→ Calling linkToolsToProject with:", {
      projectId,
      tool_ids,
      start_date,
      created_by,
      projectName,
    });

    // Link tools to the project and update their status
    await linkToolsToProject(projectId, tool_ids, start_date, created_by, projectName);

    return results;
  } catch (error) {
    console.error("Error creating project:", error.message);
    throw error;
  }
};


const linkToolsToProject = async (projectId, tools, projectStartDate, createdBy, projectName) => {
  if (!Array.isArray(tools) || tools.length === 0) return;

  console.log("→ Inside linkToolsToProject - createdBy:", createdBy);  // Debugging line
  console.log("→ Inside linkToolsToProject - projectName:", projectName);  // Debugging line

  const values = tools.map((id) => [projectId, parseInt(id)]);
  const placeholders = values.map(() => "(?, ?)").join(", ");
  const flatValues = values.flat();

  const insertQuery = `INSERT INTO project_tools (project_id, tool_id) VALUES ${placeholders}`;

  try {
    const [insertResults] = await db.query(insertQuery, flatValues);

    const startDate = new Date(projectStartDate);
    const today = new Date();
    const isSameDay =
      today.getFullYear() === startDate.getFullYear() &&
      today.getMonth() === startDate.getMonth() &&
      today.getDate() === startDate.getDate();

    let toolStatus = '';
    if (today < startDate) {
      toolStatus = 'Reserved';
    } else if (isSameDay || today > startDate) {
      toolStatus = 'Issued-Out';
    }

    const updateAndLogPromises = tools.map(async (toolId) => {
      // Update tool status
      await db.query(`UPDATE tools SET status = ? WHERE tool_id = ?`, [toolStatus, toolId]);

      // Fetch tool name and tag
      const [[toolData]] = await db.query(`SELECT name, tag FROM tools WHERE tool_id = ?`, [toolId]);

      const sanitizedCreatedBy = (createdBy || "Unknown").trim();
      const remarks = `Tool ${toolStatus.toLowerCase()} for Project: ${projectName} (ID: ${projectId})`;

      // Insert log with name and tag
      await db.query(
        `INSERT INTO tool_logs (tool_id, tool_name, tag, action, action_by, date, remarks)
         VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
        [toolId, toolData.name, toolData.tag, toolStatus, sanitizedCreatedBy, remarks]
      );
    });

    await Promise.all(updateAndLogPromises);

    return insertResults;
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


// Function to link vehicles to project and update their status
const linkVehiclesToProject = async (projectId, vehicles, projectStartDate) => {
  if (!Array.isArray(vehicles) || vehicles.length === 0) return;

  const values = vehicles.map((id) => [projectId, parseInt(id)]);
  const placeholders = values.map(() => "(?, ?)").join(", ");
  const flatValues = values.flat();

  const insertQuery = `INSERT INTO project_vehicles (project_id, vehicle_id) VALUES ${placeholders}`;

  try {
    const [insertResults] = await db.query(insertQuery, flatValues);

    const startDate = new Date(projectStartDate);
    const today = new Date();

    const isSameDay =
      today.getFullYear() === startDate.getFullYear() &&
      today.getMonth() === startDate.getMonth() &&
      today.getDate() === startDate.getDate();

    let vehicleStatus = '';
    if (today < startDate) {
      vehicleStatus = 'Reserved';
    } else if (isSameDay || today > startDate) {
      vehicleStatus = 'Issued-out';
    }

    const updatePromises = vehicles.map((vehicleId) => {
      const updateQuery = `UPDATE vehicles SET status = ? WHERE vehicle_id = ?`;
      return db.query(updateQuery, [vehicleStatus, vehicleId]);
    });

    await Promise.all(updatePromises);

    return insertResults;
  } catch (error) {
    console.error("Error linking vehicles:", error.message);
    throw error;
  }
};

const updateProject = async (project_id, projectData) => {
  const today = new Date();
  const startDate = new Date(projectData.start_date);
  const endDate = new Date(projectData.end_date);

  // Determine updated project status
  let project_status = null;
  if (today < startDate) {
    project_status = 'Upcoming';
  } else if (today >= startDate && today <= endDate) {
    project_status = 'On-Going';
  } else if (today > endDate) {
    project_status = 'Completed';
  }

  const query = `
    UPDATE projects
    SET name = ?, person_in_charge = ?, location = ?, description = ?, start_date = ?, end_date = ?, created_by = ?, project_status = ?
    WHERE project_id = ?
  `;
  const values = [
    projectData.name,
    projectData.person_in_charge,
    projectData.location,
    projectData.description,
    projectData.start_date,
    projectData.end_date,
    projectData.created_by,
    project_status,
    project_id,
  ];

  try {
    await db.query(query, values);

    // Sanitize incoming arrays for tools, consumables, and vehicles
    const validToolIds = (projectData.tool_ids || []).filter(id => id !== undefined && id !== null);
    const validConsumableIds = (projectData.consumable_ids || []).filter(id => id !== undefined && id !== null);
    const validVehicleIds = (projectData.vehicle_ids || []).filter(id => id !== undefined && id !== null);

    // Add new tools to the project if they aren't already linked
    await addNewToolsToProject(project_id, validToolIds, startDate);

    // Optionally, link consumables and vehicles as well
    await linkConsumablesToProject(project_id, validConsumableIds);
    await linkVehiclesToProject(project_id, validVehicleIds, startDate);

    return { success: true, message: 'Project updated successfully' };
  } catch (error) {
    console.error("Error updating project:", error.message);
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

      if (row.tool_id && !project.tools.some((t) => t.id === row.tool_id)) {
        project.tools.push({
          id: row.tool_id,
          name: row.tool_name,
          category: row.tool_category,
          tag: row.tool_tag,
        });
      }

      if (row.consumable_id && !project.consumables.some((c) => c.id === row.consumable_id)) {
        project.consumables.push({
          id: row.consumable_id,
          name: row.consumable_name,
          tag: row.consumable_tag,
          unit: row.consumable_unit,
          quantity: row.consumable_quantity,
        });
      }

      if (row.vehicle_id && !project.vehicles.some((v) => v.id === row.vehicle_id)) {
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

// GET RECENTLY CREATED PROJECTS (with project_status from view)
const getRecentProjects = async () => {
  const query = `
    SELECT 
      project_id,
      name,
      person_in_charge,
      location,
      description,
      start_date,
      end_date,
      created_at,
      created_by,
      project_status
    FROM projects
    ORDER BY created_at DESC
    LIMIT 5
  `;

  try {
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    console.error("Error fetching recent projects:", error.message);
    throw error;
  }
};


// GET SINGLE TOOL BY ID
const getProjectById = async (projectId) => {
  const query = `SELECT * FROM projects WHERE project_id = ?`;

  try {
    const [results] = await db.query(query, [projectId]);
    return results[0]; // Return the first tool, or undefined if not found
  } catch (err) {
    throw new Error("Error fetching project by ID: " + err.message);
  }
};

// UPDATE STATUS
const updateProjectStatus = async (project_id, newStatus) => {
  const updateQuery = `UPDATE projects SET project_status = ? WHERE project_id = ?`;

  try {
    const [result] = await db.query(updateQuery, [newStatus, project_id]);

    if (newStatus === 'Cancelled' || newStatus === 'Completed') {
      // Revert tool statuses to 'Available'
      const revertToolsQuery = `
        UPDATE tools
        SET status = 'Available'
        WHERE tool_id IN (
          SELECT tool_id FROM project_tools WHERE project_id = ?
        )
      `;

      // Revert vehicle statuses to 'Available'
      const revertVehiclesQuery = `
        UPDATE vehicles
        SET status = 'Available'
        WHERE vehicle_id IN (
          SELECT vehicle_id FROM project_vehicles WHERE project_id = ?
        )
      `;

      await Promise.all([
        db.query(revertToolsQuery, [project_id]),
        db.query(revertVehiclesQuery, [project_id])
      ]);
    }

    return result;
  } catch (error) {
    console.error("Error updating project status:", error.message);
    throw error;
  }
};



//DELETE PROJECT
const deleteProject = async (project_id) => {
  const query = `DELETE FROM projects WHERE project_id = ?`;

  try {
    const [result] = await db.query(query, [project_id]);
    return result;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createProject,
  linkToolsToProject,
  linkConsumablesToProject,
  linkVehiclesToProject,
  getAllProjects,
  getRecentProjects,
  updateProjectStatus,
  getProjectById,
  deleteProject,
  updateProject
};
