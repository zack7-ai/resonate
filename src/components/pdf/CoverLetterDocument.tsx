import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 72, // 1 inch margins
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
    color: "#000000",
  },
  header: {
    marginBottom: 24,
  },
  senderInfo: {
    marginBottom: 8,
    fontSize: 10,
  },
  date: {
    marginBottom: 24,
    fontSize: 10,
  },
  recipientInfo: {
    marginBottom: 24,
    fontSize: 10,
  },
  salutation: {
    marginBottom: 12,
    fontSize: 11,
  },
  content: {
    marginBottom: 12,
    fontSize: 11,
    lineHeight: 1.6,
    textAlign: "justify",
  },
  closing: {
    marginTop: 24,
    marginBottom: 8,
  },
  signature: {
    marginTop: 48,
  },
});

interface CoverLetterDocumentProps {
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  senderAddress?: string;
  recipientName?: string;
  recipientTitle?: string;
  companyName: string;
  companyAddress?: string;
  content: string;
  date?: string;
}

export const CoverLetterDocument = ({
  senderName,
  senderEmail,
  senderPhone,
  senderAddress,
  recipientName,
  recipientTitle,
  companyName,
  companyAddress,
  content,
  date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
}: CoverLetterDocumentProps) => {
  // Split content into paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Sender Info */}
        <View style={styles.header}>
          <Text style={styles.senderInfo}>{senderName}</Text>
          {senderAddress && <Text style={styles.senderInfo}>{senderAddress}</Text>}
          {senderEmail && <Text style={styles.senderInfo}>{senderEmail}</Text>}
          {senderPhone && <Text style={styles.senderInfo}>{senderPhone}</Text>}
        </View>

        {/* Date */}
        <Text style={styles.date}>{date}</Text>

        {/* Recipient Info */}
        <View style={styles.recipientInfo}>
          {recipientName && <Text>{recipientName}</Text>}
          {recipientTitle && <Text>{recipientTitle}</Text>}
          <Text>{companyName}</Text>
          {companyAddress && <Text>{companyAddress}</Text>}
        </View>

        {/* Salutation */}
        <Text style={styles.salutation}>
          Dear {recipientName ? recipientName.split(' ')[0] : 'Hiring Manager'}:
        </Text>

        {/* Content */}
        {paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.content}>
            {paragraph.trim()}
          </Text>
        ))}

        {/* Closing */}
        <View style={styles.closing}>
          <Text>Sincerely,</Text>
          <View style={styles.signature}>
            <Text>{senderName}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};


