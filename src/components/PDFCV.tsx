import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { CVData, ExperienceForCV, ProjectForCV, DevOpsItem, Skill } from '@/lib/types';

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
    }
});

interface PDFCVProps {
    cvData: CVData;
}

const PDFCV: React.FC<PDFCVProps> = ({ cvData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>ALEKSANDER ZAK, BYDGOSZCZ POLAND</Text>
            <Text style={styles.header}>
                PHP Developer | DevOps
            </Text>
            <Text style={styles.contactLinkStyle}>EMAIL: olek1305@gmail.com</Text>
            <Text style={{ textAlign: 'center', fontSize: 9 }}>
                Github: https://github.com/olek1305
            </Text>
            <Text style={{ textAlign: 'center', fontSize: 9 }}>
                TEL: 794 928 618,{' '}
                <Text style={{ color: '#e64d00' }}>
                    I’m deaf, please contact me by SMS or email.
                </Text>
            </Text>
            <Text style={{ textAlign: 'center', marginBottom: 2, fontSize: 9 }}>
                PORTFOLIO: https://portfolio-git-master-olek1305s-projects.vercel.app/
            </Text>

            {/* Experience Section */}
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>PROFESSIONAL EXPERIENCE</Text>
                {cvData.experience.map((exp: ExperienceForCV, index: number) => (
                    <View key={index} style={styles.item} wrap={false}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemTitle}>
                                {exp.title} • {exp.company}
                            </Text>
                            <Text style={styles.itemDate}>{exp.date || 'Not specified'}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.twoColumns}>
                {/* Projects Column */}
                <View style={styles.column}>
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>PROJECTS</Text>
                        {cvData.projects.map((project: ProjectForCV, index: number) => (
                            <View key={index} style={styles.item} wrap={false}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{project.name}</Text>
                                    <Text style={styles.itemDate}>{project.date || 'Not specified'}</Text>
                                </View>
                                <Text style={project.info ? styles.itemContent : styles.noDescription}>
                                    {project.info || 'No description available'}
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
                    <View style={styles.column}>
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>LANGUAGE</Text>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>Polish - Native</Text>
                                <Text style={styles.itemTitle}>English - B2</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Skills Column */}
                <View style={styles.column}>
                    {/* Technical Skills */}
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

                    {/* DevOps Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>DEVOPS EXPERIENCE</Text>
                        {cvData.devops.map((item: DevOpsItem, index: number) => (
                            <View key={index} style={styles.item} wrap={false}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemDate}>{item.date || 'Not specified'}</Text>
                                </View>
                                <Text style={styles.itemContent}>{item.info}</Text>
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

            <View style={{ marginTop: 8, borderTop: '1pt solid #eee', paddingTop: 4 }}>
                <Text style={{ fontSize: 7, textAlign: 'center', color: '#666' }}>
                    I agree to the processing of personal data
                    provided in this document for realising the
                    recruitment process pursuant to the Personal
                    Data Protection Act of 10 May 2018 (Journal
                    of Laws 2018, item 1000) and in agreement
                    with Regulation (EU) 2016/679 of the
                    European Parliament and of the Council of 27
                    April 2016 on the protection of natural
                    persons with regard to the processing of
                    personal data and on the free movement of
                    such data, and repealing Directive 95/46/EC
                    (General Data Protection Regulation).
                </Text>
            </View>

            <View style={{ marginTop: 8, borderTop: '1pt solid #eee', paddingTop: 4 }}>
                <Text style={{ fontSize: 7, textAlign: 'center', color: '#666' }}>
                    Automatically generated • Last update: {new Date().toLocaleDateString()}
                </Text>
            </View>
        </Page>
    </Document>
);

interface DownloadCVButtonProps {
    cvData: CVData | null;
}

export const DownloadCVButton: React.FC<DownloadCVButtonProps> = ({ cvData }) => {
    if (!cvData) {
        return <span className="text-orange-500 text-sm">▼ Preparing resume...</span>;
    }

    return (
        <PDFDownloadLink
            document={<PDFCV cvData={cvData} />}
            fileName="aleksander-zak-cv.pdf"
            className="text-orange-500 text-sm hover:text-white no-underline"
        >
            {({ loading }: { loading: boolean }) =>
                loading ? 'Generating CV...' : '▼ Download CV (PDF)'
            }
        </PDFDownloadLink>
    );
};

export default PDFCV;