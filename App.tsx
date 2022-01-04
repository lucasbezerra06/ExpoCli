import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button, ToastAndroid} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Clipboard from 'expo-clipboard';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');

  const askForCameraPermission = async () => {
    const {status} = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = ({type, data}: {type: string; data: string}) => {
    setScanned(true);
    setText(data);
    console.log(`Type: ${type} \nData: ${data}`);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={{margin: 10}}>No acess to camera</Text>
        <Button title="Allow Camera" onPress={askForCameraPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{height: 400, width: 400}}
        />
      </View>
      <Text style={styles.maintext}>{text}</Text>

      {scanned && (
        <View>
          <View style={{marginBottom: 5}}>
            <Button
              title="Scan again?"
              onPress={() => setScanned(false)}
              color="tomato"
            />
          </View>
          <Button
            title="Copy Code?"
            onPress={() => {
              ToastAndroid.show('code copied!', ToastAndroid.SHORT);
              Clipboard.setString(text);
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
    color: 'black',
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato',
  },
});
