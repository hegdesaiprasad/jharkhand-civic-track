import pool from '../config/database.js';

const sampleIssues = [
    {
        title: "Large pothole on Main Road near Bus Stand",
        description: "There is a deep pothole causing traffic issues and accidents. Urgent repair needed.",
        category: "POTHOLES",
        status: "NEW",
        address: "Main Road, near Bus Stand",
        ward: "Ward 12",
        city: "Ranchi",
        lat: 23.3441,
        lng: 85.3096,
        reporterName: "Rajesh Kumar",
        reporterPhone: "+91-98765-43210",
        images: [],
    },
    {
        title: "Garbage pile near Market Area",
        description: "Uncollected garbage for 5 days. Creating health hazard and bad smell.",
        category: "GARBAGE",
        status: "ACKNOWLEDGED",
        address: "Market Road, Sector 5",
        ward: "Ward 8",
        city: "Jamshedpur",
        lat: 22.8046,
        lng: 86.2029,
        reporterName: "Priya Sharma",
        reporterPhone: "+91-97654-32109",
        assignedDepartment: "SANITATION",
        assignedOfficerName: "Amit Singh",
        images: [],
    },
    {
        title: "Street light not working on Park Street",
        description: "All street lights are off for the past week. Dark area causing safety issues.",
        category: "STREETLIGHTS",
        status: "IN_PROGRESS",
        address: "Park Street, Block C",
        ward: "Ward 15",
        city: "Ranchi",
        lat: 23.3629,
        lng: 85.3346,
        reporterName: "Sunita Devi",
        reporterPhone: "+91-99876-54321",
        assignedDepartment: "ELECTRICITY",
        assignedOfficerName: "Manoj Yadav",
        images: [],
    },
    {
        title: "Water pipe leakage causing road damage",
        description: "Underground water pipe leaking heavily. Water wastage and road getting damaged.",
        category: "WATER",
        status: "RESOLVED",
        address: "MG Road, near School",
        ward: "Ward 3",
        city: "Dhanbad",
        lat: 23.7957,
        lng: 86.4304,
        reporterName: "Vikash Tiwari",
        reporterPhone: "+91-96543-21098",
        assignedDepartment: "WATER",
        assignedOfficerName: "Ravi Mishra",
        images: [],
    },
    {
        title: "Sewage overflow in residential area",
        description: "Blocked sewage line causing overflow in streets. Health emergency.",
        category: "SEWAGE",
        status: "ACKNOWLEDGED",
        address: "Housing Colony, Sector 9",
        ward: "Ward 20",
        city: "Ranchi",
        lat: 23.3725,
        lng: 85.3235,
        reporterName: "Anita Kumari",
        reporterPhone: "+91-94567-89012",
        assignedDepartment: "SANITATION",
        assignedOfficerName: "Santosh Kumar",
        images: [],
    },
    {
        title: "Multiple potholes on Highway stretch",
        description: "Several potholes on 2km highway stretch causing vehicle damage",
        category: "POTHOLES",
        status: "IN_PROGRESS",
        address: "NH-33, near Toll Plaza",
        ward: "Ward 25",
        city: "Jamshedpur",
        lat: 22.7925,
        lng: 86.1842,
        reporterName: "Deepak Singh",
        reporterPhone: "+91-98765-12345",
        assignedDepartment: "ROADS",
        assignedOfficerName: "Ajay Verma",
        images: [],
    },
    {
        title: "No water supply for 3 days",
        description: "Entire area without water supply. Facing severe crisis.",
        category: "WATER",
        status: "IN_PROGRESS",
        address: "Satellite Town, Phase 2",
        ward: "Ward 18",
        city: "Dhanbad",
        lat: 23.8103,
        lng: 86.4402,
        reporterName: "Ramesh Gupta",
        reporterPhone: "+91-93456-78901",
        assignedDepartment: "WATER",
        assignedOfficerName: "Suresh Pandey",
        images: [],
    },
    {
        title: "Broken street light near park",
        description: "Street light pole damaged and leaning dangerously",
        category: "STREETLIGHTS",
        status: "NEW",
        address: "Central Park Road",
        ward: "Ward 5",
        city: "Ranchi",
        lat: 23.3550,
        lng: 85.3200,
        reporterName: "Sanjay Kumar",
        reporterPhone: "+91-91234-56789",
        images: [],
    },
];

