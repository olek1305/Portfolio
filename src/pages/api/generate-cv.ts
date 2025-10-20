// generate-cv.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { CVData, ProjectForCV, ExperienceForCV } from '@/lib/types';

import skillsData from '@/pages/data/Skills.json';
import SysDevOpsData from '@/pages/data/SysDevOpsData.json';
import phpData from '@/pages/data/PHP.json';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CVData | { error: string }>
) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const currentYear = new Date().getFullYear();
        const cutoffYear = currentYear - 1;

        // Function to extract the year from a date
        const extractYear = (dateString: string): number => {
            const yearMatch = dateString.match(/\b(20\d{2})\b/);
            return yearMatch ? parseInt(yearMatch[1]) : currentYear;
        };

        // Filter and map projects with types
        const allProjects: (ProjectForCV & { year: number })[] = (phpData.projects || []).map((proj: ProjectForCV) => ({
            name: proj.name,
            date: 'date' in proj ? String(proj.date) : 'Not specified',
            info: 'info' in proj ? String(proj.info) : 'No description',
            skills: proj.skills || [],
            year: extractYear('date' in proj ? String(proj.date) : 'Not specified')
        }));

        // Projects to be fully displayed (last year)
        const recentProjects = allProjects
            .filter(proj => proj.year >= cutoffYear)
            .map(({ year, ...proj }) => proj);

        // Group old projects by year
        const olderProjectsByYear: { [year: number]: string[] } = {};
        allProjects
            .filter(proj => proj.year < cutoffYear)
            .forEach((proj) => {
                if (!olderProjectsByYear[proj.year]) {
                    olderProjectsByYear[proj.year] = [];
                }
                olderProjectsByYear[proj.year].push(proj.name);
            });

        // Create grouped projects
        const groupedOlderProjects: ProjectForCV[] = Object.entries(olderProjectsByYear)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .map(([year, projects]) => ({
                name: `Various projects from ${year}`,
                date: `${year}`,
                info: projects.join(', '),
                skills: [],
                isGrouped: true
            }));

        // We combine projects—first new ones, then grouped old ones.
        const filteredProjects: ProjectForCV[] = [...recentProjects, ...groupedOlderProjects];

        const cvData: CVData = {
            experience: (phpData.experience || []).map((exp: ExperienceForCV) => ({
                title: exp.title,
                company: exp.company,
                date: 'date' in exp ? String(exp.date) : 'Not specified',
                info: 'info' in exp ? String(exp.info) : 'No description',
            })),
            projects: filteredProjects,
            sysdevops: SysDevOpsData.sysdevops || [],
            skills: skillsData.skills || []
        };

        // Set proper headers
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

        return res.status(200).json(cvData);
    } catch (error) {
        console.error('Error generating CV data:', error);
        return res.status(500).json({ error: 'Failed to generate CV data' });
    }
}