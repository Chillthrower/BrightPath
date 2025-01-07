"use client"

import { motion } from 'framer-motion';
import { Brain, BookOpen, MessageSquare, Clock, Target, Lightbulb, Activity, Mic, PenTool } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ProgressChart } from './ProgressChart';
import { MilestoneCard } from './MilestoneCard';
import { EmotionTracker } from './EmotionTracker';
import { CommunicationCard } from './CommunicationCard';
import { AISuggestionsCard } from './AISuggestionsCard';
import Background from './Background_copy';
import Sidebar from './Sidebar';

const analyticalData = [
  { name: 'Game 1', value: 80, color: '#4ADE80' },
  { name: 'Game 2', value: 65, color: '#FCD34D' },
  { name: 'Game 3', value: 90, color: '#4ADE80' },
  { name: 'Quiz', value: 75, color: '#FCD34D' },
];

const understandingData = [
  { month: 'Jan', value: 30 },
  { month: 'Feb', value: 45 },
  { month: 'Mar', value: 60 },
  { month: 'Apr', value: 80 },
];

const timeSpentData = [
  { name: 'Games', value: 40, color: '#FF4B91' },
  { name: 'Learning', value: 35, color: '#65B741' },
  { name: 'Communication', value: 25, color: '#4477CE' },
];

const consistencyData = [
  { day: 'Mon', value: 3 },
  { day: 'Tue', value: 2 },
  { day: 'Wed', value: 3 },
  { day: 'Thu', value: 1 },
  { day: 'Fri', value: 2 },
  { day: 'Sat', value: 4 },
  { day: 'Sun', value: 3 },
];

const milestones = [
  {
    id: '1',
    title: 'First Quiz Completed',
    achieved: true,
    icon: 'trophy' as const,
    date: '2 days ago'
  },
  {
    id: '2',
    title: '10 Games Played',
    achieved: true,
    icon: 'star' as const,
    date: '1 week ago'
  },
  {
    id: '3',
    title: 'Vocabulary Master',
    achieved: false,
    icon: 'award' as const
  },
];

const emotions = [
  { type: 'happy' as const, count: 15, percentage: 75 },
  { type: 'neutral' as const, count: 4, percentage: 20 },
  { type: 'sad' as const, count: 1, percentage: 5 },
];

const communicationSkills = [
  { name: 'Verbal Skills', value: 85, icon: Mic },
  { name: 'Written Skills', value: 78, icon: PenTool },
  { name: 'Comprehension', value: 90, icon: BookOpen },
];

const aiSuggestions = [
  { id: '1', suggestion: "Try interactive vocabulary games to boost language skills", category: "Language Development" },
  { id: '2', suggestion: "Incorporate more outdoor activities to improve motor skills", category: "Physical Development" },
  { id: '3', suggestion: "Practice basic coding exercises to enhance logical thinking", category: "Cognitive Skills" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen relative">
      <Background />
      <Sidebar />
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Title */}
          <motion.h1 
            className="text-4xl font-bold text-gray-800 text-center mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Child Development Dashboard
          </motion.h1>

          {/* Top Metrics */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MetricCard
              title="Analytical Skills"
              value={85}
              icon={Brain}
              color="#FF4B91"
              subtitle="Cognitive Growth +15%"
              unit="%"
            />
            <MetricCard
              title="Understanding"
              value={78}
              icon={Lightbulb}
              color="#65B741"
              subtitle="15 Topics Learned"
              unit="%"
            />
            <MetricCard
              title="Communication"
              value={92}
              icon={MessageSquare}
              color="#4477CE"
              subtitle="2nd Grade Level"
              unit="%"
            />
            <MetricCard
              title="Time Spent"
              value={10.5}
              icon={Clock}
              color="#FFB534"
              subtitle="Hours this week"
            />
          </motion.div>

          {/* Charts Row 1 */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ProgressChart
              title="Analytical Performance"
              data={analyticalData}
              color="#FF4B91"
              type="bar"
              dataKey="value"
              xAxisKey="name"
              height={200}
              lastUpdated="1 hour ago"
              tooltipFormatter={(value) => `${value}%`}
            />
            <ProgressChart
              title="Understanding Progress"
              data={understandingData}
              color="#65B741"
              type="line"
              dataKey="value"
              xAxisKey="month"
              height={200}
              lastUpdated="today"
              tooltipFormatter={(value) => `${value}%`}
            />
          </motion.div>

          {/* Communication and Weekly Consistency */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <CommunicationCard skills={communicationSkills} />
            <ProgressChart
              title="Weekly Consistency"
              data={consistencyData}
              color="#FFB534"
              type="bar"
              dataKey="value"
              xAxisKey="day"
              height={200}
              lastUpdated="just now"
              tooltipFormatter={(value) => `${value} sessions`}
            />
          </motion.div>

          {/* Charts Row 2 */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <ProgressChart
              title="Time Distribution"
              data={timeSpentData}
              color="#4477CE"
              type="pie"
              dataKey="value"
              height={200}
              lastUpdated="2 hours ago"
              tooltipFormatter={(value) => `${value}%`}
            />
            <AISuggestionsCard suggestions={aiSuggestions} />
          </motion.div>

          {/* Bottom Row */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <EmotionTracker
              emotions={emotions}
              trend="positive"
              focusTime={45}
              responseTime={2.5}
            />
            <MilestoneCard milestones={milestones} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

