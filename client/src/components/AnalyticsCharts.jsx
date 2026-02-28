import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

export default function AnalyticsCharts({ course }) {
    if (!course || !course.modules) return null;

    // Data for Lessons per Module Bar Chart
    const moduleData = course.modules.map((m, i) => ({
        name: `M${i + 1}`,
        fullTitle: m.title,
        lessons: m.lessons?.length || 0,
    }));

    // Data for Content Distribution Pie Chart
    let totalQuizzes = 0;
    let totalLessons = 0;

    course.modules.forEach(m => {
        if (m.lessons) {
            totalLessons += m.lessons.length;
            m.lessons.forEach(l => {
                if (l.quiz) totalQuizzes += l.quiz.length;
            });
        }
    });

    const contentDistribution = [
        { name: 'Lessons', value: totalLessons },
        { name: 'Quiz Questions', value: totalQuizzes }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

            {/* Bar Chart: Lessons per Module */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-80">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-6">Lessons Per Module</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={moduleData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="lessons" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart: Content Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-80">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Content Distribution</h3>
                <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <PieChart>
                            <Pie
                                data={contentDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {contentDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}
