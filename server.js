const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Support large project data
app.use(bodyParser.json({ limit: '50mb' })); // Support large project data
app.use(express.static(path.join(__dirname, '.'))); // Serve static files from root
// Explicitly serve reference tables with a clean URL to avoid space encoding issues
app.use('/api/refs', express.static(path.join(__dirname, 'reference tables')));

// Ensure data directory and db.json exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, '[]', 'utf8');
}

// Helper: Read DB
const readDb = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading DB:", err);
        return [];
    }
};

// Helper: Write DB
const writeDb = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error("Error writing DB:", err);
        return false;
    }
};

// --- API Endpoints ---

// GET /api/projects - List all projects (summary)
app.get('/api/projects', (req, res) => {
    const projects = readDb();
    // Return full objects or simplified list? 
    // Requirement says "full project state" is in the object. 
    // For listing, we might return everything or just meta. 
    // Let's return everything for simplicity of the "Shared State" model unless performance hits.
    res.json(projects);
});

// GET /api/projects/:id - Get single project
app.get('/api/projects/:id', (req, res) => {
    const projects = readDb();
    const project = projects.find(p => p.id === req.params.id);
    if (project) {
        res.json(project);
    } else {
        res.status(404).json({ error: 'Project not found' });
    }
});

// POST /api/projects - Create new project
app.post('/api/projects', (req, res) => {
    const newProject = req.body;
    if (!newProject.id || !newProject.name) {
        return res.status(400).json({ error: 'Missing id or name' });
    }

    const projects = readDb();
    // Check for duplicate ID
    if (projects.find(p => p.id === newProject.id)) {
        return res.status(409).json({ error: 'Project ID already exists' });
    }

    // Add metadata
    newProject.createdAt = new Date().toISOString();
    newProject.lastUpdated = new Date().toISOString();

    projects.push(newProject);
    writeDb(projects);
    res.status(201).json(newProject);
});

// PUT /api/projects/:id - Update project (Full overwrite or merge?)
// Requirement implies persisting changes. We'll implement as "Merge/Update".
app.put('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    const updates = req.body;
    const projects = readDb();
    const index = projects.findIndex(p => p.id === projectId);

    if (index !== -1) {
        // Merge updates into existing project
        const updatedProject = { ...projects[index], ...updates };
        updatedProject.lastUpdated = new Date().toISOString(); // Update timestamp
        projects[index] = updatedProject;
        writeDb(projects);
        res.json(updatedProject);
    } else {
        // If not found? Could Create? User "createProject" uses POST.
        // But if someone is saving a project that *should* exist but doesn't (maybe DB deleted), 
        // strictly PUT to ID usually implies update.
        // Let's return 404 to be safe.
        res.status(404).json({ error: 'Project not found' });
    }
});

// DELETE /api/projects/:id - Delete project
app.delete('/api/projects/:id', (req, res) => {
    const projectId = req.params.id;
    let projects = readDb();
    const initialLength = projects.length;
    projects = projects.filter(p => p.id !== projectId);

    if (projects.length < initialLength) {
        writeDb(projects);
        res.json({ success: true, id: projectId });
    } else {
        res.status(404).json({ error: 'Project not found' });
    }
});

// GET /api/catalog - List CSV files in 'reference tables' with metadata
app.get('/api/catalog', (req, res) => {
    const refDir = path.resolve(process.cwd(), "reference tables");

    if (!fs.existsSync(refDir)) {
        return res.json([]);
    }

    try {
        const files = fs.readdirSync(refDir).filter(file => {
            return !file.startsWith('~$') && file.toLowerCase().endsWith('.csv');
        });

        const catalog = files.map(f => {
            const stats = fs.statSync(path.join(refDir, f));
            return {
                name: f,
                lastModified: stats.mtime.toISOString()
            };
        });

        res.json(catalog);
    } catch (err) {
        console.error("Error listing catalog:", err);
        res.status(500).json({ error: "Failed to list catalog" });
    }
});

// GET /api/catalog/:file - Get content of a specific CSV file
app.get('/api/catalog/:file', (req, res) => {
    const refDir = path.resolve(process.cwd(), "reference tables");
    const fileName = req.params.file;
    const filePath = path.join(refDir, fileName);

    // Basic security traversal check
    if (!filePath.startsWith(refDir)) {
        return res.status(403).send("Forbidden");
    }

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("File not found");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Serving static files from ${__dirname}`);
    console.log(`API available at http://localhost:${PORT}/api/projects`);
    console.log(`Data file: ${DB_FILE}`);
});
