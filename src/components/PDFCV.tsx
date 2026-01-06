import React from 'react';
import { Document, Page, Text, View, StyleSheet, BlobProvider, Font } from '@react-pdf/renderer';
import { CVData, ExperienceForCV, ProjectForCV, SysDevOps, Skill, Job } from '@/lib/types';

Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2' },
        { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.woff2', fontWeight: 'bold' },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: 'Helvetica',
        fontSize: 9,
        lineHeight: 1.3,
    },
    header: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center',
        color: '#ff5500',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 6,
    },
    sectionHeader: {
        fontSize: 10,
        marginBottom: 4,
        color: '#ff5500',
        fontWeight: 'bold',
        borderBottom: '1pt solid #ff5500',
        paddingBottom: 2,
    },
    item: {
        marginBottom: 4,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 1,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 9,
    },
    itemDate: {
        color: '#666',
        fontSize: 8,
    },
    itemContent: {
        fontSize: 8,
        textAlign: 'justify',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 3,
        marginTop: 3,
    },
    skillTag: {
        backgroundColor: '#ff5500',
        color: 'white',
        borderRadius: 2,
        paddingHorizontal: 3,
        paddingVertical: 1,
        fontSize: 7,
    },
    twoColumns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    column: {
        width: '48%',
    },
    noDescription: {
        fontSize: 8,
        color: '#999',
        fontStyle: 'italic',
    },
    contactLinkStyle: {
        textAlign: 'center',
        fontSize: 9,
        textDecoration: 'underline',
        marginBottom: 2,
    },
    groupedProject: {
        marginBottom: 3,
        opacity: 0.8,
    },
    groupedProjectTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: 'black',

    },
    groupedProjectContent: {
        fontSize: 8,
        color: 'black',
    }
});

interface PDFCVProps {
    cvData: CVData;
}

// Truncate text to max length
const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

