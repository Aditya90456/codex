import { useState } from 'react';
import { useOperator, PERMISSIONS } from '../../contexts/OperatorContext';
import { Plus, Edit, Trash2, Eye, Code } from 'lucide-react';

const ProblemManagement = () => {
  const { hasPermission } = useOperator();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const problems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Array', submissions: 1234, acceptance: '45%' },
    { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', category: 'Linked List', submissions: 890, acceptance: '38%' },
    { id: 3, title: 'Longest Substring', difficulty: 'Medium', category: 'String', submissions: 756, acceptance: '32%' },
    { id: 4, title: 'Median of Arrays', difficulty: 'Hard', category: 'Array', submissions: 234, acceptance: '28%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Problem Management</h2>
        {hasPermission(PERMISSIONS.CREATE_PROBLEMS) && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Problem
          </button>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Problem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Submissions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Acceptance</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {problems.map(problem => (
              <tr key={problem.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 text-white font-medium">{problem.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    problem.difficulty === 'Easy' ? 'bg-green-900/50 text-green-400' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                    'bg-red-900/50 text-red-400'
                  }`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">{problem.category}</td>
                <td className="px-6 py-4 text-gray-300">{problem.submissions}</td>
                <td className="px-6 py-4 text-gray-300">{problem.acceptance}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    {hasPermission(PERMISSIONS.EDIT_PROBLEMS) && (
                      <button className="p-2 text-green-400 hover:bg-green-900/30 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {hasPermission(PERMISSIONS.DELETE_PROBLEMS) && (
                      <button className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemManagement;
