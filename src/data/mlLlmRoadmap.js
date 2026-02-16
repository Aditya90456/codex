// Comprehensive ML/LLM Roadmap for AI/ML Engineers
// Structured learning path for Machine Learning and Large Language Models

export const mlLlmRoadmap = {
  overview: {
    title: "ML & LLM Engineering Roadmap",
    description: "A structured 8-month plan to become an ML/LLM Engineer at top AI companies",
    totalWeeks: 32,
    estimatedHours: 600,
    targetCompanies: ["OpenAI", "Google DeepMind", "Anthropic", "Meta AI", "Microsoft Research", "Hugging Face", "Cohere", "Stability AI"]
  },

  phases: [
    {
      id: "phase1",
      title: "Python & Math Foundations",
      duration: "Weeks 1-4",
      weeks: 4,
      description: "Master Python programming and essential mathematics for ML",
      goals: [
        "Master Python for data science",
        "Understand linear algebra and calculus",
        "Learn probability and statistics",
        "Build strong NumPy/Pandas skills"
      ],
      topics: [
        {
          id: "python-advanced",
          name: "Advanced Python Programming",
          priority: "High",
          estimatedDays: 7,
          resources: [
            "Python for Data Science Handbook",
            "Effective Python by Brett Slatkin",
            "Real Python tutorials"
          ],
          keySkills: [
            "List comprehensions & generators",
            "Decorators & context managers",
            "OOP & design patterns",
            "Async programming"
          ],
          projects: ["Build a data processing pipeline", "Create a Python package"],
          companies: ["OpenAI", "Google", "Meta"]
        },
        {
          id: "linear-algebra",
          name: "Linear Algebra for ML",
          priority: "High",
          estimatedDays: 7,
          resources: [
            "3Blue1Brown Essence of Linear Algebra",
            "MIT 18.06 Linear Algebra",
            "Linear Algebra Done Right"
          ],
          keySkills: [
            "Vectors & matrices",
            "Eigenvalues & eigenvectors",
            "Matrix decomposition (SVD, PCA)",
            "Vector spaces & transformations"
          ],
          projects: ["Implement PCA from scratch", "Build image compression tool"],
          companies: ["Google DeepMind", "OpenAI", "Meta AI"]
        },
        {
          id: "calculus-probability",
          name: "Calculus & Probability",
          priority: "High",
          estimatedDays: 7,
          resources: [
            "Khan Academy Calculus",
            "MIT 6.041 Probabilistic Systems",
            "Probability for Data Science"
          ],
          keySkills: [
            "Derivatives & gradients",
            "Optimization fundamentals",
            "Probability distributions",
            "Bayesian thinking"
          ],
          projects: ["Gradient descent visualization", "Monte Carlo simulations"],
          companies: ["Anthropic", "OpenAI", "Google"]
        },
        {
          id: "numpy-pandas",
          name: "NumPy & Pandas Mastery",
          priority: "High",
          estimatedDays: 7,
          resources: [
            "NumPy documentation",
            "Pandas cookbook",
            "Data Wrangling with Python"
          ],
          keySkills: [
            "Array operations & broadcasting",
            "Data manipulation & cleaning",
            "Time series analysis",
            "Performance optimization"
          ],
          projects: ["Analyze large datasets", "Build data pipeline"],
          companies: ["All companies"]
        }
      ],
      milestones: [
        "Complete 10 Python projects",
        "Solve 50 math problems",
        "Build 3 data analysis projects"
      ]
    },

    {
      id: "phase2",
      title: "Classical Machine Learning",
      duration: "Weeks 5-10",
      weeks: 6,
      description: "Master traditional ML algorithms and techniques",
      goals: [
        "Understand supervised & unsupervised learning",
        "Master scikit-learn library",
        "Learn feature engineering",
        "Build end-to-end ML pipelines"
      ],
      topics: [
        {
          id: "supervised-learning",
          name: "Supervised Learning Algorithms",
          priority: "High",
          estimatedDays: 10,
          resources: [
            "Hands-On Machine Learning (Géron)",
            "scikit-learn documentation",
            "Andrew Ng's ML course"
          ],
          keySkills: [
            "Linear & logistic regression",
            "Decision trees & random forests",
            "SVM & kernel methods",
            "Gradient boosting (XGBoost, LightGBM)"
          ],
          projects: [
            "House price prediction",
            "Customer churn prediction",
            "Credit risk modeling"
          ],
          companies: ["All companies"]
        },
        {
          id: "unsupervised-learning",
          name: "Unsupervised Learning",
          priority: "High",
          estimatedDays: 8,
          resources: [
            "Pattern Recognition and ML (Bishop)",
            "Clustering algorithms guide",
            "Dimensionality reduction techniques"
          ],
          keySkills: [
            "K-means & hierarchical clustering",
            "PCA & t-SNE",
            "Anomaly detection",
            "Association rules"
          ],
          projects: [
            "Customer segmentation",
            "Anomaly detection system",
            "Recommendation engine"
          ],
          companies: ["Meta", "Google", "Amazon"]
        },
        {
          id: "feature-engineering",
          name: "Feature Engineering & Selection",
          priority: "High",
          estimatedDays: 7,
          resources: [
            "Feature Engineering for ML",
            "Kaggle feature engineering courses",
            "Applied Predictive Modeling"
          ],
          keySkills: [
            "Feature extraction & transformation",
            "Handling missing data",
            "Feature selection methods",
            "Domain-specific features"
          ],
          projects: [
            "Kaggle competition entry",
            "Feature store implementation"
          ],
          companies: ["All companies"]
        },
        {
          id: "model-evaluation",
          name: "Model Evaluation & Validation",
          priority: "High",
          estimatedDays: 7,
          resources: [
            "Cross-validation techniques",
            "Metrics for ML models",
            "A/B testing fundamentals"
          ],
          keySkills: [
            "Cross-validation strategies",
            "Metrics (accuracy, precision, recall, F1, AUC)",
            "Bias-variance tradeoff",
            "Hyperparameter tuning"
          ],
          projects: [
            "Build AutoML pipeline",
            "Model comparison framework"
          ],
          companies: ["All companies"]
        }
      ],
      milestones: [
        "Complete 5 Kaggle competitions",
        "Build 10 ML models from scratch",
        "Deploy 3 ML applications"
      ]
    },

    {
      id: "phase3",
      title: "Deep Learning Fundamentals",
      duration: "Weeks 11-16",
      weeks: 6,
      description: "Master neural networks and deep learning frameworks",
      goals: [
        "Understand neural network architectures",
        "Master PyTorch and TensorFlow",
        "Learn CNNs and RNNs",
        "Build deep learning models"
      ],
      topics: [
        {
          id: "neural-networks",
          name: "Neural Networks Basics",
          priority: "High",
          estimatedDays: 8,
          resources: [
            "Deep Learning (Goodfellow)",
            "Neural Networks and Deep Learning (Nielsen)",
            "Fast.ai course"
          ],
          keySkills: [
            "Feedforward networks",
            "Backpropagation algorithm",
            "Activation functions",
            "Optimization algorithms (SGD, Adam)"
          ],
          projects: [
            "MNIST digit classifier",
            "Neural network from scratch",
            "Fashion MNIST classifier"
          ],
          companies: ["OpenAI", "Google", "Meta"]
        },
        {
          id: "pytorch-tensorflow",
          name: "PyTorch & TensorFlow",
          priority: "High",
          estimatedDays: 10,
          resources: [
            "PyTorch documentation",
            "TensorFlow tutorials",
            "Deep Learning with PyTorch"
          ],
          keySkills: [
            "Tensor operations",
            "Automatic differentiation",
            "Model building & training",
            "GPU acceleration"
          ],
          projects: [
            "Image classifier",
            "Transfer learning project",
            "Custom dataset loader"
          ],
          companies: ["All companies"]
        },
        {
          id: "cnns",
          name: "Convolutional Neural Networks",
          priority: "High",
          estimatedDays: 8,
          resources: [
            "CS231n Stanford course",
            "CNN architectures paper",
            "PyTorch vision tutorials"
          ],
          keySkills: [
            "Convolution & pooling layers",
            "CNN architectures (ResNet, VGG, Inception)",
            "Transfer learning",
            "Object detection (YOLO, R-CNN)"
          ],
          projects: [
            "Image classification app",
            "Object detection system",
            "Face recognition tool"
          ],
          companies: ["Google", "Meta", "OpenAI"]
        },
        {
          id: "rnns-lstm",
          name: "RNNs & Sequence Models",
          priority: "High",
          estimatedDays: 8,
          resources: [
            "Sequence Models course",
            "Understanding LSTM Networks",
            "RNN effectiveness paper"
          ],
          keySkills: [
            "RNN & LSTM architectures",
            "Sequence-to-sequence models",
            "Attention mechanisms",
            "Time series forecasting"
          ],
          projects: [
            "Text generation model",
            "Stock price predictor",
            "Sentiment analyzer"
          ],
          companies: ["OpenAI", "Google", "Anthropic"]
        }
      ],
      milestones: [
        "Build 5 deep learning projects",
        "Contribute to open-source DL library",
        "Publish model on Hugging Face"
      ]
    },

    {
      id: "phase4",
      title: "Natural Language Processing",
      duration: "Weeks 17-22",
      weeks: 6,
      description: "Master NLP and prepare for LLM specialization",
      goals: [
        "Understand NLP fundamentals",
        "Master transformers architecture",
        "Learn text preprocessing & embeddings",
        "Build NLP applications"
      ],
      topics: [
        {
          id: "nlp-basics",
          name: "NLP Fundamentals",
          priority: "High",
          estimatedDays: 7,
          resources: [
            "Speech and Language Processing (Jurafsky)",
            "Natural Language Processing with Python",
            "spaCy documentation"
          ],
          keySkills: [
            "Tokenization & lemmatization",
            "POS tagging & NER",
            "Text classification",
            "Word embeddings (Word2Vec, GloVe)"
          ],
          projects: [
            "Spam classifier",
            "Named entity recognizer",
            "Text summarizer"
          ],
          companies: ["All companies"]
        },
        {
          id: "transformers",
          name: "Transformers Architecture",
          priority: "High",
          estimatedDays: 10,
          resources: [
            "Attention Is All You Need paper",
            "The Illustrated Transformer",
            "Hugging Face course"
          ],
          keySkills: [
            "Self-attention mechanism",
            "Multi-head attention",
            "Positional encoding",
            "Transformer architecture"
          ],
          projects: [
            "Implement transformer from scratch",
            "Fine-tune BERT model",
            "Build translation system"
          ],
          companies: ["OpenAI", "Google", "Anthropic"]
        },
        {
          id: "bert-gpt",
          name: "BERT, GPT & Pre-trained Models",
          priority: "High",
          estimatedDays: 10,
          resources: [
            "BERT paper",
            "GPT-2/GPT-3 papers",
            "Hugging Face Transformers library"
          ],
          keySkills: [
            "Transfer learning in NLP",
            "Fine-tuning strategies",
            "Prompt engineering basics",
            "Model evaluation"
          ],
          projects: [
            "Question answering system",
            "Text generation app",
            "Sentiment analysis API"
          ],
          companies: ["OpenAI", "Anthropic", "Cohere"]
        },
        {
          id: "advanced-nlp",
          name: "Advanced NLP Techniques",
          priority: "High",
          estimatedDays: 9,
          resources: [
            "Recent NLP papers",
            "State-of-the-art models",
            "NLP research blogs"
          ],
          keySkills: [
            "Few-shot learning",
            "Zero-shot classification",
            "Multilingual models",
            "Domain adaptation"
          ],
          projects: [
            "Multilingual chatbot",
            "Document classifier",
            "Information extraction system"
          ],
          companies: ["Google", "Meta", "OpenAI"]
        }
      ],
      milestones: [
        "Fine-tune 5 transformer models",
        "Build 3 NLP applications",
        "Contribute to Hugging Face"
      ]
    },

    {
      id: "phase5",
      title: "Large Language Models (LLMs)",
      duration: "Weeks 23-28",
      weeks: 6,
      description: "Master LLM development, fine-tuning, and deployment",
      goals: [
        "Understand LLM architecture & training",
        "Master prompt engineering",
        "Learn fine-tuning techniques (LoRA, QLoRA)",
        "Build LLM applications"
      ],
      topics: [
        {
          id: "llm-fundamentals",
          name: "LLM Architecture & Training",
          priority: "High",
          estimatedDays: 10,
          resources: [
            "GPT-3 paper",
            "LLaMA paper",
            "Training language models paper",
            "Chinchilla scaling laws"
          ],
          keySkills: [
            "Decoder-only transformers",
            "Scaling laws",
            "Training strategies",
            "Tokenization (BPE, SentencePiece)"
          ],
          projects: [
            "Train small LLM from scratch",
            "Analyze scaling behavior",
            "Build custom tokenizer"
          ],
          companies: ["OpenAI", "Anthropic", "Google DeepMind"]
        },
        {
          id: "prompt-engineering",
          name: "Prompt Engineering & In-Context Learning",
          priority: "High",
          estimatedDays: 7,
          resources: [
            "Prompt Engineering Guide",
            "OpenAI best practices",
            "Chain-of-thought prompting paper"
          ],
          keySkills: [
            "Prompt design patterns",
            "Few-shot prompting",
            "Chain-of-thought reasoning",
            "Prompt optimization"
          ],
          projects: [
            "Build prompt library",
            "Create AI assistant",
            "Develop prompt testing framework"
          ],
          companies: ["OpenAI", "Anthropic", "Cohere"]
        },
        {
          id: "fine-tuning",
          name: "LLM Fine-Tuning (LoRA, QLoRA, PEFT)",
          priority: "High",
          estimatedDays: 10,
          resources: [
            "LoRA paper",
            "QLoRA paper",
            "PEFT library documentation",
            "Hugging Face PEFT guide"
          ],
          keySkills: [
            "Parameter-efficient fine-tuning",
            "LoRA & QLoRA implementation",
            "Instruction tuning",
            "RLHF basics"
          ],
          projects: [
            "Fine-tune LLaMA model",
            "Build domain-specific LLM",
            "Create instruction-tuned model"
          ],
          companies: ["OpenAI", "Anthropic", "Hugging Face"]
        },
        {
          id: "rlhf",
          name: "RLHF & Alignment",
          priority: "High",
          estimatedDays: 9,
          resources: [
            "InstructGPT paper",
            "RLHF from Human Feedback",
            "Constitutional AI paper"
          ],
          keySkills: [
            "Reinforcement learning basics",
            "Reward modeling",
            "PPO algorithm",
            "AI safety & alignment"
          ],
          projects: [
            "Implement RLHF pipeline",
            "Build reward model",
            "Create aligned chatbot"
          ],
          companies: ["OpenAI", "Anthropic", "Google DeepMind"]
        }
      ],
      milestones: [
        "Fine-tune 3 LLMs",
        "Build LLM-powered application",
        "Contribute to open-source LLM project"
      ]
    },

    {
      id: "phase6",
      title: "LLM Applications & RAG",
      duration: "Weeks 29-32",
      weeks: 4,
      description: "Build production LLM applications with RAG and agents",
      goals: [
        "Master RAG (Retrieval-Augmented Generation)",
        "Build LLM agents",
        "Learn vector databases",
        "Deploy LLM applications"
      ],
      topics: [
        {
          id: "rag-systems",
          name: "Retrieval-Augmented Generation (RAG)",
          priority: "High",
          estimatedDays: 7,
          resources: [
            "RAG paper",
            "LangChain documentation",
            "LlamaIndex guide",
            "Vector database tutorials"
          ],
          keySkills: [
            "Document chunking strategies",
            "Embedding models",
            "Vector similarity search",
            "RAG pipeline optimization"
          ],
          projects: [
            "Build document Q&A system",
            "Create knowledge base chatbot",
            "Develop code search engine"
          ],
          companies: ["OpenAI", "Anthropic", "Cohere"]
        },
        {
          id: "llm-agents",
          name: "LLM Agents & Tool Use",
          priority: "High",
          estimatedDays: 7,
          resources: [
            "ReAct paper",
            "AutoGPT architecture",
            "LangChain agents guide",
            "Function calling documentation"
          ],
          keySkills: [
            "Agent architectures",
            "Tool/function calling",
            "Planning & reasoning",
            "Multi-agent systems"
          ],
          projects: [
            "Build autonomous agent",
            "Create research assistant",
            "Develop code generation agent"
          ],
          companies: ["OpenAI", "Anthropic", "Google"]
        },
        {
          id: "vector-databases",
          name: "Vector Databases & Embeddings",
          priority: "High",
          estimatedDays: 5,
          resources: [
            "Pinecone documentation",
            "Weaviate guide",
            "ChromaDB tutorials",
            "FAISS library"
          ],
          keySkills: [
            "Vector database operations",
            "Embedding generation",
            "Similarity search optimization",
            "Hybrid search"
          ],
          projects: [
            "Build semantic search engine",
            "Create recommendation system",
            "Develop similarity finder"
          ],
          companies: ["All companies"]
        },
        {
          id: "llm-deployment",
          name: "LLM Deployment & Production",
          priority: "High",
          estimatedDays: 9,
          resources: [
            "vLLM documentation",
            "TensorRT-LLM guide",
            "Model optimization techniques",
            "Production ML systems"
          ],
          keySkills: [
            "Model quantization",
            "Inference optimization",
            "API development",
            "Monitoring & logging"
          ],
          projects: [
            "Deploy LLM API",
            "Build scalable chatbot",
            "Create production pipeline"
          ],
          companies: ["All companies"]
        }
      ],
      milestones: [
        "Build 3 RAG applications",
        "Deploy production LLM system",
        "Create portfolio of LLM projects"
      ]
    }
  ],

  // Company-specific focus
  companyFocus: {
    openai: {
      name: "OpenAI",
      focusAreas: ["LLM Training", "RLHF", "Prompt Engineering", "Safety"],
      keySkills: ["GPT architecture", "Alignment", "API development"],
      difficulty: "Very Hard",
      tips: "Focus on cutting-edge research, safety, and scalability"
    },
    anthropic: {
      name: "Anthropic",
      focusAreas: ["Constitutional AI", "RLHF", "Safety", "Interpretability"],
      keySkills: ["Claude architecture", "AI safety", "Alignment research"],
      difficulty: "Very Hard",
      tips: "Emphasize safety, interpretability, and responsible AI"
    },
    google: {
      name: "Google DeepMind",
      focusAreas: ["Transformers", "Scaling", "Multimodal", "Research"],
      keySkills: ["PaLM/Gemini", "Research papers", "Large-scale training"],
      difficulty: "Very Hard",
      tips: "Strong research background, publish papers, contribute to TensorFlow"
    },
    meta: {
      name: "Meta AI",
      focusAreas: ["LLaMA", "Open Source", "Multimodal", "PyTorch"],
      keySkills: ["PyTorch", "Open-source contributions", "Research"],
      difficulty: "Hard",
      tips: "Contribute to PyTorch, work on open-source LLMs"
    },
    huggingface: {
      name: "Hugging Face",
      focusAreas: ["Transformers", "Open Source", "Community", "Deployment"],
      keySkills: ["Transformers library", "Model hub", "Community engagement"],
      difficulty: "Medium-Hard",
      tips: "Active open-source contributions, community involvement"
    }
  },

  // Learning resources
  resources: {
    courses: [
      "Fast.ai Practical Deep Learning",
      "Stanford CS224N NLP",
      "Stanford CS229 Machine Learning",
      "DeepLearning.AI courses",
      "Hugging Face NLP course"
    ],
    books: [
      "Deep Learning (Goodfellow)",
      "Hands-On Machine Learning (Géron)",
      "Speech and Language Processing (Jurafsky)",
      "Designing Machine Learning Systems (Huyen)"
    ],
    papers: [
      "Attention Is All You Need",
      "BERT, GPT-2, GPT-3",
      "LLaMA, LLaMA 2",
      "InstructGPT, Constitutional AI",
      "LoRA, QLoRA"
    ]
  }
};

export default mlLlmRoadmap;