async function generateIssueId(): Promise<string> {
    const result = await pool.query(
        'SELECT COUNT(*) as count FROM issues WHERE id LIKE $1',
        ['ISS-2024-%']
    );
    const count = parseInt(result.rows[0].count) + 1;
    return `ISS-2024-${count.toString().padStart(3, '0')}`;
}

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seed...\n');

        for (const issue of sampleIssues) {
            const issueId = await generateIssueId();
            const reportedDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Random date within last 7 days

            // Calculate age in hours
            const ageInHours = Math.floor((Date.now() - reportedDate.getTime()) / (1000 * 60 * 60));

            // Determine if SLA is breached (if older than 48 hours and not resolved)
            const slaBreached = ageInHours > 48 && issue.status !== 'RESOLVED';

            // Insert issue
            await pool.query(
                `INSERT INTO issues (
          id, title, description, category, status,
          address, ward, city, latitude, longitude,
          reporter_name, reporter_phone,
          assigned_department, assigned_officer_name,
          images, reported_date, updated_date,
          sla_breached, age_in_hours
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
                [
                    issueId,
                    issue.title,
                    issue.description,
                    issue.category,
                    issue.status,
                    issue.address,
                    issue.ward,
                    issue.city,
                    issue.lat,
                    issue.lng,
                    issue.reporterName,
                    issue.reporterPhone,
                    issue.assignedDepartment || null,
                    issue.assignedOfficerName || null,
                    JSON.stringify(issue.images),
                    reportedDate,
                    new Date(),
                    slaBreached,
                    ageInHours,
                ]
            );

            // Create initial history entry
            await pool.query(
                `INSERT INTO issue_history (issue_id, timestamp, status, updated_by, department, notes)
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    issueId,
                    reportedDate,
                    'NEW',
                    'System',
                    issue.category,
                    'Issue reported by citizen',
                ]
            );

            // Add additional history entries for non-NEW statuses
            if (issue.status !== 'NEW') {
                const acknowledgedDate = new Date(reportedDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours after report
                await pool.query(
                    `INSERT INTO issue_history (issue_id, timestamp, status, updated_by, department, notes)
           VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        issueId,
                        acknowledgedDate,
                        'ACKNOWLEDGED',
                        issue.assignedOfficerName || 'System',
                        issue.assignedDepartment || issue.category,
                        'Issue acknowledged and assigned',
                    ]
                );
            }

            if (issue.status === 'IN_PROGRESS' || issue.status === 'RESOLVED') {
                const inProgressDate = new Date(reportedDate.getTime() + 12 * 60 * 60 * 1000); // 12 hours after report
                await pool.query(
                    `INSERT INTO issue_history (issue_id, timestamp, status, updated_by, department, notes)
           VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        issueId,
                        inProgressDate,
                        'IN_PROGRESS',
                        issue.assignedOfficerName || 'System',
                        issue.assignedDepartment || issue.category,
                        'Work started on the issue',
                    ]
                );
            }

            if (issue.status === 'RESOLVED') {
                const resolvedDate = new Date(reportedDate.getTime() + 48 * 60 * 60 * 1000); // 48 hours after report
                await pool.query(
                    `INSERT INTO issue_history (issue_id, timestamp, status, updated_by, department, notes)
           VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        issueId,
                        resolvedDate,
                        'RESOLVED',
                        issue.assignedOfficerName || 'System',
                        issue.assignedDepartment || issue.category,
                        'Issue resolved successfully',
                    ]
                );
            }

            console.log(`✅ Created issue: ${issueId} - ${issue.title}`);
        }

        console.log(`\n🎉 Successfully seeded ${sampleIssues.length} issues!`);
        console.log('You can now test your application with real data.\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
