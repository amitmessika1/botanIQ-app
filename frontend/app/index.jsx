/*import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LoginScreen from './loginScreen';

export default function App() {
  return <LoginScreen/>;
}  */

/*import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/loginScreen" />;
}*/

import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { getToken } from "./services/token";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return token ? (
    <Redirect href="/(tabs)/homeScreen" />
  ) : (
    <Redirect href="/loginScreen" />
  );
}


