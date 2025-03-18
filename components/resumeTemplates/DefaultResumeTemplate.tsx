import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { GeneratedData } from "../../types/generatedResumeInfoType";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  section: { marginBottom: 10 },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  text: { fontSize: 12, marginBottom: 5 },
  headerText: { fontSize: 12, marginBottom: 5, textAlign: "center" },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: 10,
  }, // Fixed border radius
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 12, color: "#666" },
  listItem: { marginBottom: 3 },
});

const DefaultResumeTemplate = ({
  generatedData,
  resumeImage,
}: {
  generatedData: GeneratedData;
  resumeImage: string;
}) => {
  if (!generatedData) return null;

  const { candidate, resume } = generatedData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Profile Section */}
        <View style={styles.section}>
          {resumeImage && (
            <Image src={resumeImage} style={styles.profileImage} />
          )}
          <Text style={styles.header}>{candidate.name}</Text>
          <Text style={styles.headerText}>
            {candidate.contact.email} | {candidate.contact.phone}
          </Text>
          <Text style={styles.headerText}>{candidate.contact.address}</Text>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.title}>Summary</Text>
          <Text style={styles.text}>{resume.summary}</Text>
        </View>

        {/* Work Experience */}
        {resume.workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Work Experience</Text>
            {resume.workExperience.map((job, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={styles.subtitle}>
                  {job.title} - {job.company}
                </Text>
                <Text style={styles.text}>
                  {job.location} | {job.dates}
                </Text>
                <Text style={styles.text}>{job.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Education</Text>
            {resume.education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={styles.subtitle}>
                  {edu.degree} in {edu.field}
                </Text>
                <Text style={styles.text}>
                  {edu.institution}, {edu.location} | {edu.graduationDate}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.title}>Skills</Text>
          {resume.skills.map((skill, index) => (
            <Text key={index} style={styles.listItem}>
              • {skill}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default DefaultResumeTemplate;