const PDFCV: React.FC<PDFCVProps> = ({ cvData }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* HEADER */}
                <Text style={styles.header}>ALEKSANDER ZAK</Text>
                <Text style={{ textAlign: 'center', fontSize: 10, marginBottom: 4, color: '#666' }}>
                    PHP Developer | Bydgoszcz, Poland
                </Text>
                <Text style={styles.contactLinkStyle}>EMAIL: olek1305@gmail.com</Text>
                <Text style={{ textAlign: 'center', fontSize: 9 }}>
                    Github: https://github.com/olek1305
                </Text>
                <Text style={{ textAlign: 'center', fontSize: 9 }}>
                    TEL: 794 928 618,{' '}
                    <Text style={{ color: '#e64d00' }}>
                        I&#39;m deaf, please contact me by SMS or email.
                    </Text>
                </Text>
                <Text style={{ textAlign: 'center', marginBottom: 2, fontSize: 9 }}>
                    PORTFOLIO: https://portfolio-rho-three-26.vercel.app/
                </Text>

                {/* EMPLOYMENT SECTION */}
                {cvData.jobs && cvData.jobs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>EMPLOYMENT</Text>
                        {cvData.jobs.map((job: Job, index: number) => (
                            <View key={index} style={styles.item} wrap={false}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>
                                        {job.title} • {job.company}
                                    </Text>
                                    <Text style={styles.itemDate}>{job.date || 'Not specified'}</Text>
                                </View>
                                {job.info && <Text style={styles.itemContent}>{job.info}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {/* EXPERIENCE SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>EDUCATION & COURSES</Text>
                    {cvData.experience.map((exp: ExperienceForCV, index: number) => (
                        <View key={index} style={styles.item} wrap={false}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>
                                    {exp.title} • {exp.company}
                                </Text>
                                <Text style={styles.itemDate}>{exp.date || 'Not specified'}</Text>
                            </View>
                            <Text style={styles.itemContent}>{exp.info}</Text>
                        </View>
                    ))}
                </View>

                {/* TWO COLUMNS LAYOUT */}
                <View style={styles.twoColumns}>

                    {/* LEFT COLUMN - PROJECTS & LANGUAGE */}
                    <View style={styles.column}>

                        {/* PROJECTS SECTION */}
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>
                                PROJECTS ({cvData.projects.length})
                            </Text>

                            {/* Render all projects */}
                            {cvData.projects.map((project: ProjectForCV, index: number) => (
                                <View
                                    key={index}
                                    style={
                                        project.name.includes('Various projects')
                                            ? styles.groupedProject
                                            : styles.item
                                    }
                                    wrap={false}
                                >
                                    <View style={styles.itemHeader}>
                                        <Text style={
                                            project.name.includes('Various projects')
                                                ? styles.groupedProjectTitle
                                                : styles.itemTitle
                                        }>
                                            {project.name}
                                        </Text>
                                        <Text style={styles.itemDate}>{project.date || 'Not specified'}</Text>
                                    </View>
                                    <Text style={
                                        project.name.includes('Various projects')
                                            ? styles.groupedProjectContent
                                            : styles.itemContent
                                    }>
                                        {truncateText(project.info, 120)}
                                    </Text>
                                    {project.skills && project.skills.length > 0 && (
                                        <View style={styles.skillsContainer}>
                                            {project.skills.slice(0, 8).map((skill: string, i: number) => (
                                                <Text key={i} style={styles.skillTag}>
                                                    {skill}
                                                </Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* LANGUAGE SECTION */}
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>LANGUAGE</Text>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>Polish - Native</Text>
                                <Text style={styles.itemTitle}>English - B2</Text>
                            </View>
                        </View>
                    </View>

                    {/* RIGHT COLUMN - SKILLS & DEVOPS */}
                    <View style={styles.column}>

                        {/* TECHNICAL SKILLS SECTION */}
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>TECHNICAL SKILLS</Text>
                            <View style={styles.skillsContainer}>
                                {cvData.skills.map((skill: Skill, index: number) => (
                                    <Text key={index} style={styles.skillTag}>
                                        {skill.name}
                                    </Text>
                                ))}
                            </View>
                        </View>

                        {/* SysAdm & DEVOPS SECTION */}
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>DEVOPS & SYSADMIN</Text>
                            {cvData.sysdevops.slice(0, 4).map((item: SysDevOps, index: number) => (
                                <View key={index} style={styles.item} wrap={false}>
                                    <View style={styles.itemHeader}>
                                        <Text style={styles.itemTitle}>{item.title}</Text>
                                        <Text style={styles.itemDate}>{item.date || 'Not specified'}</Text>
                                    </View>
                                    <Text style={styles.itemContent}>{truncateText(item.info || '', 100)}</Text>
                                    {item.skills && item.skills.length > 0 && (
                                        <View style={styles.skillsContainer}>
                                            {item.skills.slice(0, 8).map((skill: string, i: number) => (
                                                <Text key={i} style={styles.skillTag}>
                                                    {skill}
                                                </Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* FOOTER - GDPR */}
                <View style={{ marginTop: 8, borderTop: '1pt solid #eee', paddingTop: 4 }}>
                    <Text style={{ fontSize: 7, textAlign: 'center', color: '#666' }}>
                        I consent to processing my personal data for recruitment purposes (GDPR 2016/679).
                    </Text>
                </View>

                {/* FOOTER - GENERATED INFO */}
                <View style={{ marginTop: 8, borderTop: '1pt solid #eee', paddingTop: 4 }}>
                    <Text style={{ fontSize: 7, textAlign: 'center', color: '#666' }}>
                        Automatically generated • Last update: {new Date().toLocaleDateString()}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

interface ViewCVButtonProps {
    cvData: CVData | null;
}

export const ViewCVButton: React.FC<ViewCVButtonProps> = ({ cvData }) => {
    if (!cvData) {
        return <span className="text-orange-500 text-sm">▼ Preparing resume...</span>;
    }

    return (
        <BlobProvider document={<PDFCV cvData={cvData} />}>
            {({ url, loading }) => (
                <button
                    onClick={() => url && window.open(url, '_blank')}
                    disabled={loading || !url}
                    className="text-orange-500 text-sm hover:text-white no-underline cursor-pointer disabled:opacity-50 disabled:cursor-wait bg-transparent border-none"
                >
                    {loading ? 'Generating CV...' : '▼ View CV (PDF)'}
                </button>
            )}
        </BlobProvider>
    );
};

// Keep backwards compatibility
export const DownloadCVButton = ViewCVButton;

export default PDFCV;