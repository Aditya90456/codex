import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DSAScreen() {
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const problems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', companies: ['Google', 'Amazon'] },
    { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', category: 'Linked Lists', companies: ['Microsoft'] },
    { id: 3, title: 'Longest Substring', difficulty: 'Medium', category: 'Strings', companies: ['Facebook'] },
    { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', category: 'Arrays', companies: ['Google'] },
    { id: 5, title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stacks', companies: ['Amazon'] },
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredProblems = selectedDifficulty === 'All'
    ? problems
    : problems.filter(p => p.difficulty === selectedDifficulty);

  const toggleSolved = (id) => {
    const newSolved = new Set(solvedProblems);
    if (newSolved.has(id)) {
      newSolved.delete(id);
    } else {
      newSolved.add(id);
    }
    setSolvedProblems(newSolved);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const stats = {
    total: problems.length,
    solved: solvedProblems.size,
    easy: problems.filter(p => p.difficulty === 'Easy').length,
    medium: problems.filter(p => p.difficulty === 'Medium').length,
    hard: problems.filter(p => p.difficulty === 'Hard').length,
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>DSA 250</Text>
              <Text style={styles.subtitle}>Master Data Structures & Algorithms</Text>
            </View>
            <View style={styles.trophyBadge}>
              <Ionicons name="trophy" size={32} color="#f59e0b" />
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.solved}/{stats.total}</Text>
            <Text style={styles.statLabel}>Solved</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(stats.solved / stats.total) * 100}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.difficultyStats}>
            <View style={styles.difficultyCard}>
              <View style={[styles.difficultyDot, { backgroundColor: '#10b981' }]} />
              <Text style={styles.difficultyLabel}>Easy</Text>
              <Text style={styles.difficultyCount}>{stats.easy}</Text>
            </View>
            <View style={styles.difficultyCard}>
              <View style={[styles.difficultyDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.difficultyLabel}>Medium</Text>
              <Text style={styles.difficultyCount}>{stats.medium}</Text>
            </View>
            <View style={styles.difficultyCard}>
              <View style={[styles.difficultyDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.difficultyLabel}>Hard</Text>
              <Text style={styles.difficultyCount}>{stats.hard}</Text>
            </View>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {difficulties.map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.filterChip,
                  selectedDifficulty === diff && styles.filterChipActive,
                ]}
                onPress={() => setSelectedDifficulty(diff)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedDifficulty === diff && styles.filterChipTextActive,
                  ]}
                >
                  {diff}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Problems List */}
        <View style={styles.problemsContainer}>
          <Text style={styles.sectionTitle}>
            Problems ({filteredProblems.length})
          </Text>
          {filteredProblems.map((problem) => (
            <View key={problem.id} style={styles.problemCard}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => toggleSolved(problem.id)}
              >
                <Ionicons
                  name={solvedProblems.has(problem.id) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={28}
                  color={solvedProblems.has(problem.id) ? '#10b981' : '#475569'}
                />
              </TouchableOpacity>

              <View style={styles.problemContent}>
                <View style={styles.problemHeader}>
                  <Text style={styles.problemTitle}>{problem.title}</Text>
                  <View
                    style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(problem.difficulty) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        { color: getDifficultyColor(problem.difficulty) },
                      ]}
                    >
                      {problem.difficulty}
                    </Text>
                  </View>
                </View>

                <View style={styles.problemMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="folder" size={14} color="#94a3b8" />
                    <Text style={styles.metaText}>{problem.category}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="business" size={14} color="#94a3b8" />
                    <Text style={styles.metaText}>
                      {problem.companies.slice(0, 2).join(', ')}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.solveButton}>
                  <Ionicons name="code-slash" size={16} color="#3b82f6" />
                  <Text style={styles.solveButtonText}>Solve</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  trophyBadge: {
    width: 60,
    height: 60,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  difficultyStats: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  difficultyLabel: {
    flex: 1,
    fontSize: 12,
    color: '#94a3b8',
  },
  difficultyCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  filtersContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  problemsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  problemCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  problemContent: {
    flex: 1,
  },
  problemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  problemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  problemMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  solveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  solveButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
});
