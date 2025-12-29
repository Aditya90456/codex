const express = require('express');
const router = express.Router();
const problems = require('../data/problems');

// Get all problems with pagination and filtering
router.get('/', (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      difficulty, 
      category, 
      search 
    } = req.query;

    let filteredProblems = [...problems];

    // Filter by difficulty
    if (difficulty) {
      filteredProblems = filteredProblems.filter(
        p => p.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    // Filter by category
    if (category) {
      filteredProblems = filteredProblems.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search in title and description
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProblems = filteredProblems.filter(
        p => p.title.toLowerCase().includes(searchTerm) ||
             p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProblems = filteredProblems.slice(startIndex, endIndex);

    // Remove solutions from response for security
    const problemsWithoutSolutions = paginatedProblems.map(problem => {
      const { solution, ...problemWithoutSolution } = problem;
      return problemWithoutSolution;
    });

    res.json({
      problems: problemsWithoutSolutions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredProblems.length / limit),
        totalProblems: filteredProblems.length,
        hasNext: endIndex < filteredProblems.length,
        hasPrev: startIndex > 0
      },
      filters: {
        difficulties: [...new Set(problems.map(p => p.difficulty))],
        categories: [...new Set(problems.map(p => p.category))]
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// Get a specific problem by ID
router.get('/:id', (req, res) => {
  try {
    const problemId = parseInt(req.params.id);
    const problem = problems.find(p => p.id === problemId);

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Remove solution from response for security
    const { solution, ...problemWithoutSolution } = problem;

    res.json(problemWithoutSolution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});

// Get problem statistics
router.get('/:id/stats', (req, res) => {
  try {
    const problemId = parseInt(req.params.id);
    const problem = problems.find(p => p.id === problemId);

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Mock statistics - in a real app, this would come from a database
    const stats = {
      totalSubmissions: Math.floor(Math.random() * 10000) + 1000,
      acceptedSubmissions: Math.floor(Math.random() * 5000) + 500,
      acceptanceRate: 0,
      averageRuntime: Math.floor(Math.random() * 100) + 10,
      memoryUsage: Math.floor(Math.random() * 50) + 10,
      topLanguages: [
        { language: 'JavaScript', percentage: 35 },
        { language: 'Python', percentage: 30 },
        { language: 'Java', percentage: 20 },
        { language: 'C++', percentage: 15 }
      ]
    };

    stats.acceptanceRate = Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch problem statistics' });
  }
});

// Get random problem
router.get('/random/pick', (req, res) => {
  try {
    const { difficulty } = req.query;
    let availableProblems = problems;

    if (difficulty) {
      availableProblems = problems.filter(
        p => p.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    if (availableProblems.length === 0) {
      return res.status(404).json({ error: 'No problems found with specified criteria' });
    }

    const randomIndex = Math.floor(Math.random() * availableProblems.length);
    const randomProblem = availableProblems[randomIndex];

    // Remove solution from response
    const { solution, ...problemWithoutSolution } = randomProblem;

    res.json(problemWithoutSolution);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch random problem' });
  }
});

module.exports = router;