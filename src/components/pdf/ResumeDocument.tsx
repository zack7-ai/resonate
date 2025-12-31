import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { ResumeData } from "@/stores/useResumeStore";

// Note: Using Helvetica as the default font (built-in to react-pdf)
// To use Roboto font, you would need to register it:
// Font.register({ family: "Roboto", src: "/path/to/roboto.ttf" });

const styles = StyleSheet.create({
  page: {
    padding: 54, // 0.75 inches = 54 points (72 points per inch) - Harvard/McKinsey standard
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5, // Slightly increased for readability
    color: "#000000",
  },
  header: {
    marginBottom: 16, // Increased spacing for cleaner look
  },
  name: {
    fontSize: 22, // Slightly reduced for more professional look
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5, // Subtle letter spacing for elegance
    marginBottom: 6,
    color: "#1a1a1a", // Slightly softer black
  },
  contactInfo: {
    fontSize: 9,
    marginBottom: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    color: "#333333",
  },
  contactItem: {
    marginRight: 10,
  },
  section: {
    marginTop: 14, // Increased spacing between sections
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1, // Professional letter spacing
    marginBottom: 8,
    borderBottomWidth: 1.5, // Slightly thicker line
    borderBottomColor: "#000000",
    paddingBottom: 3,
    color: "#1a1a1a",
  },
  experienceItem: {
    marginBottom: 12, // More space between experience entries
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    alignItems: "flex-start",
  },
  experienceCompany: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1a1a1a",
    flex: 1,
  },
  experienceLocation: {
    fontSize: 10,
    fontWeight: "normal",
    color: "#555555",
    textAlign: "right",
  },
  experienceTitle: {
    fontSize: 10,
    fontStyle: "italic",
    marginBottom: 3,
    color: "#333333",
  },
  experienceDate: {
    fontSize: 9,
    marginBottom: 5,
    color: "#666666",
  },
  experienceDescription: {
    fontSize: 9.5, // Slightly larger for readability
    marginBottom: 3,
    paddingLeft: 14, // Clean indentation
    lineHeight: 1.4,
    color: "#2a2a2a",
  },
  educationItem: {
    marginBottom: 10,
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    alignItems: "flex-start",
  },
  educationSchool: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1a1a1a",
    flex: 1,
  },
  educationLocation: {
    fontSize: 10,
    fontWeight: "normal",
    color: "#555555",
    textAlign: "right",
  },
  educationDegree: {
    fontSize: 10,
    fontStyle: "italic",
    marginBottom: 2,
    color: "#333333",
  },
  educationDate: {
    fontSize: 9,
    color: "#666666",
  },
  summary: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 1.6, // Increased for better readability
    color: "#2a2a2a",
    textAlign: "justify", // Professional justification
  },
  skills: {
    fontSize: 10,
    marginBottom: 3,
    color: "#2a2a2a",
    lineHeight: 1.5,
  },
  watermark: {
    position: "absolute",
    bottom: 54, // 0.75 inches from bottom
    left: 54,
    right: 54,
    textAlign: "center",
    fontSize: 8,
    color: "#999999",
    fontStyle: "italic",
  },
});

interface ResumeDocumentProps {
  data: ResumeData;
  subscriptionStatus?: string;
}

export const ResumeDocument = ({
  data,
  subscriptionStatus = "free",
}: ResumeDocumentProps) => {
  const showWatermark = subscriptionStatus !== "pro";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name.toUpperCase()}</Text>
          <View style={styles.contactInfo}>
            {data.email && (
              <Text style={styles.contactItem}>{data.email}</Text>
            )}
            {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
            {data.location && (
              <Text style={styles.contactItem}>{data.location}</Text>
            )}
            {data.linkedin && (
              <Link 
                src={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} 
                style={styles.contactItem}
              >
                {data.linkedin.replace(/^https?:\/\//, '')}
              </Link>
            )}
            {data.website && (
              <Link 
                src={data.website.startsWith('http') ? data.website : `https://${data.website}`} 
                style={styles.contactItem}
              >
                {data.website.replace(/^https?:\/\//, '')}
              </Link>
            )}
          </View>
        </View>

        {/* Summary */}
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.summary}>{data.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {data.experience.map((exp, index) => (
              <View key={exp.id || index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.experienceCompany}>{exp.company}</Text>
                  <Text style={styles.experienceLocation}>{exp.location}</Text>
                </View>
                <Text style={styles.experienceTitle}>{exp.title}</Text>
                <Text style={styles.experienceDate}>
                  {exp.startDate} - {exp.endDate || "Present"}
                </Text>
                {exp.description.map((desc, descIndex) => (
                  <Text key={descIndex} style={styles.experienceDescription}>
                    {desc ? `• ${desc}` : "•"}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View key={edu.id || index} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <Text style={styles.educationSchool}>
                    {edu.school}
                    {edu.degree && `, ${edu.degree}`}
                    {edu.field && ` in ${edu.field}`}
                  </Text>
                  <Text style={styles.educationLocation}>{edu.location}</Text>
                </View>
                <Text style={styles.educationDate}>
                  {edu.startDate} - {edu.endDate || "Present"}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skills}>{data.skills.join(" • ")}</Text>
          </View>
        )}

        {/* Watermark */}
        {showWatermark && (
          <Text style={styles.watermark}>Optimized by Resonate.ai</Text>
        )}
      </Page>
    </Document>
  );
};

