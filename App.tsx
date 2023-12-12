/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-url-polyfill/auto';

import React, {useEffect, useRef} from 'react';
import type {PropsWithChildren} from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {QueryClient, QueryClientProvider, useQuery} from 'react-query';

import {installInterceptor, createMockServer} from '@matthieug/shm';
// @ts-ignore
import {MockServer} from '@matthieug/shm/dist/src/types';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Text>TEST</Text>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const mockServerRef = useRef<MockServer | null>(null);
  useEffect(() => {
    installInterceptor();

    const mockServer = createMockServer('http://example.com', {
      // options specified here will apply to all handlers
      delayMs: 500, // view your loading states
      persistent: true, // allow handlers to respond to multiple matching requests
    });

    mockServer.get('test', {
      response: {
        status: 200,
        body: {
          name: 'Test',
          description: 'Test Description',
        },
      },
    });

    mockServerRef.current = mockServer;
  }, []);

  const {isLoading, error, data} = useQuery('repoData', () =>
    fetch('http://example.com/test').then(res => res.json()),
  );

  if (isLoading) {
    return <Text>'Loading...'</Text>;
  }

  if (error) {
    console.log('error', error);
    return <Text>{'An error has occurred'}</Text>;
  }

  return (
    <Section title={'Mocks'}>
      <Text>{`– ${data.name}\n`}</Text>
      <Text>{`– ${data.description}\n`}</Text>
    </Section>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});

export default App;
