import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { MapInput } from './buildMapHtml';
import { styles } from './styles';
import { useWardMapHtml } from './useWardMapHtml';

// Display-only Leaflet map of the ward outline + live GPS pin. The caller
// captures native GPS and passes it in as `position`.
export default function WardMapWebView(props: MapInput) {
  const html = useWardMapHtml(props);
  return (
    <View style={styles.wrap}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.web}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}
