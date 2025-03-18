import React from "react";
import {
  Page,
  Text,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Your provided data structure with the cover letter text
const coverLetterData = {
  coverLetter:
    "Dear Hiring Manager,\n\nI am excited to apply for the position at your esteemed company. With extensive experience in software development and project leadership, I am confident in my ability to contribute to your team's success. My previous roles have equipped me with the skills to solve complex problems, manage teams, and drive project success.\n\nThank you for considering my application. I look forward to the opportunity to discuss how I can bring value to your organization.\n\nSincerely,\nJohn Doe",
};

// Create styles for the PDF document
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFF",
    padding: 50,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
  },
});

// Define the PDF document component using the cover letter data
const DefaultCoverLetterTemplate = ({
  coverLetter,
}: {
  coverLetter: string;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Split the cover letter text by newline characters and render each line */}
      {coverLetter.split("\n").map((line, index) => (
        <Text style={styles.text} key={index}>
          {line}
        </Text>
      ))}
    </Page>
  </Document>
);

export default DefaultCoverLetterTemplate;
