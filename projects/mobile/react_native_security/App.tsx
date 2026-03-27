import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  PermissionsAndroid,
  Linking,
  Dimensions,
} from 'react-native';

interface SecurityScore {
  overall: number;
  network: number;
  apps: number;
  permissions: number;
  device: number;
}

interface ScanResult {
  id: string;
  type: 'network' | 'app' | 'permission' | 'device';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  timestamp: Date;
}

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'dashboard' | 'scan' | 'tools' | 'settings'>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [wifiPassword, setWifiPassword] = useState('');
  
  const [securityScore, setSecurityScore] = useState<SecurityScore>({
    overall: 85,
    network: 90,
    apps: 80,
    permissions: 75,
    device: 95,
  });

  const [scanResults, setScanResults] = useState<ScanResult[]>([
    {
      id: '1',
      type: 'network',
      title: 'Network Analysis Complete',
      description: 'All network connections analyzed and secured',
      severity: 'low',
      recommendation: 'Network security is optimal',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'app',
      title: 'Application Security Check',
      description: '45 applications scanned for vulnerabilities',
      severity: 'low',
      recommendation: 'No security threats detected',
      timestamp: new Date(),
    },
    {
      id: '3',
      type: 'permission',
      title: 'Permission Audit Complete',
      description: 'App permissions reviewed and secured',
      severity: 'medium',
      recommendation: 'Review app permissions regularly',
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    requestPermissions();
    const interval = setInterval(() => {
      setSecurityScore((prev: SecurityScore) => ({
        ...prev,
        overall: Math.min(100, prev.overall + Math.random() * 2 - 1)
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_WIFI_STATE,
          PermissionsAndroid.PERMISSIONS.CHANGE_WIFI_STATE,
        ]);
        console.log('Permissions granted:', granted);
      } catch (error) {
        console.warn('Permission request failed:', error);
      }
    }
  };

  const performSecurityScan = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newResults: ScanResult[] = [
        {
          id: Date.now().toString(),
          type: 'network',
          title: 'Real-time Network Scan',
          description: 'Network traffic analyzed for threats',
          severity: 'low',
          recommendation: 'Network is secure',
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'app',
          title: 'Application Vulnerability Scan',
          description: 'Deep scan of installed applications',
          severity: 'low',
          recommendation: 'All applications are secure',
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 2).toString(),
          type: 'device',
          title: 'Device Security Assessment',
          description: 'Device encryption and security settings verified',
          severity: 'low',
          recommendation: 'Device protection is active',
          timestamp: new Date(),
        },
      ];

      setScanResults((prev: ScanResult[]) => [...newResults, ...prev]);
      setSecurityScore((prev: SecurityScore) => ({
        ...prev,
        overall: Math.min(100, prev.overall + 3)
      }));

      Alert.alert('Scan Complete', 'Security scan completed successfully!');
    } catch (error) {
      Alert.alert('Scan Error', 'Failed to complete security scan');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string): string => {
    const colors = {
      critical: '#ef4444',
      high: '#f97316',
      medium: '#f59e0b',
      low: '#10b981'
    };
    return colors[severity as keyof typeof colors] || '#6b7280';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const SecurityScoreCard = ({ title, score, iconName }: { 
    title: string; 
    score: number; 
    iconName: string 
  }) => (
    <View style={styles.scoreCard}>
      <Text style={styles.iconPlaceholder}>📊</Text>
      <Text style={styles.scoreTitle}>{title}</Text>
      <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>{score}%</Text>
    </View>
  );

  const ScanResultCard = ({ result }: { result: ScanResult }) => (
    <View style={[styles.resultCard, { borderLeftColor: getSeverityColor(result.severity) }]}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>{result.title}</Text>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(result.severity) }]}>
          <Text style={styles.severityText}>{result.severity.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.resultDescription}>{result.description}</Text>
      <Text style={styles.resultRecommendation}>💡 {result.recommendation}</Text>
      <Text style={styles.resultTime}>
        {result.timestamp.toLocaleTimeString()}
      </Text>
    </View>
  );

  const DashboardScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🛡️</Text>
        <Text style={styles.title}>Security Monitor</Text>
        <Text style={styles.subtitle}>Real-time protection</Text>
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.overallScore}>
          <Text style={styles.scoreLabel}>Overall Security</Text>
          <Text style={[styles.overallScoreValue, { color: getScoreColor(securityScore.overall) }]}>
            {securityScore.overall}%
          </Text>
        </View>
        
        <View style={styles.scoreGrid}>
          <SecurityScoreCard title="Network" score={securityScore.network} iconName="wifi" />
          <SecurityScoreCard title="Apps" score={securityScore.apps} iconName="apps" />
          <SecurityScoreCard title="Permissions" score={securityScore.permissions} iconName="lock" />
          <SecurityScoreCard title="Device" score={securityScore.device} iconName="device" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {scanResults.slice(0, 3).map((result: ScanResult) => (
          <ScanResultCard key={result.id} result={result} />
        ))}
      </View>
    </ScrollView>
  );

  const ScanScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🔍</Text>
        <Text style={styles.title}>Security Scan</Text>
        <Text style={styles.subtitle}>Comprehensive analysis</Text>
      </View>

      <TouchableOpacity 
        style={[styles.scanButton, isLoading && styles.scanButtonDisabled]}
        onPress={performSecurityScan}
        disabled={isLoading}
      >
        {isLoading ? (
          <Text style={styles.scanButtonText}>Scanning...</Text>
        ) : (
          <>
            <Text style={styles.scanButtonIcon}>🛡️</Text>
            <Text style={styles.scanButtonText}>Start Security Scan</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scan Results</Text>
        {scanResults.map((result: ScanResult) => (
          <ScanResultCard key={result.id} result={result} />
        ))}
      </View>
    </ScrollView>
  );

  const ToolsScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🔧</Text>
        <Text style={styles.title}>Security Tools</Text>
        <Text style={styles.subtitle}>Advanced utilities</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Analysis</Text>
        
        <View style={styles.toolCard}>
          <Text style={styles.toolTitle}>WiFi Security</Text>
          <Text style={styles.toolDescription}>Analyze WiFi network security</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter network name"
              value={wifiPassword}
              onChangeText={setWifiPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolButtonText}>Analyze Network</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toolCard}>
          <Text style={styles.toolTitle}>Port Scanner</Text>
          <Text style={styles.toolDescription}>Check open ports and vulnerabilities</Text>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolButtonText}>Launch Scanner</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Tools</Text>
        
        <View style={styles.toolCard}>
          <Text style={styles.toolTitle}>App Auditor</Text>
          <Text style={styles.toolDescription}>Review application permissions</Text>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolButtonText}>Audit Apps</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.toolCard}>
          <Text style={styles.toolTitle}>Device Info</Text>
          <Text style={styles.toolDescription}>Check device security status</Text>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const SettingsScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>⚙️</Text>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure protection</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scan Settings</Text>
        
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Auto Scan</Text>
            <Text style={styles.settingDescription}>Automatic security checks</Text>
          </View>
          <TouchableOpacity style={styles.toggle}>
            <View style={[styles.toggleCircle, styles.toggleActive]} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Real-time Protection</Text>
            <Text style={styles.settingDescription}>Background monitoring</Text>
          </View>
          <TouchableOpacity style={styles.toggle}>
            <View style={[styles.toggleCircle, styles.toggleActive]} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingDescription}>Security alerts</Text>
          </View>
          <TouchableOpacity style={styles.toggle}>
            <View style={styles.toggleCircle} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutTitle}>Version</Text>
          <Text style={styles.aboutValue}>2.0.0</Text>
        </View>

        <View style={styles.aboutItem}>
          <Text style={styles.aboutTitle}>Developer</Text>
          <Text style={styles.aboutValue}>Zeynep Sude</Text>
        </View>

        <View style={styles.aboutItem}>
          <Text style={styles.aboutTitle}>Security Engine</Text>
          <Text style={styles.aboutValue}>Advanced AI Protection</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderScreen = () => {
    switch (selectedTab) {
      case 'dashboard': 
        return <DashboardScreen />;
      case 'scan': 
        return <ScanScreen />;
      case 'tools': 
        return <ToolsScreen />;
      case 'settings': 
        return <SettingsScreen />;
      default: 
        return <DashboardScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      {renderScreen()}
      
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, selectedTab === 'dashboard' && styles.tabItemActive]}
          onPress={() => setSelectedTab('dashboard')}
        >
          <Text style={styles.tabIcon}>🛡️</Text>
          <Text style={[styles.tabText, selectedTab === 'dashboard' && styles.tabTextActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, selectedTab === 'scan' && styles.tabItemActive]}
          onPress={() => setSelectedTab('scan')}
        >
          <Text style={styles.tabIcon}>🔍</Text>
          <Text style={[styles.tabText, selectedTab === 'scan' && styles.tabTextActive]}>
            Scan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, selectedTab === 'tools' && styles.tabItemActive]}
          onPress={() => setSelectedTab('tools')}
        >
          <Text style={styles.tabIcon}>🔧</Text>
          <Text style={[styles.tabText, selectedTab === 'tools' && styles.tabTextActive]}>
            Tools
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, selectedTab === 'settings' && styles.tabItemActive]}
          onPress={() => setSelectedTab('settings')}
        >
          <Text style={styles.tabIcon}>⚙️</Text>
          <Text style={[styles.tabText, selectedTab === 'settings' && styles.tabTextActive]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  scoreContainer: {
    padding: 20,
  },
  overallScore: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 8,
    fontWeight: '600',
  },
  overallScoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  scoreCard: {
    width: '48%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconPlaceholder: {
    fontSize: 24,
    marginBottom: 8,
  },
  scoreTitle: {
    fontSize: 14,
    color: '#1f293b',
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  scanButtonDisabled: {
    backgroundColor: '#64748b',
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  scanButtonIcon: {
    fontSize: 24,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f293b',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  severityText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  resultDescription: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 20,
  },
  resultRecommendation: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 18,
  },
  resultTime: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
  toolCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f293b',
    marginBottom: 8,
  },
  toolDescription: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f8fafc',
  },
  textInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1f293b',
    backgroundColor: '#f8fafc',
  },
  eyeIcon: {
    fontSize: 20,
    marginLeft: 12,
  },
  toolButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  toolButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f293b',
    flex: 1,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    textAlign: 'right',
  },
  toggle: {
    width: 56,
    height: 28,
    backgroundColor: '#e2e8f0',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleActive: {
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.3,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f293b',
  },
  aboutValue: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 3,
    borderTopColor: 'transparent',
  },
  tabItemActive: {
    borderTopWidth: 3,
    borderTopColor: '#3b82f6',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
});

export default App;
