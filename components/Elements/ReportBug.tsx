import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type ReportBugProps = {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReportBug = ({ visible, onClose, loading, setLoading }: ReportBugProps) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://formcarry.com/s/GOShj72bapY', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });

      const data = await response.json();

      if (data.code === 200) {
        setSubmitted(true);
      } else {
        setError('Submission failed.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setEmail('');
    setMessage('');
    setSubmitted(false);
    setError('');
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={resetAndClose}
    >
      <TouchableOpacity style={styles.container} onPress={resetAndClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%' }}
        >
          <View
            style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
            
          >
            <View style={styles.modalView}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={styles.modalText}>Contact Us</Text>
                <MaterialCommunityIcons name="email-send-outline" size={20} color="#C62828" style={{ marginLeft: 5 }} />
              </View>

              {submitted ? (
                <Text style={{ color: '#C62828', fontFamily: 'Inter_18pt-Regular', marginBottom: 10 }}>
                  ✅ We've received your message!
                </Text>
              ) : (
                <>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Enter your email"
                      placeholderTextColor="#424242"
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Enter your message"
                      placeholderTextColor="#424242"
                      style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                      multiline
                      value={message}
                      onChangeText={setMessage}
                    />
                  </View>

                  {error ? (
                    <Text style={{ color: 'red', fontFamily: 'Inter_18pt-Regular', marginBottom: 6 }}>{error}</Text>
                  ) : null}

                  <TouchableOpacity
                    style={[styles.buttonCancel, { backgroundColor: loading ? '#9E9E9E' : '#C62828', alignSelf: 'center' }]}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#ECEFF1" />
                    ) : (
                      <Text style={{ color: '#ECEFF1', fontFamily: 'Inter_18pt-Regular' }}>Submit</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}

            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '85%',
    padding: 20,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
  },
  modalText: {
    color: '#ECEFF1',
    fontSize: 18,
    fontFamily: 'Inter_18pt-SemiBold',
  },
  inputContainer: {
    backgroundColor: '#121212',
    borderColor: '#C62828',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 8,
  },
  input: {
    fontFamily: 'Inter_18pt-Bold',
    color: '#ECEFF1',
    paddingVertical: 10,
  },
  buttonCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default ReportBug;
