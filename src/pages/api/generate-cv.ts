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
        const currentMonth = new Date().getMonth() + 1;

        // Parse date to sortable number (YYYYMM format)
        // "Ongoing" = highest priority, "05.2025" = 202505, "01.2024 - 02.2024" uses end date
        const parseDateToNumber = (dateString: string): number => {
            if (dateString.toLowerCase().includes('ongoing')) {
                return 999999; // Highest priority for ongoing
            }

            // Handle date ranges like "10.2022 - 06.2023" - use end date
            const rangeParts = dateString.split('-').map(s => s.trim());
            const dateToUse = rangeParts.length > 1 ? rangeParts[1] : rangeParts[0];

            // Match MM.YYYY or DD.MM.YYYY
            const match = dateToUse.match(/(\d{1,2})\.(\d{4})/);
            if (match) {
                const month = parseInt(match[1]);
                const year = parseInt(match[2]);
                // For DD.MM.YYYY format, check if first number > 12
                if (month > 12) {
                    // It's DD.MM.YYYY, need to re-parse
                    const fullMatch = dateToUse.match(/\d{1,2}\.(\d{1,2})\.(\d{4})/);
                    if (fullMatch) {
                        return parseInt(fullMatch[2]) * 100 + parseInt(fullMatch[1]);
                    }
                }
                return year * 100 + month;
            }

            // Fallback - just extract year
            const yearMatch = dateToUse.match(/\b(20\d{2})\b/);
            return yearMatch ? parseInt(yearMatch[1]) * 100 : currentYear * 100 + currentMonth;
        };

        // Function to extract the year from a date (for grouping)
        const extractYear = (dateString: string): number => {
            const yearMatch = dateString.match(/\b(20\d{2})\b/);
            return yearMatch ? parseInt(yearMatch[1]) : currentYear;
        };

        const cutoffYear = currentYear - 1;

        // Filter and map projects with types and sort value
        const allProjects: (ProjectForCV & { year: number; sortValue: number })[] = (phpData.projects || []).map((proj: ProjectForCV) => {
            const dateStr = 'date' in proj ? String(proj.date) : 'Not specified';
            return {
                name: proj.name,
                date: dateStr,
                info: 'info' in proj ? String(proj.info) : 'No description',
                skills: proj.skills || [],
                year: extractYear(dateStr),
                sortValue: parseDateToNumber(dateStr)
            };
        });

        // Sort all projects by date (newest first)
        allProjects.sort((a, b) => b.sortValue - a.sortValue);

        // Projects to be fully displayed (last year)
        const recentProjects = allProjects
            .filter(proj => proj.year >= cutoffYear)
            .map(({ year, sortValue, ...proj }) => proj);

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

        // Create grouped projects (sorted newest year first)
        const groupedOlderProjects: ProjectForCV[] = Object.entries(olderProjectsByYear)
            .sort(([a], [b]) => parseInt(b) - parseInt(a))
            .map(([year, projects]) => ({
                name: `Various projects from ${year}`,
                date: `${year}`,
                info: projects.join(', '),
                skills: [],
                isGrouped: true
            }));

        // Combine projects—first new ones (sorted), then grouped old ones
        const filteredProjects: ProjectForCV[] = [...recentProjects, ...groupedOlderProjects];

        // Sort experience by date (newest first)
        const sortedExperience = (phpData.experience || [])
            .map((exp: ExperienceForCV) => ({
                title: exp.title,
                company: exp.company,
                date: 'date' in exp ? String(exp.date) : 'Not specified',
                info: 'info' in exp ? String(exp.info) : 'No description',
                sortValue: parseDateToNumber('date' in exp ? String(exp.date) : 'Not specified')
            }))
            .sort((a, b) => b.sortValue - a.sortValue)
            .map(({ sortValue, ...exp }) => exp);

        const cvData: CVData = {
            experience: sortedExperience,
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