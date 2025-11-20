import { Request, Response } from 'express';
import pool from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

// Helper function to calculate age in hours
const calculateAgeInHours = (reportedDate: Date): number => {
    const now = new Date();
    const diff = now.getTime() - reportedDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60));
};

// Helper function to generate issue ID
const generateIssueId = async (): Promise<string> => {
    const result = await pool.query(
        'SELECT COUNT(*) as count FROM issues WHERE id LIKE $1',
        ['ISS-2024-%']
    );
    const count = parseInt(result.rows[0].count) + 1;
    return `ISS-2024-${count.toString().padStart(3, '0')}`;
};

export const getAllIssues = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, category, city } = req.query;

        let query = `
      SELECT 
        id, title, description, category, status,
        address, ward, city, latitude, longitude,
        reporter_name, reporter_phone,
        assigned_department, assigned_officer_name,
        images, reported_date, updated_date,
        sla_breached, age_in_hours
      FROM issues
      WHERE 1=1
    `;
        const params: any[] = [];
        let paramCount = 1;

        if (status) {
            query += ` AND status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        if (category) {
            query += ` AND category = $${paramCount}`;
            params.push(category);
            paramCount++;
        }

        if (city) {
            query += ` AND city = $${paramCount}`;
            params.push(city);
            paramCount++;
        }

        query += ' ORDER BY reported_date DESC';

        const result = await pool.query(query, params);

        const issues = result.rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            category: row.category,
            status: row.status,
            location: {
                address: row.address,
                ward: row.ward,
                city: row.city,
                lat: parseFloat(row.latitude),
                lng: parseFloat(row.longitude),
            },
            reporter: {
                name: row.reporter_name,
                phone: row.reporter_phone,
            },
            assignedTo: row.assigned_department ? {
                department: row.assigned_department,
                officerName: row.assigned_officer_name,
            } : undefined,
            images: row.images || [],
            reportedDate: row.reported_date,
            updatedDate: row.updated_date,
            slaBreached: row.sla_breached,
            ageInHours: row.age_in_hours,
        }));

        res.json(issues);
    } catch (error) {
        console.error('Get issues error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getIssueById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const issueResult = await pool.query(
            `SELECT 
        id, title, description, category, status,
        address, ward, city, latitude, longitude,
        reporter_name, reporter_phone,
        assigned_department, assigned_officer_name,
        images, reported_date, updated_date,
        sla_breached, age_in_hours
      FROM issues WHERE id = $1`,
            [id]
        );

        if (issueResult.rows.length === 0) {
            res.status(404).json({ error: 'Issue not found' });
            return;
        }

        const row = issueResult.rows[0];

        // Get issue history
        const historyResult = await pool.query(
            `SELECT timestamp, status, updated_by, department, notes
       FROM issue_history
       WHERE issue_id = $1
       ORDER BY timestamp ASC`,
            [id]
        );

        const issue = {
            id: row.id,
            title: row.title,
            description: row.description,
            category: row.category,
            status: row.status,
            location: {
                address: row.address,
                ward: row.ward,
                city: row.city,
                lat: parseFloat(row.latitude),
                lng: parseFloat(row.longitude),
            },
            reporter: {
                name: row.reporter_name,
                phone: row.reporter_phone,
            },
            assignedTo: row.assigned_department ? {
                department: row.assigned_department,
                officerName: row.assigned_officer_name,
            } : undefined,
            images: row.images || [],
            reportedDate: row.reported_date,
            updatedDate: row.updated_date,
            slaBreached: row.sla_breached,
            ageInHours: row.age_in_hours,
            history: historyResult.rows,
        };

        res.json(issue);
    } catch (error) {
        console.error('Get issue error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createIssue = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const {
            title,
            description,
            category,
            location,
            reporter,
            images = [],
        } = req.body;

        // Validate required fields
        if (!title || !description || !category || !location || !reporter) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const issueId = await generateIssueId();
        const reportedDate = new Date();
        const ageInHours = 0;

        const result = await pool.query(
            `INSERT INTO issues (
        id, title, description, category, status,
        address, ward, city, latitude, longitude,
        reporter_name, reporter_phone,
        images, reported_date, updated_date,
        sla_breached, age_in_hours, authority_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
            [
                issueId, title, description, category, 'NEW',
                location.address, location.ward, location.city, location.lat, location.lng,
                reporter.name, reporter.phone,
                JSON.stringify(images), reportedDate, reportedDate,
                false, ageInHours, req.user?.userId || null
            ]
        );

        // Create initial history entry
        await pool.query(
            `INSERT INTO issue_history (issue_id, timestamp, status, updated_by, department, notes)
       VALUES ($1, $2, $3, $4, $5, $6)`,
            [issueId, reportedDate, 'NEW', 'System', category, 'Issue reported by citizen']
        );

        const row = result.rows[0];

        res.status(201).json({
            id: row.id,
            title: row.title,
            description: row.description,
            category: row.category,
            status: row.status,
            location: {
                address: row.address,
                ward: row.ward,
                city: row.city,
                lat: parseFloat(row.latitude),
                lng: parseFloat(row.longitude),
            },
            reporter: {
                name: row.reporter_name,
                phone: row.reporter_phone,
            },
            images: row.images || [],
            reportedDate: row.reported_date,
            updatedDate: row.updated_date,
            slaBreached: row.sla_breached,
            ageInHours: row.age_in_hours,
        });
    } catch (error) {
        console.error('Create issue error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateIssueStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, assignedDepartment, assignedOfficerName, notes } = req.body;

        if (!status) {
            res.status(400).json({ error: 'Status is required' });
            return;
        }

        const validStatuses = ['NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ error: 'Invalid status' });
            return;
        }

        // Update issue
        const result = await pool.query(
            `UPDATE issues 
       SET status = $1, 
           assigned_department = $2,
           assigned_officer_name = $3,
           updated_date = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
            [status, assignedDepartment || null, assignedOfficerName || null, id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Issue not found' });
            return;
        }

        // Add history entry
        await pool.query(
            `INSERT INTO issue_history (issue_id, timestamp, status, updated_by, department, notes)
       VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5)`,
            [
                id,
                status,
                req.user?.email || 'System',
                assignedDepartment || 'UNKNOWN',
                notes || `Status updated to ${status}`
            ]
        );

        const row = result.rows[0];

        res.json({
            id: row.id,
            status: row.status,
            assignedTo: row.assigned_department ? {
                department: row.assigned_department,
                officerName: row.assigned_officer_name,
            } : undefined,
            updatedDate: row.updated_date,
        });
    } catch (error) {
        console.error('Update issue status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get KPI data
        const kpiResult = await pool.query(`
      SELECT 
        COUNT(*) as total_issues,
        COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as resolved_issues,
        COUNT(CASE WHEN sla_breached = true AND status != 'RESOLVED' THEN 1 END) as sla_breached
      FROM issues
    `);

        const kpi = kpiResult.rows[0];

        // Get department performance
        const deptResult = await pool.query(`
      SELECT 
        assigned_department as department,
        COUNT(*) as issues_handled,
        COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as resolved,
        ROUND(COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END)::numeric / NULLIF(COUNT(*), 0) * 100, 2) as resolved_percentage
      FROM issues
      WHERE assigned_department IS NOT NULL
      GROUP BY assigned_department
      ORDER BY issues_handled DESC
    `);

        res.json({
            kpi: {
                totalIssues: parseInt(kpi.total_issues),
                resolvedIssues: parseInt(kpi.resolved_issues),
                avgResponseTime: '12 hours',
                avgResolutionTime: '3.2 days',
                openSLABreached: parseInt(kpi.sla_breached),
            },
            departmentPerformance: deptResult.rows.map(row => ({
                department: row.department,
                issuesHandled: parseInt(row.issues_handled),
                avgResolutionTime: '3.5 days',
                resolvedPercentage: parseFloat(row.resolved_percentage) || 0,
            })),
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
