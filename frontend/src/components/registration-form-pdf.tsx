'use client';

import React, { useState, useEffect } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Font,
} from '@react-pdf/renderer';
import { Button } from '../components/ui/button';
import { FileDown } from 'lucide-react';

// Register custom font
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    border: '2px solid #FF5733', // Adding border for visual appeal
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Roboto',
    marginBottom: 10,
    color: '#FF5733', // Using USMA branding color
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Roboto',
    marginBottom: 20,
    color: '#4CAF50', // Another color from the logo
  },
  photoBox: {
    width: 100,
    height: 120,
    border: '1px solid #cccccc',
    marginBottom: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontSize: 12,
    color: '#666666',
  },
  formField: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
    color: '#333333',
  },
  input: {
    height: 25,
    borderBottom: '1px dotted #999999',
    fontSize: 12,
    marginBottom: 5,
  },
  parentalConsent: {
    marginTop: 30,
    fontSize: 11,
    lineHeight: 1.5,
    color: '#444444',
  },
  signature: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  signatureBox: {
    width: 150,
    height: 50,
    border: '1px solid #cccccc',
    marginLeft: 10,
  },
  decorativeImage: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 100,
    height: 100,
    opacity: 0.2,
  },
  backgroundLogo: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 100,
    height: 100,
    opacity: 0.1,
  },
  medicalSection: {
    marginTop: 30,
    padding: 10,
    borderTop: '2px solid #FF5733',
    marginBottom: 30,
  },
  medicalLabel: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 5,
  },
  medicalInput: {
    height: 25,
    borderBottom: '1px dotted #999999',
    fontSize: 12,
    marginBottom: 5,
  },
  pageContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
});

// PDF Document component
const RegistrationForm = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src="/assets/download.jpeg" style={styles.logo} />
        <View>
          <Text style={styles.title}>CLUB DE TENNIS USMA ANNABA</Text>
          <Text style={styles.subtitle}>
            Fiche d'inscription aux entraînements
          </Text>
          <Text style={styles.subtitle}>ECOLE TENNIS:</Text>
        </View>
      </View>

      {/* Photo Box */}
      <View style={styles.photoBox}>
        <Text style={styles.photoText}>PHOTO</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.formField}>
        <Text style={styles.label}>Nom et prénom :</Text>
        <View style={styles.input} />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Date de naissance :</Text>
        <View style={styles.input} />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>SEXE :</Text>
        <View style={styles.input} />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>Adresse :</Text>
        <View style={styles.input} />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>NUMERO :</Text>
        <View style={styles.input} />
      </View>

      <View style={styles.formField}>
        <Text style={styles.label}>E-mail :</Text>
        <View style={styles.input} />
      </View>

      {/* Parental Authorization */}
      <View style={styles.parentalConsent}>
        <Text style={styles.label}>AUTORISATION PARENTALE :</Text>
        <Text>Je soussigné(e):</Text>
        <View style={styles.input} />
        <Text>Autorise mon enfant :</Text>
        <View style={styles.input} />
        <Text>
          à s'inscrire à l'USMA tennis et à participer aux diverses activités
          sportives et compétitions pour la saison sportive 2024/2025 et
          m'engage à respecter le règlement intérieur du club.
        </Text>
      </View>

      {/* Medical Certification Section */}
      <View style={styles.medicalSection}>
        <Text style={styles.medicalLabel}>CERTIFICAT MEDICAL :</Text>
        <Text>
          Le certificat médical est requis pour participer aux activités
          sportives.
        </Text>
        <View style={styles.medicalInput} />
        <Text style={styles.medicalLabel}>Date de validité :</Text>
        <View style={styles.medicalInput} />
      </View>

      {/* Signature */}
      <View style={styles.signature}>
        <Text style={styles.label}>SIGNATURE :</Text>
        <View style={styles.signatureBox} />
      </View>

      {/* Decorative Tennis Ball */}
      <Image
        src="/path_to_decorative_image.png"
        style={styles.decorativeImage}
      />
    </Page>
  </Document>
);

// Download button component
export default function DownloadRegistrationForm() {
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issues
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Button className="bg-green-600 hover:bg-green-500">
        <FileDown className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<RegistrationForm />}
      fileName="inscription_tennis_usma.pdf"
    >
      {({ loading }) => (
        <Button className="bg-green-600 hover:bg-green-500" disabled={loading}>
          <FileDown className="mr-2 h-4 w-4" />
          {loading ? 'Generating PDF...' : 'Download Registration Form'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
