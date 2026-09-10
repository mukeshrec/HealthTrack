import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, borderRadius, shadows, spacing } from '../../theme';
import { API_BASE_URL } from '../../config/api';

interface RiskFlag {
  id: string;
  agentType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
}

interface ActiveRiskAlertsProps {
  patientId: string;
  token: string | null;
}

export function ActiveRiskAlerts({ patientId, token }: ActiveRiskAlertsProps) {
  const [risks, setRisks] = useState<RiskFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchRisks = async () => {
    if (!token || !patientId) return;
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/agents/${patientId}/risks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRisks(data);
        // If we found risks while analyzing, we can stop the analyzing state early
        if (data.length > 0) setIsAnalyzing(false);
      }
    } catch (error) {
      console.error('Failed to fetch risk alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, [patientId, token]);

  const triggerAgents = async () => {
    try {
      setIsAnalyzing(true);
      await fetch(`${API_BASE_URL}/agents/${patientId}/agents/run`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Poll multiple times and turn off analyzing UI after 12 seconds
      setTimeout(fetchRisks, 4000);
      setTimeout(fetchRisks, 8000);
      setTimeout(() => {
        fetchRisks();
        setIsAnalyzing(false);
      }, 12000);

    } catch (error) {
      console.error('Failed to trigger agents:', error);
      setIsAnalyzing(false);
    }
  };

  const dismissRisk = async (riskId: string) => {
    try {
      await fetch(`${API_BASE_URL}/agents/risks/${riskId}`, {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: 'DISMISSED' })
      });
      fetchRisks();
    } catch (error) {
      console.error('Failed to dismiss risk:', error);
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return { bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', bar: '#EF4444' };
      case 'HIGH':
        return { bg: '#FFF7ED', border: '#FDBA74', text: '#9A3412', bar: '#F97316' };
      default:
        return { bg: '#FEFCE8', border: '#FDE047', text: '#854D0E', bar: '#EAB308' };
    }
  };

  if (loading && risks.length === 0 && !isAnalyzing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary.blue} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isAnalyzing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE', borderWidth: 1 }]}>
        <ActivityIndicator size="small" color={colors.primary.blue} />
        <Text style={[styles.loadingText, { color: colors.primary.blue, fontWeight: '600' }]}>
          AI Agents analyzing timeline for Polypharmacy & Decline risks...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning" size={16} color="#DC2626" />
          </View>
          <Text style={styles.title}>Active AI Risk Alerts</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={styles.refreshBtn} onPress={fetchRisks}>
            <Ionicons name="refresh" size={16} color={colors.primary.blue} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.runBtn} onPress={triggerAgents}>
            <Text style={styles.runBtnText}>Run Analysis</Text>
          </TouchableOpacity>
        </View>
      </View>

      {risks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No active risks detected for this patient.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {risks.map((risk) => {
            const sevStyle = getSeverityStyle(risk.severity);
            return (
              <View key={risk.id} style={[styles.card, { backgroundColor: sevStyle.bg, borderColor: sevStyle.border }]}>
                <View style={[styles.severityBar, { backgroundColor: sevStyle.bar }]} />
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={styles.badgesRow}>
                      <View style={[styles.badge, { backgroundColor: sevStyle.border }]}>
                        <Text style={[styles.badgeText, { color: sevStyle.text }]}>{risk.severity}</Text>
                      </View>
                      <Text style={styles.agentText}>{risk.agentType.replace('_', ' ')}</Text>
                    </View>
                    <TouchableOpacity onPress={() => dismissRisk(risk.id)} style={styles.closeBtn}>
                      <Ionicons name="close" size={18} color={colors.text.tertiary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={[styles.riskTitle, { color: sevStyle.text }]}>{risk.title}</Text>
                  <Text style={styles.riskDescription}>{risk.description}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  loadingText: {
    ...typography.tiny,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#FEE2E2',
    padding: 6,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h3,
    fontWeight: '700',
    color: colors.text.primary,
  },
  runBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  runBtnText: {
    ...typography.tiny,
    fontWeight: '600',
    color: colors.primary.blue,
  },
  refreshBtn: {
    backgroundColor: '#EEF2FF',
    padding: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  emptyText: {
    ...typography.tiny,
    color: colors.text.secondary,
  },
  list: {
    gap: spacing.sm,
  },
  card: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.sm,
  },
  severityBar: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  agentText: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  closeBtn: {
    padding: 2,
  },
  riskTitle: {
    ...typography.bodySemibold,
    marginBottom: 4,
  },
  riskDescription: {
    ...typography.tiny,
    color: colors.text.secondary,
    lineHeight: 18,
  }
});
