import { NextApiRequest, NextApiResponse } from 'next';
import { CVData } from '@/lib/types';

import skillsData from '@/pages/data/Skills.json';
import devopsData from '@/pages/data/DevOps.json';
import phpData from '@/pages/data/PHP.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse<CVData | { error: string }>) {
    try {
        const cvData: CVData = {
            experience: (phpData.experience || []).map(exp => ({
                title: exp.title,
                company: exp.company,
                date: 'date' in exp ? String(exp.date) : 'Not specified',
                info: 'info' in exp ? String(exp.info) : 'No description',
            })),
            projects: (phpData.projects || []).map(proj => ({
                name: proj.name,
                date: 'date' in proj ? String(proj.date) : 'Not specified',
                info: 'info' in proj ? String(proj.info) : 'No description',
                skills: proj.skills || [],
            })),
            devops: devopsData.devopsItems || [],
            skills: skillsData.skills || []
        };

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(cvData);
    } catch (error) {
        console.error('Error generating CV data:', error);
        res.status(500).json({ error: 'Failed to generate CV data' });
    }
}